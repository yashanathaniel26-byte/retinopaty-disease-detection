from __future__ import annotations

import logging
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load .env from the backend directory
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from app.rag_service import rag_service
from app.routes import router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Retinopathy Inference API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize RAG service (load KB + compute/load embeddings)."""
    try:
        rag_service.initialize()
        logger.info("RAG service ready")
    except Exception as exc:
        logger.error("RAG initialization failed (non-fatal): %s", exc)
        logger.info("Interpret endpoint will attempt lazy init on first request")
