from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _sample_image_path() -> Path:
    repo_root = Path(__file__).resolve().parents[2]
    return repo_root / "Drusen.jpeg"


def test_health_ok():
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] in {"ok", "error"}


def test_predict_requires_file():
    response = client.post("/predict")
    assert response.status_code == 422


def test_predict_rejects_non_image():
    response = client.post(
        "/predict",
        files={"file": ("dummy.txt", b"not-an-image", "text/plain")},
    )
    assert response.status_code == 400


def test_predict_success():
    image_path = _sample_image_path()
    assert image_path.exists(), "Sample image not found: Drusen.jpeg"

    with image_path.open("rb") as handle:
        response = client.post(
            "/predict",
            files={"file": (image_path.name, handle, "image/jpeg")},
        )

    assert response.status_code == 200
    payload = response.json()
    assert "label" in payload
    assert "confidence" in payload
    assert "top_5" in payload
    assert 0.0 <= payload["confidence"] <= 1.0
