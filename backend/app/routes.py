from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import MODEL_PATH
from app.inference_service import InferenceService
from app.model_repo import ModelRepo
from app.predict_controller import PredictController

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
