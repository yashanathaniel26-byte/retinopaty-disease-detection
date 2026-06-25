import type { RiskLevel } from "@/types/classification";
import { cn } from "@/lib/utils";

/**
 * Map a model confidence score to a semantic risk level.
 */
export function getRiskLevel(confidence: number): RiskLevel {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.6) return "medium";
  return "low";
}

/**
 * Return Tailwind classes for a risk badge, keeping the existing emerald/amber/rose palette.
 */
export function getRiskBadgeClasses(level: RiskLevel): string {
  const base = "inline-block rounded px-3 py-1.5 text-xs font-medium border";
  switch (level) {
    case "high":
      return cn(base, "bg-emerald-50 text-emerald-900 border-emerald-200");
    case "medium":
      return cn(base, "bg-amber-50 text-amber-900 border-amber-200");
    case "low":
      return cn(base, "bg-rose-50 text-rose-700 border-rose-200");
  }
}

/**
 * Human-readable risk label.
 */
export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "high":
      return "RISIKO TINGGI";
    case "medium":
      return "RISIKO SEDANG";
    case "low":
      return "RISIKO RENDAH";
  }
}

/**
 * Format a kebab-case label into Title Case.
 */
export function formatLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Clinical recommendation text per detected condition label (Indonesian).
 */
export const RECOMMENDATIONS: Record<string, string> = {
  normal: "Tidak ditemukan temuan mencurigakan. Lanjutkan pemeriksaan rutin.",
  "macular-scar":
    "Sarankan evaluasi lanjutan untuk memastikan dampak pada ketajaman visual.",
  pterygium:
    "Anjurkan pemantauan ukuran dan konsultasi bila iritasi meningkat.",
  "disc-edema":
    "Perlu rujukan segera untuk evaluasi tekanan intrakranial dan saraf optik.",
  "branch-retinal-vein-occlusion":
    "Sarankan konsultasi retina untuk terapi dan pemantauan edema makula.",
  "central-serous-chorioretinopathy":
    "Pertimbangkan evaluasi faktor stres dan tindak lanjut retina.",
  drusen: "Rekomendasikan kontrol berkala untuk memantau progresi makula.",
  glaucoma:
    "Sarankan pemeriksaan tekanan intraokular dan lapang pandang.",
  "retinal-detachment":
    "Rujuk segera ke spesialis retina untuk penanganan darurat.",
  "diabetic-retinopathy-severe":
    "Perlu rujukan segera untuk penilaian laser atau terapi anti-VEGF.",
  "age-macular-degeneration":
    "Sarankan evaluasi retina dan edukasi perubahan gaya hidup.",
  cataract:
    "Pertimbangkan evaluasi bedah katarak bila penglihatan terganggu.",
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

/** Threshold below which the model result is considered unreliable. */
export const LOW_CONFIDENCE_THRESHOLD = 0.8;
