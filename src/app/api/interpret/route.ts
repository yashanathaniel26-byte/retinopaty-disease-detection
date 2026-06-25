import { NextResponse } from "next/server";

/**
 * POST /api/interpret
 *
 * Proxies classification results to the Python backend's RAG-augmented
 * /interpret endpoint. The backend retrieves relevant KB chunks and calls
 * Azure OpenAI to produce a grounded clinical interpretation.
 *
 * API keys never reach the browser (all LLM calls happen server-side).
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body ||
      !body.label ||
      typeof body.confidence !== "number" ||
      !Array.isArray(body.top_5)
    ) {
      return NextResponse.json(
        { error: "Invalid classification payload" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const response = await fetch(`${BACKEND_URL}/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: body.label,
        confidence: body.confidence,
        top_5: body.top_5,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const detail = errorData?.detail ?? "Backend returned an error";
      console.error("Backend interpret error:", response.status, detail);

      // Map backend HTTP status codes to appropriate frontend codes
      if (response.status === 503) {
        return NextResponse.json(
          { error: "LLM service not configured" },
          { status: 503 }
        );
      }
      if (response.status === 504) {
        return NextResponse.json(
          { error: "LLM request timed out" },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: typeof detail === "string" ? detail : "LLM service returned an error" },
        { status: 502 }
      );
    }

    const interpretation = await response.json();
    return NextResponse.json(interpretation);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Interpretation request timed out" },
        { status: 504 }
      );
    }

    // Connection refused = backend not running
    if (
      err instanceof Error &&
      (err.message.includes("ECONNREFUSED") ||
        err.message.includes("fetch failed"))
    ) {
      return NextResponse.json(
        { error: "Backend service is unavailable. Please ensure the Python API is running on port 8000." },
        { status: 503 }
      );
    }

    console.error("Interpret route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
