"""LLM interpretation service using Azure OpenAI with RAG context."""

from __future__ import annotations

import json
import logging
from typing import Any

import httpx

from app import config

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt (same JSON schema as the Next.js route, enhanced for RAG)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are a retinal disease specialist providing clinical interpretation of retinal screening results from an AI classifier.

Your role is to:
1. Contextualize the AI findings within standard clinical frameworks
2. Identify patterns that suggest disease progression
3. Generate actionable next-step recommendations
4. Assess urgency (routine follow-up vs. urgent referral)
5. Use the provided clinical reference material to ground your interpretation in evidence-based guidelines

IMPORTANT: Respond in Indonesian (Bahasa Indonesia) for all patient-facing text.
Clinical terms may remain in English for accuracy.

Output ONLY valid JSON in this exact structure (no markdown, no preamble):
{
  "clinicalInterpretation": {
    "title": "string - diagnosis title",
    "summary": "string - 2-3 sentence clinical summary",
    "findingsDetail": ["string - detailed finding per detected condition"],
    "stagingRationale": "string - why this staging was assigned"
  },
  "riskAssessment": {
    "currentRiskLevel": "low | moderate | high",
    "progressionRisk6mo": "string - estimated 6-month progression",
    "progressionRisk1yr": "string - estimated 1-year progression",
    "riskFactors": ["string - risk factor"],
    "protectiveFactors": ["string - protective factor"]
  },
  "recommendations": {
    "referralUrgency": "string - e.g. Rutin (2-4 minggu) or Segera",
    "nextStepsForClinician": ["string - action item"],
    "patientActions": ["string - patient action item"]
  },
  "patientEducation": {
    "simpleSummary": "string - plain language summary for patient",
    "whatItMeans": "string - what the finding means in simple terms",
    "whatYouCanDo": ["string - actionable patient step"],
    "whenToSeeDoctor": "string - when to seek medical attention",
    "importantNote": "string - important caveat or reassurance"
  }
}

Do NOT include markdown fences, explanations, or preamble. Output ONLY the JSON object."""


class LLMService:
    """Calls Azure OpenAI to produce RAG-augmented clinical interpretations."""

    def interpret(self, classification: dict[str, Any], chunks: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Produce a structured clinical interpretation.

        Args:
            classification: The model prediction dict (label, confidence, top_5).
            chunks: Retrieved KB chunks from RAGService.

        Returns:
            Parsed JSON interpretation dict.

        Raises:
            RuntimeError: If Azure OpenAI is unreachable or returns invalid data.
        """
        if not config.AZURE_OPENAI_API_KEY or not config.AZURE_OPENAI_ENDPOINT:
            raise RuntimeError("Azure OpenAI is not configured")

        # Build RAG context from chunks
        clinical_context = self._build_clinical_context(chunks)
        patient_context = self._build_patient_context(chunks)

        # Build user message
        user_message = self._build_user_message(classification, clinical_context, patient_context)

        # Call Azure OpenAI (AI Foundry Serverless endpoint)
        url = f"{config.AZURE_OPENAI_ENDPOINT}/chat/completions"

        try:
            resp = httpx.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {config.AZURE_OPENAI_API_KEY}",
                },
                json={
                    "model": config.AZURE_OPENAI_DEPLOYMENT,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000,
                    "response_format": {"type": "json_object"},
                },
                timeout=45.0,
            )
            resp.raise_for_status()
        except httpx.TimeoutException:
            raise RuntimeError("LLM request timed out")
        except httpx.HTTPStatusError as exc:
            logger.error("Azure OpenAI error: %s %s", exc.response.status_code, exc.response.text)
            raise RuntimeError(f"LLM service returned error {exc.response.status_code}")
        except Exception as exc:
            logger.error("LLM call failed: %s", exc)
            raise RuntimeError("LLM service is unavailable")

        data = resp.json()
        text_content = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not text_content:
            raise RuntimeError("Empty response from LLM")

        try:
            return json.loads(text_content)
        except json.JSONDecodeError as exc:
            logger.error("LLM returned invalid JSON: %s", text_content[:200])
            raise RuntimeError("LLM returned malformed JSON") from exc

    # ------------------------------------------------------------------
    # Context assembly
    # ------------------------------------------------------------------

    @staticmethod
    def _build_clinical_context(chunks: list[dict[str, Any]]) -> str:
        """Assemble clinical chunks into a reference section."""
        clinical = [c for c in chunks if c.get("clinical_summary", False)]
        if not clinical:
            return "No clinical reference material available."

        parts: list[str] = []
        for chunk in clinical:
            header = f"[{chunk['id']}] {chunk['title']} (source: {chunk.get('source', 'N/A')})"
            parts.append(f"{header}\n{chunk['content']}")
        return "\n\n---\n\n".join(parts)

    @staticmethod
    def _build_patient_context(chunks: list[dict[str, Any]]) -> str:
        """Assemble patient-friendly chunks."""
        patient = [c for c in chunks if c.get("patient_friendly", False)]
        if not patient:
            return ""
        parts: list[str] = []
        for chunk in patient:
            parts.append(f"[{chunk['id']}] {chunk['title']}\n{chunk['content']}")
        return "\n\n---\n\n".join(parts)

    @staticmethod
    def _build_user_message(
        classification: dict[str, Any],
        clinical_context: str,
        patient_context: str,
    ) -> str:
        label = classification.get("label", "unknown")
        confidence = classification.get("confidence", 0.0)
        top_5 = classification.get("top_5", [])

        top5_text = "\n".join(
            f"- {p.get('label', 'unknown')}: {p.get('confidence', 0.0) * 100:.1f}%"
            for p in top_5
        )

        msg = f"""Interpret these retinal screening classification results:

Label terdeteksi: {label}
Confidence: {confidence * 100:.1f}%

Top-5 prediksi:
{top5_text}

---

## Clinical Reference Material (from Knowledge Base)

Use this evidence-based information to ground your interpretation:

{clinical_context}
"""

        if patient_context:
            msg += f"""
---

## Patient Education Resources

Use this to inform patient-facing text:

{patient_context}
"""

        msg += """
---

Provide a structured clinical interpretation following the JSON schema.
Write patient-facing text in Indonesian. Clinical terms may stay in English.
Cite or reference the provided clinical material where relevant."""

        return msg


# Singleton
llm_service = LLMService()
