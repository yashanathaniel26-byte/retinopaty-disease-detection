"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PredictResponse } from "@/types/classification";
import type { InterpretationResponse } from "@/types/interpretation";

type UseLLMInterpretationReturn = {
  interpretation: InterpretationResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Automatically fetches an LLM interpretation in the background
 * as soon as a classification result is available.
 *
 * The classification tab renders instantly; the interpretation tab
 * shows a spinner until this promise resolves.
 */
export function useLLMInterpretation(
  result: PredictResponse | null
): UseLLMInterpretationReturn {
  const [interpretation, setInterpretation] =
    useState<InterpretationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether the current result has already been fetched
  const fetchedRef = useRef<string | null>(null);

  const fetchInterpretation = useCallback(async () => {
    if (!result) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: result.label,
          confidence: result.confidence,
          top_5: result.top_5,
        }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error ?? "Gagal memuat interpretasi.");
      }

      const data = (await res.json()) as InterpretationResponse;
      setInterpretation(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui."
      );
      console.error("LLM interpretation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [result]);

  useEffect(() => {
    if (!result) {
      setInterpretation(null);
      setError(null);
      fetchedRef.current = null;
      return;
    }

    // Deduplicate: only fetch once per unique result
    const key = `${result.label}-${result.confidence}`;
    if (fetchedRef.current === key) return;
    fetchedRef.current = key;

    fetchInterpretation();
  }, [result, fetchInterpretation]);

  const refetch = useCallback(() => {
    fetchedRef.current = null;
    fetchInterpretation();
  }, [fetchInterpretation]);

  return { interpretation, isLoading, error, refetch };
}
