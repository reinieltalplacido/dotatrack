"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { SearchModal } from "@/components/SearchModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTrackPlayerClick = (e: React.MouseEvent) => {
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
    } else {
      e.preventDefault();
      setSearchModalOpen(true);
    }
  };

  const navLinks = [
    { label: "Heroes", href: "/heroes" },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Meta trends", href: "/meta-trends" },
    { label: "Match data", href: "/match-data" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{
        borderBottom: "1px solid var(--lp-border)",
        backgroundColor: "rgba(12, 13, 18, 0.9)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded"
          aria-label="DotaTrack home"
        >
          <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm">
            <Image
              src="/dotatrack.png"
              alt="DotaTrack Logo"
              width={24}
              height={24}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--lp-fg-strong)" }}
          >
            DotaTrack
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/heroes" && pathname === "/hero");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded"
                style={{
                  color: isActive ? "var(--lp-fg-strong)" : "var(--lp-fg)",
                  opacity: isActive ? 1 : 0.6,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search trigger */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={handleTrackPlayerClick}
            className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
            style={{
              backgroundColor: "rgba(212, 54, 75, 0.12)",
              border: "1px solid rgba(212, 54, 75, 0.25)",
              color: "var(--lp-fg-strong)",
            }}
          >
            <Search className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <span>Track player</span>
            <kbd className="hidden lg:inline-flex items-center text-[10px] bg-black/30 border border-white/10 px-1 py-0.5 rounded opacity-50 ml-1">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Mobile quick actions (Search + Hamburger) */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="inline-flex items-center justify-center rounded p-2.5 text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="Open search dialog"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 min-h-[44px] min-w-[44px] cursor-pointer"
            style={{ color: "var(--lp-fg)" }}
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

      {/* Mobile drawer with backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-14 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-50 md:hidden px-4 pt-3 pb-5 space-y-1"
            style={{
              borderBottom: "1px solid var(--lp-border)",
              backgroundColor: "var(--lp-bg)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/heroes" && pathname === "/hero");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center rounded-sm px-3.5 py-2.5 text-sm font-medium transition-all active:scale-[0.99] min-h-[44px]"
                  style={{
                    color: isActive ? "var(--lp-fg-strong)" : "var(--lp-fg)",
                    opacity: isActive ? 1 : 0.75,
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTrackPlayerClick}
                className="flex w-full items-center justify-center gap-2 rounded px-4 py-3 text-sm font-medium text-white cursor-pointer min-h-[44px] active:scale-[0.99]"
                style={{ backgroundColor: "var(--lp-accent)" }}
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Track player</span>
              </button>
            </div>
          </div>
        </>
      )}

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
}
