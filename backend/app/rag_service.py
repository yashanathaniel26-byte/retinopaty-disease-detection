"""RAG retrieval service: hybrid search (BM25 + cosine similarity) over the retinopathy KB."""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any

import httpx
import numpy as np

from app import config

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Label -> search-query mapping (model label to clinical search terms)
# ---------------------------------------------------------------------------
LABEL_QUERY_MAP: dict[str, str] = {
    "normal": "normal healthy retina no disease",
    "macular-scar": "macular scar retinal scarring macula",
    "pterygium": "pterygium conjunctival growth cornea",
    "disc-edema": "disc edema papilledema optic nerve swelling",
    "branch-retinal-vein-occlusion": "branch retinal vein occlusion BRVO hemorrhage",
    "central-serous-chorioretinopathy": "central serous chorioretinopathy CSC subretinal fluid",
    "drusen": "drusen age-related macular degeneration AMD yellow deposits",
    "glaucoma": "glaucoma optic neuropathy cupping visual field",
    "retinal-detachment": "retinal detachment rhegmatogenous tractional",
    "diabetic-retinopathy-severe": "severe nonproliferative diabetic retinopathy NPDR severe 4-2-1 rule",
    "age-macular-degeneration": "age-related macular degeneration AMD drusen geographic atrophy",
    "cataract": "cataract lens opacity crystalline lens",
    "diabetic-retinopathy-mild": "mild nonproliferative diabetic retinopathy NPDR mild microaneurysm",
    "retinitis-pigmentosa": "retinitis pigmentosa RP bone spicule night blindness",
    "macular-epiretinal-membrane": "epiretinal membrane macular pucker cellophane maculopathy",
    "myopia": "myopia nearsightedness axial length",
    "diabetic-retinopathy-proliferative": "proliferative diabetic retinopathy PDR neovascularization",
    "refractive-media-opacity": "refractive media opacity corneal opacity",
    "macular-hole": "macular hole foveal defect vitreomacular traction",
}


class RAGService:
    """Hybrid retrieval engine over the retinopathy knowledge base."""

    def __init__(self) -> None:
        self.chunks: list[dict[str, Any]] = []
        self.embeddings: np.ndarray | None = None  # (N, D)
        self._initialized = False

    # ------------------------------------------------------------------
    # Initialization
    # ------------------------------------------------------------------

    def initialize(self) -> None:
        """Load KB and prepare embeddings.  Called once at app startup."""
        self._load_kb()
        self._prepare_embeddings()
        self._initialized = True
        logger.info("RAG service initialized with %d chunks", len(self.chunks))

    def _load_kb(self) -> None:
        kb_path = Path(config.KB_PATH)
        if not kb_path.exists():
            raise FileNotFoundError(f"Knowledge base not found at {kb_path}")
        with open(kb_path, encoding="utf-8") as f:
            self.chunks = json.load(f)
        logger.info("Loaded %d chunks from %s", len(self.chunks), kb_path)

    def _prepare_embeddings(self) -> None:
        """Load cached embeddings or compute them from scratch."""
        cache_path = Path(config.KB_CACHE_PATH)
        if cache_path.exists():
            try:
                with open(cache_path, encoding="utf-8") as f:
                    cached = json.load(f)
                if len(cached) == len(self.chunks):
                    self.embeddings = np.array(cached, dtype=np.float32)
                    logger.info("Loaded cached embeddings (%d vectors)", len(cached))
                    return
                logger.warning("Cache size mismatch (%d vs %d), recomputing", len(cached), len(self.chunks))
            except Exception:
                logger.warning("Failed to load embedding cache, recomputing")

        self.embeddings = self._compute_embeddings()
        # Save cache
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(self.embeddings.tolist(), f)
        logger.info("Computed and cached %d embeddings", len(self.embeddings))

    def _compute_embeddings(self) -> np.ndarray:
        """Compute embeddings for all chunks via Azure OpenAI."""
        if not config.AZURE_OPENAI_API_KEY:
            logger.warning("Azure OpenAI key not set; skipping embedding computation. Semantic search disabled.")
            return np.zeros((len(self.chunks), 1), dtype=np.float32)

        texts = [c["content"] for c in self.chunks]
        url = f"{config.AZURE_OPENAI_ENDPOINT}/embeddings"

        try:
            resp = httpx.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {config.AZURE_OPENAI_API_KEY}",
                },
                json={"input": texts, "model": config.AZURE_OPENAI_EMBEDDING_DEPLOYMENT},
                timeout=60.0,
            )
            resp.raise_for_status()
            data = resp.json()
            # Sort by index (API may return out of order)
            sorted_data = sorted(data["data"], key=lambda x: x["index"])
            embeddings = np.array([d["embedding"] for d in sorted_data], dtype=np.float32)
            logger.info("Computed embeddings: shape=%s", embeddings.shape)
            return embeddings
        except httpx.HTTPStatusError as exc:
            logger.error("Embedding API failed: %s %s", exc.response.status_code, exc.response.text[:300])
            return np.zeros((len(self.chunks), 1), dtype=np.float32)
        except Exception as exc:
            logger.error("Embedding computation failed: %s. Semantic search disabled.", exc)
            return np.zeros((len(self.chunks), 1), dtype=np.float32)

    # ------------------------------------------------------------------
    # Retrieval
    # ------------------------------------------------------------------

    def retrieve(self, label: str, top_5: list[dict[str, Any]] | None = None, top_k: int = 6) -> list[dict[str, Any]]:
        """Hybrid retrieval: BM25 + cosine similarity, ranked with RRF."""
        if not self._initialized:
            self.initialize()

        query = self._build_query(label, top_5)

        # 1) BM25 keyword search
        bm25_scores = self._bm25_search(query)

        # 2) Semantic (cosine similarity) search
        semantic_scores = self._semantic_search(query)

        # 3) RRF fusion
        rrf_scores = self._rrf_fusion(bm25_scores, semantic_scores)

        # 4) Pick top-K
        ranked_indices = sorted(range(len(rrf_scores)), key=lambda i: rrf_scores[i], reverse=True)[:top_k]
        return [self.chunks[i] for i in ranked_indices]

    def _build_query(self, label: str, top_5: list[dict[str, Any]] | None) -> str:
        """Build a natural-language query from classification results."""
        parts: list[str] = []
        # Primary label
        primary = LABEL_QUERY_MAP.get(label, label.replace("-", " "))
        parts.append(primary)
        # Secondary labels from top-5
        if top_5:
            for pred in top_5[1:3]:  # 2nd and 3rd predictions
                lbl = pred.get("label", "")
                parts.append(LABEL_QUERY_MAP.get(lbl, lbl.replace("-", " ")))
        return " ".join(parts)

    # ------------------------------------------------------------------
    # BM25 keyword search (lightweight in-memory implementation)
    # ------------------------------------------------------------------

    def _bm25_search(self, query: str, k1: float = 1.5, b: float = 0.75) -> list[float]:
        """Score each chunk against the query using BM25."""
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return [0.0] * len(self.chunks)

        # Build corpus
        corpus_tokens = [self._tokenize(self._chunk_text(c)) for c in self.chunks]
        n = len(corpus_tokens)
        avg_dl = sum(len(doc) for doc in corpus_tokens) / max(n, 1)

        # Document frequency
        df: dict[str, int] = {}
        for doc in corpus_tokens:
            doc_set = set(doc)
            for t in doc_set:
                df[t] = df.get(t, 0) + 1

        scores = [0.0] * n
        for i, doc in enumerate(corpus_tokens):
            dl = len(doc)
            tf_map: dict[str, int] = {}
            for t in doc:
                tf_map[t] = tf_map.get(t, 0) + 1

            score = 0.0
            for qt in query_tokens:
                if qt not in tf_map:
                    continue
                tf = tf_map[qt]
                idf = max(0.0, np.log((n - df.get(qt, 0) + 0.5) / (df.get(qt, 0) + 0.5) + 1.0))
                norm_tf = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avg_dl))
                score += idf * norm_tf
            scores[i] = score

        return scores

    def _chunk_text(self, chunk: dict[str, Any]) -> str:
        """Combine title, keywords, and content for search."""
        parts = [chunk.get("title", ""), " ".join(chunk.get("keywords", [])), chunk.get("content", "")]
        return " ".join(parts)

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        """Simple whitespace + lowercase tokenizer."""
        text = text.lower()
        text = re.sub(r"[^\w\s-]", " ", text)
        return [t for t in text.split() if len(t) > 1]

    # ------------------------------------------------------------------
    # Semantic (cosine similarity) search
    # ------------------------------------------------------------------

    def _semantic_search(self, query: str) -> list[float]:
        """Score each chunk by cosine similarity to the query embedding."""
        if self.embeddings is None or self.embeddings.shape[1] <= 1:
            return [0.0] * len(self.chunks)

        query_emb = self._embed_query(query)
        if query_emb is None:
            return [0.0] * len(self.chunks)

        # Cosine similarity: (N,)
        norms = np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_emb)
        norms = np.maximum(norms, 1e-10)  # avoid division by zero
        similarities = (self.embeddings @ query_emb) / norms
        return similarities.tolist()

    def _embed_query(self, text: str) -> np.ndarray | None:
        """Embed a single query string via Azure OpenAI."""
        if not config.AZURE_OPENAI_API_KEY:
            return None

        url = f"{config.AZURE_OPENAI_ENDPOINT}/embeddings"
        try:
            resp = httpx.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {config.AZURE_OPENAI_API_KEY}",
                },
                json={"input": [text], "model": config.AZURE_OPENAI_EMBEDDING_DEPLOYMENT},
                timeout=15.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return np.array(data["data"][0]["embedding"], dtype=np.float32)
        except Exception as exc:
            logger.error("Query embedding failed: %s", exc)
            return None

    # ------------------------------------------------------------------
    # RRF (Reciprocal Rank Fusion)
    # ------------------------------------------------------------------

    @staticmethod
    def _rrf_fusion(scores_a: list[float], scores_b: list[float], k: int = 60) -> list[float]:
        """Fuse two score lists using Reciprocal Rank Fusion."""
        n = len(scores_a)

        # Rank each list (highest score = rank 1)
        rank_a = RAGService._scores_to_ranks(scores_a)
        rank_b = RAGService._scores_to_ranks(scores_b)

        fused = [0.0] * n
        for i in range(n):
            fused[i] = 1.0 / (k + rank_a[i]) + 1.0 / (k + rank_b[i])
        return fused

    @staticmethod
    def _scores_to_ranks(scores: list[float]) -> list[int]:
        """Convert scores to ranks (1-based, highest score = rank 1)."""
        indexed = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)
        ranks = [0] * len(scores)
        for rank, (idx, _) in enumerate(indexed, start=1):
            ranks[idx] = rank
        return ranks


# Singleton
rag_service = RAGService()
