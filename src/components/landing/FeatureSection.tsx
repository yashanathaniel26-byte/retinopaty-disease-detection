"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import FeatureWobbleCards from "@/components/FeatureWobbleCards";

export default function FeatureSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.08 });

  return (
    <section id="fitur" className="mt-12 sm:mt-14">
      <div
        ref={headRef}
        className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4"
      >
        <div className={`reveal reveal-left ${headVisible ? "visible" : ""}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs">
            Fitur Utama
          </p>
          <h2 className="mt-2 text-2xl font-[var(--font-display)] text-slate-900 sm:mt-3 sm:text-3xl">
            Fokus pada output yang mudah ditindaklanjuti.
          </h2>
        </div>
        <p className={`reveal reveal-right reveal-delay-150 text-sm text-slate-500 sm:max-w-md ${headVisible ? "visible" : ""}`}>
          Dirancang untuk klinik dan tim optometri agar proses screening lebih
          sistematis tanpa mengorbankan kejelasan.
        </p>
      </div>

      <div
        ref={cardsRef}
        className={`reveal reveal-up reveal-delay-200 mt-8 sm:mt-10 ${cardsVisible ? "visible" : ""}`}
      >
        <FeatureWobbleCards />
      </div>
    </section>
  );
}
