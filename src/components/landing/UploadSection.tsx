"use client";

import { useMemo, useState } from "react";

type Prediction = {
  class_index: number;
  label: string;
  confidence: number;
};

type PredictResponse = {
  class_index: number;
  label: string;
  confidence: number;
  top_5: Prediction[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/jpg"]);
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const LOW_CONFIDENCE_THRESHOLD = 0.8;

const RECOMMENDATIONS: Record<string, string> = {
  normal: "Tidak ditemukan temuan mencurigakan. Lanjutkan pemeriksaan rutin.",
  "macular-scar":
    "Sarankan evaluasi lanjutan untuk memastikan dampak pada ketajaman visual.",
  pterygium: "Anjurkan pemantauan ukuran dan konsultasi bila iritasi meningkat.",
  "disc-edema":
    "Perlu rujukan segera untuk evaluasi tekanan intrakranial dan saraf optik.",
  "branch-retinal-vein-occlusion":
    "Sarankan konsultasi retina untuk terapi dan pemantauan edema makula.",
  "central-serous-chorioretinopathy":
    "Pertimbangkan evaluasi faktor stres dan tindak lanjut retina.",
  drusen: "Rekomendasikan kontrol berkala untuk memantau progresi makula.",
  glaucoma: "Sarankan pemeriksaan tekanan intraokular dan lapang pandang.",
  "retinal-detachment":
    "Rujuk segera ke spesialis retina untuk penanganan darurat.",
  "diabetic-retinopathy-severe":
    "Perlu rujukan segera untuk penilaian laser atau terapi anti-VEGF.",
  "age-macular-degeneration":
    "Sarankan evaluasi retina dan edukasi perubahan gaya hidup.",
  cataract: "Pertimbangkan evaluasi bedah katarak bila penglihatan terganggu.",
  "diabetic-retinopathy-mild":
    "Anjurkan kontrol gula darah dan follow-up retina berkala.",
  "retinitis-pigmentosa":
    "Sarankan konseling genetika dan monitoring progresif.",
  "macular-epiretinal-membrane":
    "Pertimbangkan konsultasi untuk penilaian kebutuhan tindakan bedah.",
  myopia: "Anjurkan pemantauan perubahan fundus dan koreksi refraksi.",
  "diabetic-retinopathy-proliferative":
    "Rujuk segera untuk evaluasi tindakan laser/anti-VEGF.",
  "refractive-media-opacity":
    "Sarankan pemeriksaan penyebab kekeruhan media refraksi.",
  "macular-hole":
    "Perlu evaluasi retina untuk penentuan penanganan bedah.",
};

const formatLabel = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<string | null>(null);

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
    <section id="upload" className="mt-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Upload Citra
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            Unggah file untuk memulai screening.
          </h2>
          <p className="text-sm text-slate-600">
            Gunakan file retina yang jelas. Data hanya dipakai untuk analisis
            instan dan tidak disimpan.
          </p>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
            Tips: pastikan pencahayaan merata dan fokus pada area retina.
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-lg">
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
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
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
                <p className="mt-2 text-xs text-slate-500 transition duration-200 group-hover:text-emerald-600">
                  JPEG, PNG hingga 10MB
                </p>
                <div className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition duration-200 group-hover:border-emerald-300 group-hover:bg-emerald-50/50">
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
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Menganalisis..." : "Mulai Analisis"}
          </button>
          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}
          {result ? (
            <div
              className={`mt-4 rounded-2xl border px-4 py-4 text-sm ${
                result.confidence < LOW_CONFIDENCE_THRESHOLD
                  ? "border-amber-200 bg-amber-50/70 text-amber-900"
                  : "border-emerald-200 bg-emerald-50/70 text-emerald-900"
              }`}
            >
              {result.confidence < LOW_CONFIDENCE_THRESHOLD ? (
                <p className="mb-1 text-sm text-amber-800">
                  Sepertinya kamu mengupload gambar yang salah. Input harus berupa
                  fundus image agar hasilnya akurat.
                </p>
              ) : null}
              {result.confidence >= LOW_CONFIDENCE_THRESHOLD ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Hasil Prediksi
                      </p>
                      <p className="mt-1 text-lg font-semibold text-emerald-900">
                        {formatLabel(result.label)}
                      </p>
                    </div>
                    <div className="text-right text-emerald-900">
                      <p className="text-xs uppercase tracking-[0.2em]">Persentase</p>
                      <p className="text-lg font-semibold">
                        {(result.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white/80 px-3 py-3 text-sm text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Rekomendasi
                    </p>
                    <p className="mt-1">
                      {RECOMMENDATIONS[result.label] ??
                        "Disarankan konsultasi lanjutan dengan tenaga medis."}
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                      Waktu inferensi: {inferenceTime ?? "-"}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {result.top_5.map((item) => (
                      <div
                        key={`${item.label}-${item.class_index}`}
                        className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2"
                      >
                        <span className="text-sm text-slate-700">
                          {formatLabel(item.label)}
                        </span>
                        <span className="text-sm font-semibold text-emerald-800">
                          {(item.confidence * 100).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
