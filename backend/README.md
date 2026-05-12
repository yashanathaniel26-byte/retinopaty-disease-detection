# FastAPI Backend (ONNX)

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /predict` (form-data: `file`)

## Model path

Set `MODEL_PATH` if you want to point to a different ONNX file.
