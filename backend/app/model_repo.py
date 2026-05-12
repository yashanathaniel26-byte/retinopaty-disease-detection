from __future__ import annotations

import os

import onnxruntime as ort


class ModelRepo:
    def __init__(self, model_path: str) -> None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        self._session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"],
        )
        self._input_name = self._session.get_inputs()[0].name

    def predict(self, input_tensor):
        outputs = self._session.run(None, {self._input_name: input_tensor})
        return outputs[0]
