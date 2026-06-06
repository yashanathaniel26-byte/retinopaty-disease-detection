export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-6">
        <span className="text-xs sm:text-sm">Retinopathy Insight 2026</span>
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <span>Privasi</span>
          <span>Kontak</span>
          <span>Dokumentasi</span>
        </div>
      </div>
    </footer>
  );
}
