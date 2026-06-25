"use client";

import { Printer, Download } from "lucide-react";
import type { PredictResponse } from "@/types/classification";
import {
  getRiskLevel,
  getRiskBadgeClasses,
  getRiskLabel,
  formatLabel,
  RECOMMENDATIONS,
} from "@/lib/risk";

type ClassificationTabProps = {
  result: PredictResponse;
  inferenceTime: string | null;
};

export default function ClassificationTab({
  result,
  inferenceTime,
}: ClassificationTabProps) {
  const riskLevel = getRiskLevel(result.confidence);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Risk Badge */}
      <div className={getRiskBadgeClasses(riskLevel)}>
        {getRiskLabel(riskLevel)}
      </div>

      {/* Confidence Bar */}
      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Confidence Score
        </p>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
            />
          </div>
          <span className="min-w-[3rem] text-right text-sm font-medium text-emerald-700">
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Detected Conditions */}
      <div>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Kondisi Terdeteksi
        </p>
        <div className="grid gap-2">
          {result.top_5.map((item) => (
            <div
              key={`${item.label}-${item.class_index}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300"
            >
              <span className="text-sm font-medium text-slate-900">
                {formatLabel(item.label)}
              </span>
              <span className="text-sm font-medium text-emerald-700">
                {(item.confidence * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700">
          Rekomendasi Tindak Lanjut
        </p>
        <p className="text-sm leading-relaxed text-emerald-900">
          {RECOMMENDATIONS[result.label] ??
            "Disarankan konsultasi lanjutan dengan tenaga medis."}
        </p>
        {inferenceTime && (
          <p className="mt-2 text-xs text-slate-500">
            Waktu inferensi: {inferenceTime}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          Download Laporan
        </button>
      </div>
    </div>
  );
}
