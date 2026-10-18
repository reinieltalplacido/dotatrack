import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#06070A] text-zinc-400 text-xs font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="max-w-md space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex h-5 w-5 items-center justify-center rounded-xs overflow-hidden">
                <Image
                  src="/dotatrack.png"
                  alt="DotaTrack"
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white">
                DOTA<span className="text-rose-500">TRACK</span>
              </span>
              <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-1.5 py-0.2 rounded-xs">
                STATS PLATFORM
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              High-performance Dota 2 player statistics, match history tracking, and hero analytics engineered for competitive players.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-5 text-xs text-zinc-400" aria-label="Footer Navigation">
            <Link href="/" className="hover:text-white transition-colors">
              OVERVIEW
            </Link>
            <Link href="/match-data" className="hover:text-white transition-colors">
              MATCH ANALYZER
            </Link>
            <Link href="/meta-trends" className="hover:text-white transition-colors">
              META TRENDS
            </Link>
            <Link href="/tournaments" className="hover:text-white transition-colors">
              TOURNAMENTS
            </Link>
            <Link href="/heroes" className="hover:text-white transition-colors">
              HEROES
            </Link>
            <a href="#pipeline" className="hover:text-white transition-colors">
              PIPELINE
            </a>
            <a
              href="https://docs.opendota.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              OPENDOTA API ↗
            </a>
          </nav>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p className="max-w-2xl leading-relaxed font-sans">
            DotaTrack is an independent fan project and is not affiliated with, sponsored, or endorsed by Valve
            Corporation. Dota 2, the Dota 2 logo, and Steam are registered trademarks of Valve Corporation.
          </p>
          <div className="shrink-0 text-zinc-400 font-mono">
            © {currentYear} DOTATRACK. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
