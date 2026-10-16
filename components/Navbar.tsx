"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ShieldAlert } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090A0F]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-sm"
          aria-label="DotaTrack Homepage"
        >
          {/* Stylized Dota 2 inspired emblem */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-rose-600 via-red-700 to-[#12080C] p-[1px] shadow-sm shadow-rose-950/40">
            <div className="flex h-full w-full items-center justify-center rounded-[3px] bg-[#0D0E14]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-rose-500 transition-colors group-hover:text-rose-400"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fillOpacity="0.2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded bg-rose-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center">
              Dota<span className="text-rose-500 font-extrabold ml-0.5">Track</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 -mt-1 hidden sm:block">
              Analytics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded px-1"
          >
            Home
          </Link>
          <a
            href="#heroes"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded px-1"
          >
            Heroes
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded px-1"
          >
            About
          </a>
        </nav>

        {/* CTA Track Player Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#search-section"
            onClick={scrollToSearch}
            className="inline-flex items-center gap-2 rounded-md border border-rose-600/50 bg-gradient-to-b from-rose-600/90 to-rose-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm shadow-rose-950/50 transition-all hover:border-rose-500 hover:from-rose-500 hover:to-rose-600 hover:shadow-rose-900/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Track Player
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0C0E14] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-zinc-800/60"
          >
            Home
          </Link>
          <a
            href="#heroes"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
          >
            Heroes
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
          >
            About
          </a>
          <div className="pt-2">
            <a
              href="#search-section"
              onClick={scrollToSearch}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Track Player
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
