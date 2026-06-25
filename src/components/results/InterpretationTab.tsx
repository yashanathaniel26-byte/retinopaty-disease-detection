"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Shield,
  Stethoscope,
  ClipboardList,
  Loader2,
  ChevronDown,
  Clock,
  AlertTriangle,
  Heart,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterpretationResponse } from "@/types/interpretation";

type InterpretationTabProps = {
  interpretation: InterpretationResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/* ──────────────────────────────────────────────
   Risk Gauge — SVG semi-circle with needle
   ────────────────────────────────────────────── */

function RiskGauge({ level }: { level: string }) {
  const normalized = level === "low" ? 0.15 : level === "moderate" ? 0.5 : 0.85;
  const angle = -90 + normalized * 180; // -90 (left) to +90 (right)

  const color =
    level === "low"
      ? "#10b981"
      : level === "moderate"
        ? "#f59e0b"
        : "#ef4444";

  const label =
    level === "low"
      ? "Rendah"
      : level === "moderate"
        ? "Sedang"
        : "Tinggi";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48 sm:w-56">
        {/* Background arc segments */}
        <path d="M 20 100 A 80 80 0 0 1 66 30" fill="none" stroke="#d1fae5" strokeWidth="14" strokeLinecap="round" />
        <path d="M 66 30 A 80 80 0 0 1 134 30" fill="none" stroke="#fef3c7" strokeWidth="14" strokeLinecap="round" />
        <path d="M 134 30 A 80 80 0 0 1 180 100" fill="none" stroke="#fecaca" strokeWidth="14" strokeLinecap="round" />

        {/* Active arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${normalized * 251} 251`}
          opacity={0.3}
        />

        {/* Needle */}
        <g transform={`rotate(${angle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="35" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill={color} />
          <circle cx="100" cy="100" r="3" fill="white" />
        </g>

        {/* Labels */}
        <text x="18" y="115" className="fill-slate-400 text-[9px]">Rendah</text>
        <text x="85" y="18" className="fill-slate-400 text-[9px]">Sedang</text>
        <text x="158" y="115" className="fill-slate-400 text-[9px]">Tinggi</text>
      </svg>
      <div className="-mt-2 text-center">
        <span
          className="inline-block rounded-full px-3 py-1 text-sm font-semibold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Progression Timeline — horizontal bars
   ────────────────────────────────────────────── */

function ProgressionTimeline({
  risk6mo,
  risk1yr,
}: {
  risk6mo?: string;
  risk1yr?: string;
}) {
  if (!risk6mo && !risk1yr) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
        Proyeksi Perkembangan
      </p>
      {[
        { label: "6 Bulan", value: risk6mo, icon: Clock },
        { label: "1 Tahun", value: risk1yr, icon: Activity },
      ]
        .filter((item) => item.value)
        .map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <item.icon className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-700">{item.label}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.value}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Collapsible Section — expandable content panel
   ────────────────────────────────────────────── */

function CollapsibleSection({
  title,
  icon: Icon,
  iconColor,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn("h-4 w-4", iconColor)} />
          <span className="text-sm font-medium text-slate-800">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Factor Chips — visual list items
   ────────────────────────────────────────────── */

function FactorChips({
  items,
  variant,
}: {
  items: string[];
  variant: "risk" | "protective";
}) {
  if (!items || items.length === 0) return null;
  const dotColor = variant === "risk" ? "bg-amber-400" : "bg-emerald-400";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
          {item}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */

export default function InterpretationTab({
  interpretation,
  isLoading,
  error,
  refetch,
}: InterpretationTabProps) {
  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-20" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            Menganalisis hasil klinis...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            AI sedang memproses interpretasi berdasarkan knowledge base
          </p>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="max-w-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <AlertCircle className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              Tidak bisa memuat interpretasi AI
            </p>
            <p className="mt-1 text-xs text-rose-600">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty State ── */
  if (!interpretation) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-slate-400">Belum ada hasil interpretasi.</p>
      </div>
    );
  }

  const {
    clinicalInterpretation,
    riskAssessment,
    recommendations,
    patientEducation,
  } = interpretation;

  const urgencyColor =
    recommendations.referralUrgency?.toLowerCase().includes("segera")
      ? "bg-rose-500"
      : recommendations.referralUrgency?.toLowerCase().includes("minggu")
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════
          Row 1: Risk Gauge + Clinical Summary (2-col on desktop)
          ═══════════════════════════════════════ */}
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Risk Gauge Card */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
          <RiskGauge level={riskAssessment.currentRiskLevel} />
          <ProgressionTimeline
            risk6mo={riskAssessment.progressionRisk6mo}
            risk1yr={riskAssessment.progressionRisk1yr}
          />
        </div>

        {/* Clinical Summary */}
        <div className="flex flex-col gap-4">
          {/* Diagnosis header */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Stethoscope className="h-4.5 w-4.5 text-emerald-700" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-slate-900">
                  {clinicalInterpretation.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {clinicalInterpretation.summary}
                </p>
              </div>
            </div>
            {clinicalInterpretation.stagingRationale && (
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-700">Dasar analisis: </span>
                  {clinicalInterpretation.stagingRationale}
                </p>
              </div>
            )}
          </div>

          {/* Risk Factors */}
          {(riskAssessment.riskFactors.length > 0 ||
            (riskAssessment.protectiveFactors &&
              riskAssessment.protectiveFactors.length > 0)) && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  Faktor Risiko
                </p>
              </div>
              <div className="space-y-3">
                {riskAssessment.riskFactors.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs text-slate-500">Faktor risiko:</p>
                    <FactorChips items={riskAssessment.riskFactors} variant="risk" />
                  </div>
                )}
                {riskAssessment.protectiveFactors &&
                  riskAssessment.protectiveFactors.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs text-slate-500">Faktor protektif:</p>
                      <FactorChips
                        items={riskAssessment.protectiveFactors}
                        variant="protective"
                      />
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Row 2: Urgency Banner
          ═══════════════════════════════════════ */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3",
          urgencyColor === "bg-rose-500"
            ? "border-rose-200 bg-rose-50"
            : urgencyColor === "bg-amber-500"
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50",
        )}
      >
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", urgencyColor)}>
          <AlertTriangle className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Urgensi Rujukan
          </p>
          <p
            className={cn(
              "text-sm font-semibold",
              urgencyColor === "bg-rose-500"
                ? "text-rose-800"
                : urgencyColor === "bg-amber-500"
                  ? "text-amber-800"
                  : "text-emerald-800",
            )}
          >
            {recommendations.referralUrgency}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Row 3: Collapsible Detail Sections
          ═══════════════════════════════════════ */}
      <div className="space-y-3">
        {/* Findings Detail */}
        {clinicalInterpretation.findingsDetail.length > 0 && (
          <CollapsibleSection
            title="Temuan Klinis Detail"
            icon={Stethoscope}
            iconColor="text-emerald-600"
            defaultOpen={true}
          >
            <ul className="space-y-2.5">
              {clinicalInterpretation.findingsDetail.map((finding, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {finding}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* Patient Education */}
        <CollapsibleSection
          title="Edukasi Pasien"
          icon={BookOpen}
          iconColor="text-blue-600"
          defaultOpen={false}
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-700">
              {patientEducation.simpleSummary}
            </p>
            <div className="rounded-lg bg-blue-50 px-3.5 py-3">
              <p className="text-sm leading-relaxed text-blue-900">
                {patientEducation.whatItMeans}
              </p>
            </div>
            {patientEducation.whatYouCanDo.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-700">
                  Yang bisa Anda lakukan:
                </p>
                <ul className="space-y-1.5">
                  {patientEducation.whatYouCanDo.map((action, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-slate-600"
                    >
                      <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <p className="text-sm leading-relaxed text-amber-900">
                <span className="font-medium">Kapan harus ke dokter: </span>
                {patientEducation.whenToSeeDoctor}
              </p>
            </div>
            {patientEducation.importantNote && (
              <p className="text-xs leading-relaxed text-slate-400 italic">
                {patientEducation.importantNote}
              </p>
            )}
          </div>
        </CollapsibleSection>

        {/* Next Steps */}
        <CollapsibleSection
          title="Langkah Selanjutnya"
          icon={ClipboardList}
          iconColor="text-violet-600"
          defaultOpen={false}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendations.nextStepsForClinician.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Untuk klinisi
                </p>
                <ul className="space-y-1.5">
                  {recommendations.nextStepsForClinician.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recommendations.patientActions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Untuk pasien
                </p>
                <ul className="space-y-1.5">
                  {recommendations.patientActions.map((action, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-slate-600"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-center text-xs leading-relaxed text-slate-400">
        Interpretasi ini dihasilkan oleh AI dan bukan merupakan diagnosis definitif.
        Keputusan klinis tetap memerlukan pemeriksaan langsung oleh tenaga medis.
      </p>
    </div>
  );
}
