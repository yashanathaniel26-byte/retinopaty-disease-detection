"use client";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

type Stat = {
  label: string;
  value: string;
};

const HERO_TAGLINE = "Retinopathy insight, cepat dan klinis.";

type HeroSectionProps = {
  stats: Stat[];
};

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="-mt-6 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-10 text-center">
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
          AI Screening Retinopati
        </p>
        <h1 className="mx-auto w-full max-w-5xl">
          <TextGenerateEffect
            words={HERO_TAGLINE}
            className="mx-auto w-full max-w-5xl"
            textClassName="whitespace-nowrap text-2xl font-[var(--font-display)] leading-tight text-slate-900 sm:text-3xl md:text-4xl"
          />
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          Bantu klinik merangkum risiko dan menyiapkan rekomendasi tindak lanjut
          dengan alur yang tenang dan terstruktur.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#upload"
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Mulai Analisis
        </a>
        <a
          href="#cara-kerja"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Lihat Cara Kerja
        </a>
      </div>
      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 shadow-sm"
          >
            <p className="text-2xl font-semibold text-slate-900">
              {item.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* <div className="relative flex w-full max-w-2xl flex-wrap items-center justify-center gap-6 rounded-3xl border border-emerald-100 bg-white/80 px-6 py-5 text-xs uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
        <span>
          Real-time AI
        </span>
        <span>
          Secure Workflow
        </span>
        <span>
          Clinical Ready
        </span>
      </div> */}
    </section>
  );
}
