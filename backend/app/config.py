from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

# ---------------------------------------------------------------------------
# Model / inference config
# ---------------------------------------------------------------------------

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(BASE_DIR / "models" / "onnx" / "retinal_classifier_efficientnet_b1.onnx"),
)

IMAGE_SIZE = 288

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

# ---------------------------------------------------------------------------
# Azure OpenAI config (for RAG + LLM interpretation)
# ---------------------------------------------------------------------------

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o-mini")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "text-embedding-3-small")

# ---------------------------------------------------------------------------
# Knowledge base config
# ---------------------------------------------------------------------------

KB_PATH = os.getenv(
    "KB_PATH",
    str(BASE_DIR / "backend" / "app" / "data" / "retinopathy_kb.json"),
)
KB_CACHE_PATH = os.getenv(
    "KB_CACHE_PATH",
    str(BASE_DIR / "backend" / "app" / "data" / "kb_embeddings_cache.json"),
)
