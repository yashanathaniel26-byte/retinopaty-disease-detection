const stats = [
  { label: "Akurasi validasi", value: "94.2%" },
  { label: "Kondisi terdeteksi", value: "19 kelas" },
  { label: "Waktu analisis", value: "< 3 detik" },
];

const features = [
  {
    title: "Screening cepat",
    description:
      "Unggah citra retina dan dapatkan ringkasan risiko dengan waktu respons singkat.",
  },
  {
    title: "Metode transparan",
    description:
      "Skor probabilitas dan catatan klinis diringkas agar mudah dipahami tim medis.",
  },
  {
    title: "Privasi terjaga",
    description:
      "Data pasien diproses secara lokal dan hanya hasil agregat yang ditampilkan.",
  },
];

const steps = [
  {
    title: "Unggah citra retina",
    description:
      "Pilih file fundus atau hasil OCT dari perangkat klinik Anda.",
  },
  {
    title: "Analisis otomatis",
    description:
      "Model menilai pola lesi dan mengklasifikasikan tingkat risiko.",
  },
  {
    title: "Laporan ringkas",
    description:
      "Dapatkan saran tindak lanjut yang membantu alur kerja klinis.",
  },
];

const faqs = [
  {
    question: "Apakah ini menggantikan diagnosis dokter?",
    answer:
      "Tidak. Aplikasi ini membantu screening awal, keputusan klinis tetap oleh dokter.",
  },
  {
    question: "Format file yang didukung?",
    answer: "Saat ini mendukung JPEG dan PNG dengan resolusi minimal 512px.",
  },
  {
    question: "Seberapa aman data pasien?",
    answer:
      "File tidak disimpan permanen. Anda dapat menghapus hasil kapan saja.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(13,148,136,0.18),_transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.12),_transparent_70%)] blur-3xl" />
      </div>

      <header className="fixed top-0 z-30 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
                RETINA CARE
              </p>
              <p className="font-[var(--font-display)] text-base">Retinopathy Insight</p>
            </div>
          </div>
          <div className="ml-auto hidden items-center gap-5 text-xs font-medium text-slate-600 md:flex">
            <a className="transition hover:text-slate-900" href="#fitur">
              Fitur
            </a>
            <a className="transition hover:text-slate-900" href="#cara-kerja">
              Cara Kerja
            </a>
            <a className="transition hover:text-slate-900" href="#upload">
              Upload
            </a>
            <a className="transition hover:text-slate-900" href="#faq">
              FAQ
            </a>
          </div>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-24">
        <section className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-10 text-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              AI Screening Retinopati
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-[var(--font-display)] leading-tight text-slate-900 sm:text-5xl">
              Deteksi dini retinopati yang lebih sederhana.
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
            <span className="text-xs text-slate-500">
              Versi demo, tidak menyimpan data pasien.
            </span>
          </div>
          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 shadow-sm"
              >
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative flex w-full max-w-2xl flex-wrap items-center justify-center gap-5 rounded-3xl border border-emerald-100 bg-white/80 px-6 py-5 text-xs uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
            <span>Real-time AI</span>
            <span>Secure Workflow</span>
            <span>Clinical Ready</span>
          </div>
        </section>

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
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
              >
                <div className="mb-4 h-10 w-10 rounded-2xl bg-emerald-50" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

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
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                <p className="mt-2 text-xs text-slate-500">
                  JPEG, PNG hingga 10MB
                </p>
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
      </main>

      <footer className="border-t border-slate-200/70 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500">
          <span>Retinopathy Insight 2026</span>
          <div className="flex items-center gap-4">
            <span>Privasi</span>
            <span>Kontak</span>
            <span>Dokumentasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
