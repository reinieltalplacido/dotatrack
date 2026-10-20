import Link from "next/link";
import Image from "next/image";
import { GitPullRequest, GitFork, ExternalLink, Star } from "lucide-react";

export function Footer() {
  const currentYear = 2026;
  const githubRepoUrl = "https://github.com/reinieltalplacido/dotatrack";

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#06070A] text-zinc-400 text-xs">
      {/* Upper Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/[0.06]">
          {/* Brand & Contribution Section (Spans 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-xs overflow-hidden border border-rose-900/40 bg-black/60 p-0.5">
                <Image
                  src="/dotatrack.png"
                  alt="DotaTrack"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white font-mono">
                DOTA<span className="text-rose-500">TRACK</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded">
                STATS PLATFORM
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                OPEN SOURCE
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-md font-sans">
              High-performance Dota 2 player statistics, match history tracking, and hero analytics engineered for competitive players. Fully open source and community-driven.
            </p>

            {/* GitHub Contribute Card */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-3 hover:border-white/[0.14] transition-colors max-w-md">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-white shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-white">Want to contribute?</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  v7.37e
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                DotaTrack is built for the community. Star the project, report issues, or submit pull requests on GitHub.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11px] font-mono border border-white/[0.1] hover:border-white/[0.2] transition-colors"
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Star on GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-400 ml-0.5" />
                </a>
                <a
                  href={`${githubRepoUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-mono border border-white/[0.06] transition-colors"
                >
                  <GitPullRequest className="w-3 h-3 text-rose-400" />
                  <span>Contribute / PRs</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-mono">
            <h3 className="text-[11px] font-semibold text-zinc-200 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/match-data" className="hover:text-white transition-colors">
                  Match Analyzer
                </Link>
              </li>
              <li>
                <Link href="/meta-trends" className="hover:text-white transition-colors">
                  Meta Trends
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-white transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/heroes" className="hover:text-white transition-colors">
                  Heroes
                </Link>
              </li>
              <li>
                <Link href="/#pipeline" className="hover:text-white transition-colors">
                  Pipeline Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-mono">
            <h3 className="text-[11px] font-semibold text-zinc-200 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Data Sources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://docs.opendota.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>OpenDota API</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://liquipedia.net/dota2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Liquipedia Dota 2</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://developer.valvesoftware.com/wiki/Valve_Web_API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Steam Web API</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.dota2.com/news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Official Dota 2 News</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Open Source / Community Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-mono">
            <h3 className="text-[11px] font-semibold text-zinc-200 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Community
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href={`${githubRepoUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Report an Issue</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href={`${githubRepoUrl}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Pull Requests</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href={`${githubRepoUrl}/fork`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <GitFork className="w-3 h-3 text-zinc-400" />
                  <span>Fork Project</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Legal Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p className="max-w-2xl leading-relaxed font-sans">
            DotaTrack is an independent open-source fan project and is not affiliated with, sponsored, or endorsed by
            Valve Corporation. Dota 2, the Dota 2 logo, and Steam are registered trademarks of Valve Corporation.
          </p>
          <div className="shrink-0 text-zinc-500 font-mono text-left md:text-right space-y-0.5">
            <div>© {currentYear} DOTATRACK. ALL RIGHTS RESERVED.</div>
            <div className="text-[10px] text-zinc-600">Built for the competitive Dota 2 community.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
