"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleTrackPlayerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const searchSection = document.getElementById("search-section");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("steam-id-input");
        if (input) {
          input.focus();
        }
      }
    }
  };

  const navLinks = [
    { label: "Hero", href: "/heroes" },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Meta Trends", href: "/meta-trends" },
    { label: "Match Data", href: "/match-data" },
  ];

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
            {/* DotaTrack Brand Logo */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-b from-rose-600/40 via-rose-700/20 to-[#12080C] p-[1px] shadow-sm shadow-rose-950/60 overflow-hidden">
              <Image
                src="/dotatrack.png"
                alt="DotaTrack Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                priority
              />
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

        </div>

        {/* Center: Desktop Navigation Links pointing to their respective pages */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/heroes" && pathname === "/hero");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded ${
                  isActive
                    ? "text-rose-400 font-bold border-b border-rose-500 pb-0.5"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#search-section"
            onClick={handleTrackPlayerClick}
            className="group relative inline-flex items-center gap-2 rounded-sm border border-rose-500/60 bg-gradient-to-b from-rose-600 via-rose-600 to-rose-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)] transition-all hover:border-rose-400 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Search className="h-3.5 w-3.5 text-rose-200 group-hover:text-white transition-colors" aria-hidden="true" />
            <span>Track Player</span>
          </Link>
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/heroes" && pathname === "/hero");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-rose-950/60 text-rose-400 font-bold border border-rose-800/40"
                    : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/#search-section"
              onClick={handleTrackPlayerClick}
              className="flex w-full items-center justify-center gap-2 rounded bg-rose-600 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-rose-500"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Track Player</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
