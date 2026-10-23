"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Clock,
  Trophy,
  Swords,
  Search,
} from "lucide-react";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface PlayerHeaderProps {
  data: PlayerDashboardData;
  onOpenSearch?: () => void;
}

export function PlayerHeader({ data, onOpenSearch }: PlayerHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(data.accountId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const winRate = data.lifetime.winRate;

  return (
    <div className="relative border-b border-white/[0.08] bg-[#0A0C13]/90 backdrop-blur-md pt-6 pb-6">
      {/* Background glow behind header */}
      <div className="absolute top-0 right-1/4 -z-10 h-48 w-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] px-4 sm:px-6 lg:px-8">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-rose-500/50 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-rose-500" />
            <span>RETURN TO SEARCH</span>
          </Link>

          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="inline-flex items-center gap-1.5 rounded-sm border border-rose-500/40 bg-rose-950/40 px-3 py-1.5 text-xs font-mono text-rose-300 hover:bg-rose-900/50 hover:text-white transition-all active:scale-95"
              >
                <Search className="h-3.5 w-3.5 text-rose-400" />
                <span>SEARCH ANOTHER PLAYER</span>
              </button>
            )}

            {data.profileUrl && (
              <a
                href={data.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-white/[0.2] hover:text-white transition-all"
                title="Open Steam Community Profile"
              >
                <span>STEAM PROFILE</span>
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </a>
            )}
          </div>
        </div>

        {/* Profile Card Main Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative group shrink-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded border-2 border-white/[0.12] bg-zinc-950 overflow-hidden shadow-2xl group-hover:border-rose-500/70 transition-colors">
                <Image
                  src={data.avatarUrl}
                  alt={data.personaname}
                  width={96}
                  height={96}
                  priority
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>

              {data.plus && (
                <div
                  className="absolute -bottom-2 -right-1 rounded bg-gradient-to-r from-amber-500 to-amber-700 px-1.5 py-0.2 text-[9px] font-mono font-extrabold uppercase text-black tracking-wider shadow-md"
                  title="Dota Plus Subscriber"
                >
                  PLUS
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight truncate">
                  {data.personaname}
                </h1>
                {data.proName && (
                  <span className="rounded bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 text-xs font-mono font-bold text-rose-300 uppercase">
                    PRO: {data.proName}
                  </span>
                )}
                {data.countryCode && (
                  <span className="rounded bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                    {data.countryCode}
                  </span>
                )}
              </div>

              {/* Account IDs & Subtitle */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">ID:</span>
                  <span className="text-zinc-200 font-bold">{data.accountId}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-zinc-500 hover:text-white transition-colors ml-0.5"
                    aria-label="Copy Account ID"
                    title="Copy Account ID"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {data.steamId64 && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-500">Steam64:</span>
                    <span className="text-zinc-400">{data.steamId64}</span>
                  </div>
                )}

                {data.recentSummary.lastMatchAgo && (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-zinc-600">|</span>
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <span>Last Match: <strong className="text-zinc-300">{data.recentSummary.lastMatchAgo}</strong></span>
                  </div>
                )}
              </div>

              {/* Rank Badge Indicator */}
              <div className="inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 text-xs font-mono shadow-sm">
                <Shield className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-zinc-400 uppercase text-[10px] tracking-wider">RANK:</span>
                <span className="font-bold text-white">{data.rankFormatted.name}</span>
                <span className="text-zinc-500 text-[10px]">({data.rankFormatted.subtext})</span>
              </div>
            </div>
          </div>

          {/* Quick Lifetime Summary Telemetry Box */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 bg-black/40 border border-white/[0.08] p-3 rounded-sm min-w-[280px]">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase">
                <Swords className="h-3 w-3 text-zinc-400" />
                <span>TOTAL GAMES</span>
              </div>
              <div className="text-lg font-mono font-black text-white mt-0.5">
                {data.lifetime.totalMatches.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                <span className="text-emerald-400">{data.lifetime.wins.toLocaleString()}W</span> -{" "}
                <span className="text-rose-400">{data.lifetime.losses.toLocaleString()}L</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase">
                <Trophy className="h-3 w-3 text-zinc-400" />
                <span>WIN RATE</span>
              </div>
              <div className={`text-lg font-mono font-black mt-0.5 ${winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                {winRate}%
              </div>
              {/* Mini visual win-rate meter (Green for Wins, Red for Losses) */}
              <div className="mt-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, winRate))}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, 100 - winRate)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase">
                <span>RECENT KDA</span>
              </div>
              <div className="text-lg font-mono font-black text-amber-400 mt-0.5">
                {data.recentSummary.kdaRatio > 0 ? data.recentSummary.kdaRatio : "N/A"}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                {data.recentSummary.sampleSize > 0
                  ? `Across ${data.recentSummary.sampleSize} matches`
                  : "No recent games"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
