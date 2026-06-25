"use client";

import { useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { PredictResponse } from "@/types/classification";
import { LOW_CONFIDENCE_THRESHOLD } from "@/lib/risk";
import ResultsTabs from "@/components/results/ResultsTabs";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/jpg"]);
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<string | null>(null);

  const { ref: headRef, isVisible: headVisible } = useScrollReveal();
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal({ threshold: 0.08 });

  const filePreview = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const resetSelection = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    setInferenceTime(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setSelectedFile(null);
        setResult(null);
        setInferenceTime(null);
        setErrorMessage("Ukuran file maksimal 10MB.");
        event.target.value = "";
        return;
      }
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      const isAllowed =
        ALLOWED_MIME_TYPES.has(file.type) ||
        ALLOWED_EXTENSIONS.includes(extension);
      if (!isAllowed) {
        setSelectedFile(null);
        setResult(null);
        setInferenceTime(null);
        setErrorMessage("Hanya mendukung file PNG, JPG, atau JPEG.");
        event.target.value = "";
        return;
      }
    }
    setSelectedFile(file);
    setResult(null);
    setErrorMessage(null);
    setInferenceTime(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);
    setInferenceTime(null);

    try {
      const startTime = performance.now();
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        const message = detail?.detail ?? "Gagal memproses gambar.";
        throw new Error(message);
      }

      const data = (await response.json()) as PredictResponse;
      setResult(data);
      const elapsedSeconds = (performance.now() - startTime) / 1000;
      setInferenceTime(`${elapsedSeconds.toFixed(2)}s`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memanggil API.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="upload" className="mt-16 sm:mt-20">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: info */}
        <div
          ref={headRef}
          className={`reveal reveal-left space-y-3 sm:space-y-4 ${headVisible ? "visible" : ""}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs">
            Upload Citra
          </p>
          <h2 className="text-2xl font-[var(--font-display)] text-slate-900 sm:text-3xl">
            Unggah file untuk memulai screening.
          </h2>
          <p className="text-sm text-slate-600">
            Gunakan file retina yang jelas. Data hanya dipakai untuk analisis
            instan dan tidak disimpan.
          </p>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-900 sm:rounded-2xl sm:p-4">
            Tips: pastikan pencahayaan merata dan fokus pada area retina.
          </div>
        </div>

        {/* Right: upload card */}
        <div
          ref={cardRef}
          className={`reveal reveal-right reveal-delay-150 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:rounded-3xl sm:p-6 ${cardVisible ? "visible" : ""}`}
        >
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-lg sm:rounded-2xl sm:p-6">
            {filePreview ? (
              <button
                type="button"
                onClick={resetSelection}
                className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                aria-label="Hapus gambar dan pilih ulang"
              >
                <img
                  alt="Preview retina"
                  src={filePreview}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-56"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/30 text-xs font-semibold uppercase tracking-[0.3em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-rose-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M9 10v7" />
                      <path d="M15 10v7" />
                      <path d="M6 6l1 14h10l1-14" />
                    </svg>
                    <span>Klik untuk hapus</span>
                  </div>
                </div>
              </button>
            ) : (
              <label className="group flex cursor-pointer flex-col items-center">
                <p className="text-sm font-semibold text-slate-700 transition duration-200 group-hover:text-emerald-700">
                  Seret file atau pilih dari perangkat
                </p>
                <p className="mt-1.5 text-xs text-slate-500 transition duration-200 group-hover:text-emerald-600">
                  JPEG, PNG hingga 10MB
                </p>
                <div className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 transition duration-200 group-hover:border-emerald-300 group-hover:bg-emerald-50/50 sm:mt-4">
                  Pilih file gambar
                </div>
                <input
                  aria-label="Unggah citra retina"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:rounded-2xl"
          >
            {isLoading ? "Menganalisis..." : "Mulai Analisis"}
          </button>

          {errorMessage ? (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mt-4 sm:rounded-2xl">
              {errorMessage}
            </div>
          ) : null}

          {result?.confidence && result.confidence < LOW_CONFIDENCE_THRESHOLD ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-800 sm:mt-4 sm:rounded-2xl">
              Sepertinya kamu mengupload gambar yang salah. Input harus berupa
              fundus image agar hasilnya akurat.
            </div>
          ) : null}
        </div>
      </div>

      {/* Results — full-width, separate row below the upload card */}
      {result ? (
        <div className="mt-6 sm:mt-8">
          <ResultsTabs result={result} inferenceTime={inferenceTime} />
        </div>
      ) : null}
    </section>
  );
}
