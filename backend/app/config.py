from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(BASE_DIR / "models" / "onnx" / "retinal_classifier_efficientnet_b1.onnx"),
)

IMAGE_SIZE = 288

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]
