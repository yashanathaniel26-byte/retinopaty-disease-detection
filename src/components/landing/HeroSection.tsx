"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
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
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: textRef, isVisible: textVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: btnRef, isVisible: btnVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="-mt-6 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-8 text-center sm:gap-10">
      <div className="space-y-4 sm:space-y-5">
        <p
          ref={tagRef}
          className={`reveal reveal-down text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs sm:tracking-[0.35em] ${tagVisible ? "visible" : ""}`}
        >
          AI Screening Retinopati
        </p>
        <h1
          ref={textRef}
          className={`reveal reveal-up mx-auto w-full max-w-5xl reveal-delay-100 ${textVisible ? "visible" : ""}`}
        >
          <TextGenerateEffect
            words={HERO_TAGLINE}
            className="mx-auto w-full max-w-5xl"
            textClassName="text-xl font-[var(--font-display)] leading-tight text-slate-900 sm:text-3xl md:text-4xl"
          />
        </h1>
        <p
          className={`reveal reveal-up reveal-delay-200 mx-auto max-w-xs text-sm text-slate-600 sm:max-w-2xl sm:text-base md:text-lg ${textVisible ? "visible" : ""}`}
        >
          Bantu klinik merangkum risiko dan menyiapkan rekomendasi tindak lanjut
          dengan alur yang tenang dan terstruktur.
        </p>
      </div>

      <div
        ref={btnRef}
        className={`reveal reveal-up reveal-delay-300 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 ${btnVisible ? "visible" : ""}`}
      >
        <a
          href="#upload"
          className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
        >
          Mulai Analisis
        </a>
        <a
          href="#cara-kerja"
          className="w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 sm:w-auto"
        >
          Lihat Cara Kerja
        </a>
      </div>

      <div
        ref={statsRef}
        className="grid w-full max-w-3xl grid-cols-3 gap-3 sm:gap-4"
      >
        {stats.map((item, i) => (
          <div
            key={item.label}
            className={`reveal reveal-zoom reveal-delay-${i === 0 ? "200" : i === 1 ? "300" : "400"} rounded-2xl border border-slate-200 bg-white/80 px-3 py-4 shadow-sm sm:px-4 sm:py-5 ${statsVisible ? "visible" : ""}`}
          >
            <p className="text-lg font-semibold text-slate-900 sm:text-2xl">
              {item.value}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
