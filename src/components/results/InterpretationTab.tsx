"use client";

import { AlertCircle, BookOpen, Shield, Stethoscope, ClipboardList, Loader2 } from "lucide-react";
import type { InterpretationResponse } from "@/types/interpretation";

type InterpretationTabProps = {
  interpretation: InterpretationResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export default function InterpretationTab({
  interpretation,
  isLoading,
  error,
  refetch,
}: InterpretationTabProps) {
  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="max-w-[240px] text-center text-sm text-slate-500">
          Menganalisis hasil dengan interpretasi klinis AI...
        </p>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Tidak bisa memuat interpretasi AI.</span>
          </div>
          <p className="mt-1 text-xs text-rose-600">{error}</p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  /* ── Empty State ── */
  if (!interpretation) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Belum ada hasil interpretasi.
        </p>
      </div>
    );
  }

  const {
    clinicalInterpretation,
    riskAssessment,
    recommendations,
    patientEducation,
  } = interpretation;

  return (
    <div className="space-y-6">
      {/* ── Clinical Interpretation ── */}
      <section className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-l-4 border-emerald-600 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-emerald-700" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700">
              Interpretasi Klinis
            </p>
          </div>
          <h3 className="text-base font-medium text-slate-900">
            {clinicalInterpretation.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {clinicalInterpretation.summary}
          </p>

          {clinicalInterpretation.findingsDetail.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {clinicalInterpretation.findingsDetail.map((finding, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {finding}
                </li>
              ))}
            </ul>
          )}

          {clinicalInterpretation.stagingRationale && (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
              <span className="font-medium text-slate-700">Dasar staging: </span>
              {clinicalInterpretation.stagingRationale}
            </p>
          )}
        </div>
      </section>

      {/* ── Risk Assessment ── */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-700" />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700">
            Penilaian Risiko
          </p>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            {riskAssessment.currentRiskLevel}
          </span>
          {riskAssessment.progressionRisk6mo && (
            <span className="text-xs text-slate-500">
              Risiko 6 bulan: {riskAssessment.progressionRisk6mo}
            </span>
          )}
          {riskAssessment.progressionRisk1yr && (
            <span className="text-xs text-slate-500">
              Risiko 1 tahun: {riskAssessment.progressionRisk1yr}
            </span>
          )}
        </div>

        {riskAssessment.riskFactors.length > 0 && (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium text-slate-700">
              Faktor Risiko:
            </p>
            <ul className="space-y-1">
              {riskAssessment.riskFactors.map((factor, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {riskAssessment.protectiveFactors &&
          riskAssessment.protectiveFactors.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-700">
                Faktor Protektif:
              </p>
              <ul className="space-y-1">
                {riskAssessment.protectiveFactors.map((factor, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </section>

      {/* ── Patient Education ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-700" />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700">
            Edukasi Pasien
          </p>
        </div>

        <p className="text-sm leading-relaxed text-slate-700">
          {patientEducation.simpleSummary}
        </p>

        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-sm leading-relaxed text-slate-600">
            {patientEducation.whatItMeans}
          </p>
        </div>

        {patientEducation.whatYouCanDo.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs font-medium text-slate-700">
              Yang bisa Anda lakukan:
            </p>
            <ul className="space-y-1">
              {patientEducation.whatYouCanDo.map((action, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="font-medium">Kapan harus ke dokter: </span>
            {patientEducation.whenToSeeDoctor}
          </p>
        </div>

        {patientEducation.importantNote && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {patientEducation.importantNote}
          </p>
        )}
      </section>

      {/* ── Recommendations / Next Steps ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-emerald-700" />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700">
            Langkah Selanjutnya
          </p>
        </div>

        <div className="mb-2 inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
          Urgensi rujukan: {recommendations.referralUrgency}
        </div>

        {recommendations.nextStepsForClinician.length > 0 && (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium text-slate-700">
              Untuk klinisi:
            </p>
            <ul className="space-y-1">
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
            <p className="mb-1.5 text-xs font-medium text-slate-700">
              Untuk pasien:
            </p>
            <ul className="space-y-1">
              {recommendations.patientActions.map((action, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="mt-1 shrink-0 text-emerald-500">&#10003;</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Disclaimer ── */}
      <p className="text-center text-xs leading-relaxed text-slate-400">
        Interpretasi ini dihasilkan oleh AI dan bukan merupakan diagnosis definitif.
        Keputusan klinis tetap memerlukan pemeriksaan langsung oleh tenaga medis.
      </p>
    </div>
  );
}
