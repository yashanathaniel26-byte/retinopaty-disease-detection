type Step = {
  title: string;
  description: string;
};

type StepsSectionProps = {
  steps: Step[];
};

export default function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section id="cara-kerja" className="mt-20">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl font-[var(--font-display)] text-slate-900">
              Proses sederhana dalam tiga langkah.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-slate-500">
            Mulai dari unggah citra hingga laporan singkat yang siap digunakan.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                0{index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
