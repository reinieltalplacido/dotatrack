import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = 2026;
  const githubRepoUrl = "https://github.com/reinieltalplacido/dotatrack";

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#06070B] text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top grid: Brand Info + Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 pb-12 border-b border-white/[0.06]">
          {/* Brand Info (Span 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm bg-black/40 border border-white/[0.08] p-0.5">
                <Image
                  src="/dotatrack.png"
                  alt="DotaTrack"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                DotaTrack
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Open-source Dota 2 analytics platform. Search player match history, evaluate hero meta trends, inspect advantage curves, and track pro tournament circuits.
            </p>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/heroes"
                  className="hover:text-white transition-colors"
                >
                  Heroes Compendium
                </Link>
              </li>
              <li>
                <Link
                  href="/meta-trends"
                  className="hover:text-white transition-colors"
                >
                  Meta Tier Trends
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="hover:text-white transition-colors"
                >
                  Pro Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/match-data"
                  className="hover:text-white transition-colors"
                >
                  Match Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Data & Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Data &amp; Source
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.opendota.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>OpenDota API</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://liquipedia.net/dota2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Liquipedia Esports</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://developer.valvesoftware.com/wiki/Dota_2_XML_RPC_API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Valve Steam API</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p className="max-w-2xl leading-relaxed">
            DotaTrack is an independent open-source fan project and is not affiliated with or endorsed by Valve Corporation. Dota 2, Steam, and their respective logos are trademarks of Valve Corporation.
          </p>
          <div className="flex items-center gap-4 shrink-0 text-zinc-400 font-mono">
            <span>© {currentYear} DotaTrack</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
