export default function SiteHeader() {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">
              RETINA CARE
            </p>
            <p className="font-[var(--font-display)] text-base">
              Retinopathy Insight
            </p>
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
  );
}
