"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  faqs: FaqItem[];
};

const delayClasses = [
  "reveal-delay-100",
  "reveal-delay-200",
  "reveal-delay-300",
  "reveal-delay-400",
  "reveal-delay-500",
  "reveal-delay-600",
] as const;

export default function FaqSection({ faqs }: FaqSectionProps) {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.08 });

  return (
    <section id="faq" className="mt-16 sm:mt-20">
      <div
        ref={headRef}
        className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6"
      >
        <div className={`reveal reveal-left ${headVisible ? "visible" : ""}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-[var(--font-display)] text-slate-900 sm:mt-3 sm:text-3xl">
            Pertanyaan yang sering muncul.
          </h2>
        </div>
        <p className={`reveal reveal-right reveal-delay-150 text-sm text-slate-500 sm:max-w-sm ${headVisible ? "visible" : ""}`}>
          Butuh info tambahan? Hubungi tim kami untuk demo klinik.
        </p>
      </div>

      <div ref={cardsRef} className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.question}
            className={`reveal reveal-zoom ${delayClasses[i % delayClasses.length]} rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:rounded-3xl sm:p-6 ${cardsVisible ? "visible" : ""}`}
          >
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:mt-3">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
