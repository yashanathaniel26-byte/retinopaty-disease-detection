type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  faqs: FaqItem[];
};

export default function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section id="faq" className="mt-20">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-[var(--font-display)] text-slate-900">
            Pertanyaan yang sering muncul.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-500">
          Butuh info tambahan? Hubungi tim kami untuk demo klinik.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-slate-900">
              {faq.question}
            </h3>
            <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
