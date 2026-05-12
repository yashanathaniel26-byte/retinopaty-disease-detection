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

## Docker (Production)

```bash
docker build -t retinopathy-api .
docker run --rm -p 8000:8000 \
	-e MODEL_PATH=/app/models/onnx/retinal_classifier_efficientnet_b1.onnx \
	retinopathy-api
```

## Docker Compose

```bash
docker compose up -d
```

Dev mode (hot reload):

```bash
docker compose --profile dev up -d
```

## Step-by-step (Beginner Friendly)

1) Build the image

```bash
docker build -t retinopathy-api .
```

2) Run the container

```bash
docker run --rm -p 8000:8000 \
	-e MODEL_PATH=/app/models/onnx/retinal_classifier_efficientnet_b1.onnx \
	retinopathy-api
```

3) Check health

```bash
curl http://localhost:8000/health
```

Expected output:

```json
{"status":"ok","model_loaded":true,"model_error":null}
```

4) Predict with a sample image

```bash
curl -X POST "http://localhost:8000/predict" \
	-F "file=@../Drusen.jpeg"
```

5) Stop the container

Press `Ctrl+C` in the terminal, or if running detached, use:

```bash
docker compose down
```

## Tests

```bash
cd backend
pytest -v
```

## Endpoints

- `GET /health`
- `POST /predict` (form-data: `file`)

## Model path

Set `MODEL_PATH` if you want to point to a different ONNX file.
