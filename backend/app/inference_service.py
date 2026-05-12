from __future__ import annotations

import io

import numpy as np
from PIL import Image

from app import config
from app.labels import CLASS_LABELS
from app.model_repo import ModelRepo


class InferenceService:
    def __init__(self, repo: ModelRepo) -> None:
        self._repo = repo
        self._mean = np.array(config.MEAN, dtype=np.float32)
        self._std = np.array(config.STD, dtype=np.float32)

    def predict(self, image_bytes: bytes) -> dict:
        input_tensor = self._preprocess(image_bytes)
        logits = self._repo.predict(input_tensor)
        probabilities = self._softmax(logits)[0]

        top_indices = np.argsort(probabilities)[::-1][:5]
        top_results = [
            {
                "class_index": int(idx),
                "label": CLASS_LABELS[idx],
                "confidence": float(probabilities[idx]),
            }
            for idx in top_indices
        ]

        best = top_results[0]
        return {
            "class_index": best["class_index"],
            "label": best["label"],
            "confidence": best["confidence"],
            "top_5": top_results,
        }

    def _preprocess(self, image_bytes: bytes) -> np.ndarray:
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as exc:
            raise ValueError("Invalid image file") from exc

        image = image.resize((config.IMAGE_SIZE, config.IMAGE_SIZE), Image.BILINEAR)
        image_array = np.asarray(image, dtype=np.float32) / 255.0
        image_array = (image_array - self._mean) / self._std
        image_array = np.transpose(image_array, (2, 0, 1))
        image_array = np.expand_dims(image_array, axis=0)
        return image_array.astype(np.float32)

    @staticmethod
    def _softmax(logits: np.ndarray) -> np.ndarray:
        logits = logits - np.max(logits, axis=1, keepdims=True)
        exp_scores = np.exp(logits)
        return exp_scores / np.sum(exp_scores, axis=1, keepdims=True)
