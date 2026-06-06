"use client";

import { useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#fitur", label: "Fitur" },
    { href: "#cara-kerja", label: "Cara Kerja" },
    { href: "#upload", label: "Upload" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 z-30 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-700 sm:text-xs">
              RETINA CARE
            </p>
            <p className="font-[var(--font-display)] text-sm sm:text-base">
              Retinopathy Insight
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="ml-auto hidden items-center gap-5 text-xs font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="transition hover:text-slate-900"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-200/60 bg-white/95 px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-700 transition hover:text-emerald-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
