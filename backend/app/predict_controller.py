from __future__ import annotations

from fastapi import HTTPException, UploadFile

from app.inference_service import InferenceService


class PredictController:
    def __init__(self, service: InferenceService) -> None:
        self._service = service

    async def predict(self, file: UploadFile) -> dict:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        image_bytes = await file.read()
        try:
            return self._service.predict(image_bytes)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
