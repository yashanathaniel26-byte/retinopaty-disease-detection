"""Controller for the /interpret endpoint: orchestrates RAG retrieval + LLM generation."""

from __future__ import annotations

import logging
from typing import Any

from app.llm_service import llm_service
from app.rag_service import rag_service

logger = logging.getLogger(__name__)


class InterpretController:
    """Validates input, retrieves relevant KB chunks, calls LLM."""

    def interpret(self, body: dict[str, Any]) -> dict[str, Any]:
        """
        Full RAG pipeline: validate -> retrieve -> generate.

        Args:
            body: Classification payload with label, confidence, top_5.

        Returns:
            Structured interpretation dict from the LLM.

        Raises:
            ValueError: If the input is invalid.
            RuntimeError: If LLM or retrieval fails.
        """
        # --- Validate ---
        label = body.get("label")
        confidence = body.get("confidence")
        top_5 = body.get("top_5")

        if not label or not isinstance(label, str):
            raise ValueError("'label' is required and must be a string")
        if not isinstance(confidence, (int, float)):
            raise ValueError("'confidence' is required and must be a number")
        if not isinstance(top_5, list):
            raise ValueError("'top_5' is required and must be a list")

        # --- Retrieve ---
        chunks = rag_service.retrieve(label=label, top_5=top_5, top_k=6)
        logger.info("Retrieved %d chunks for label=%s: %s", len(chunks), label, [c["id"] for c in chunks])

        # --- Generate ---
        classification = {"label": label, "confidence": confidence, "top_5": top_5}
        interpretation = llm_service.interpret(classification, chunks)

        return interpretation


# Singleton
interpret_controller = InterpretController()
