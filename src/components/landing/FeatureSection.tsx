import FeatureWobbleCards from "@/components/FeatureWobbleCards";

export default function FeatureSection() {
  return (
    <section id="fitur" className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Fitur Utama
          </p>
          <h2 className="mt-3 text-3xl font-[var(--font-display)] text-slate-900">
            Fokus pada output yang mudah ditindaklanjuti.
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-500">
          Dirancang untuk klinik dan tim optometri agar proses screening lebih
          sistematis tanpa mengorbankan kejelasan.
        </p>
      </div>
      <div className="mt-10">
        <FeatureWobbleCards />
      </div>
    </section>
  );
}
