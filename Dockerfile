# Stage 1: builder
FROM python:3.11-slim AS builder

WORKDIR /build
COPY backend/requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

# Stage 2: runtime
FROM python:3.11-slim AS runtime

WORKDIR /app
COPY --from=builder /install /usr/local

COPY backend/app/ ./app/
COPY models/ ./models/

RUN adduser --disabled-password appuser
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request, sys;\n\nurl='http://localhost:8000/health';\n\ntry:\n  urllib.request.urlopen(url, timeout=3).read();\n  sys.exit(0)\nexcept Exception:\n  sys.exit(1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
