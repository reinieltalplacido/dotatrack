"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Activity, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const searchSection = document.getElementById("search-section");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("steam-id-input");
      if (input) {
        input.focus();
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity with Dota 2 Ancient Emblem */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
            aria-label="DotaTrack - Esports Analytics"
          >
            {/* Chiseled Dota Aegis/Ancient Emblem */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-b from-rose-600 via-rose-700 to-[#12080C] p-[1px] shadow-sm shadow-rose-950/60">
              <div className="flex h-full w-full items-center justify-center rounded-sm bg-[#0B0C12]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-rose-500 transition-colors group-hover:text-rose-400"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fillOpacity="0.25" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">
                  DOTA<span className="text-rose-500">TRACK</span>
                </span>
                <span className="hidden sm:inline-block rounded-[3px] bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  v7.37e
                </span>
              </div>
            </div>
          </Link>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center gap-2 border-l border-white/[0.08] pl-5 text-[11px] font-mono text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span>OPENDOTA API: <strong className="text-zinc-300 font-medium">READY</strong></span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-zinc-300" aria-label="Main Navigation">
          <Link
            href="/"
            className="hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
          >
            Overview
          </Link>
          <a
            href="#live-preview"
            className="hover:text-white transition-colors py-1 text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
          >
            Telemetry
          </a>
          <a
            href="#heroes"
            className="hover:text-white transition-colors py-1 text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
          >
            Hero Matrix
          </a>
          <a
            href="#workflow"
            className="hover:text-white transition-colors py-1 text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
          >
            Pipeline
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors py-1 text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
          >
            About
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#search-section"
            onClick={scrollToSearch}
            className="group relative inline-flex items-center gap-2 rounded-sm border border-rose-500/60 bg-gradient-to-b from-rose-600 via-rose-600 to-rose-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)] transition-all hover:border-rose-400 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Search className="h-3.5 w-3.5 text-rose-200 group-hover:text-white transition-colors" aria-hidden="true" />
            <span>Track Player</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-300" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0D0E15] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.05]"
          >
            Overview
          </Link>
          <a
            href="#live-preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05]"
          >
            Telemetry Preview
          </a>
          <a
            href="#heroes"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05]"
          >
            Hero Matrix
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05]"
          >
            Architecture Pipeline
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05]"
          >
            About DotaTrack
          </a>
          <div className="pt-2">
            <a
              href="#search-section"
              onClick={scrollToSearch}
              className="flex w-full items-center justify-center gap-2 rounded bg-rose-600 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-rose-500"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Track Player
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
