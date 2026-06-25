from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import MODEL_PATH
from app.inference_service import InferenceService
from app.interpret_controller import interpret_controller
from app.model_repo import ModelRepo
from app.predict_controller import PredictController

logger = logging.getLogger(__name__)

router = APIRouter()

try:
    _repo = ModelRepo(MODEL_PATH)
    _service = InferenceService(_repo)
    _controller = PredictController(_service)
    _model_error = None
except Exception as exc:
    _repo = None
    _service = None
    _controller = None
    _model_error = str(exc)


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok" if _controller else "error",
        "model_loaded": _controller is not None,
        "model_error": _model_error,
    }


@router.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict:
    if _controller is None:
        raise HTTPException(status_code=500, detail=f"Model not loaded: {_model_error}")

    return await _controller.predict(file)


@router.post("/interpret")
async def interpret(request: dict) -> dict:
    """RAG-augmented LLM interpretation of classification results."""
    try:
        return interpret_controller.interpret(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        msg = str(exc)
        if "timed out" in msg.lower():
            raise HTTPException(status_code=504, detail=msg) from exc
        if "not configured" in msg.lower():
            raise HTTPException(status_code=503, detail=msg) from exc
        raise HTTPException(status_code=502, detail=msg) from exc
    except Exception as exc:
        logger.error("Interpret endpoint error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error") from exc
