"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type Step = {
  title: string;
  description: string;
};

type StepsSectionProps = {
  steps: Step[];
};

export default function StepsSection({ steps }: StepsSectionProps) {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="cara-kerja" className="mt-16 sm:mt-20">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:rounded-3xl sm:p-8">
        <div
          ref={headRef}
          className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6"
        >
          <div className={`reveal reveal-left ${headVisible ? "visible" : ""}`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs">
              Cara Kerja
            </p>
            <h2 className="mt-2 text-2xl font-[var(--font-display)] text-slate-900 sm:mt-3 sm:text-3xl">
              Proses sederhana dalam tiga langkah.
            </h2>
          </div>
          <p className={`reveal reveal-right reveal-delay-150 text-sm text-slate-500 sm:max-w-sm ${headVisible ? "visible" : ""}`}>
            Mulai dari unggah citra hingga laporan singkat yang siap digunakan.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const delays = ["reveal-delay-100", "reveal-delay-300", "reveal-delay-500"] as const;
            return (
              <div
                key={step.title}
                className={`reveal reveal-up ${delays[index]} rounded-xl bg-slate-50 p-4 sm:rounded-2xl sm:p-5 ${cardsVisible ? "visible" : ""}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
                  0{index + 1}
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900 sm:mt-4 sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 sm:mt-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
