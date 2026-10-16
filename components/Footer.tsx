import Link from "next/link";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07080C] text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/[0.06]">
          {/* Brand & Wordmark */}
          <div className="max-w-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-rose-600 to-red-800 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[2px] bg-[#0D0E14]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3 w-3 text-rose-500"
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
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Dota<span className="text-rose-500 font-extrabold ml-0.5">Track</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              High-performance Dota 2 player statistics, match history tracking, and hero analytics for competitive players.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-medium" aria-label="Footer Navigation">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <a href="#search-section" className="hover:text-white transition-colors">
              Track Player
            </a>
            <a href="#heroes" className="hover:text-white transition-colors">
              Heroes
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a
              href="https://docs.opendota.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors text-zinc-400"
            >
              OpenDota Docs ↗
            </a>
          </nav>
        </div>

        {/* Legal Disclaimer & Valve Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p className="max-w-2xl leading-relaxed">
            DotaTrack is an independent fan project and is not affiliated with, sponsored, or endorsed by Valve
            Corporation. Dota 2, the Dota 2 logo, and Steam are registered trademarks of Valve Corporation.
          </p>
          <div className="shrink-0 text-zinc-400">
            © {currentYear} DotaTrack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
