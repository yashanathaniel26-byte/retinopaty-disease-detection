export default function UploadSection() {
  return (
    <section id="upload" className="mt-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Upload Citra
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            Unggah file untuk memulai screening.
          </h2>
          <p className="text-sm text-slate-600">
            Gunakan file retina yang jelas. Data hanya dipakai untuk analisis
            instan dan tidak disimpan.
          </p>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
            Tips: pastikan pencahayaan merata dan fokus pada area retina.
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Seret file atau pilih dari perangkat
            </p>
            <p className="mt-2 text-xs text-slate-500">JPEG, PNG hingga 10MB</p>
            <input
              aria-label="Unggah citra retina"
              type="file"
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Mode cepat</p>
              <p className="mt-1">Cocok untuk screening massal.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Mode rinci</p>
              <p className="mt-1">Menampilkan detail skor tiap kelas.</p>
            </div>
          </div>
          <button className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Mulai Analisis
          </button>
        </div>
      </div>
    </section>
  );
}
