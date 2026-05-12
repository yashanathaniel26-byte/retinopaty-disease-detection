.PHONY: docker-build docker-run docker-compose-up docker-compose-dev docker-compose-down docker-logs test

docker-build:
	docker build -t retinopathy-api .

docker-run:
	docker run --rm -p 8000:8000 \
		-e MODEL_PATH=/app/models/onnx/retinal_classifier_efficientnet_b1.onnx \
		retinopathy-api

docker-compose-up:
	docker compose up -d

docker-compose-dev:
	docker compose --profile dev up -d

docker-compose-down:
	docker compose down

docker-logs:
	docker compose logs -f

test:
	cd backend && pytest -v
