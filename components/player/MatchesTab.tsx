"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  Filter,
  Swords,
  Coins,
  Zap,
  Clock,
  Skull,
  ArrowRight,
} from "lucide-react";
import { EnrichedRecentMatch } from "@/lib/opendota/types";

interface MatchesTabProps {
  matches: EnrichedRecentMatch[];
}

export function MatchesTab({ matches }: MatchesTabProps) {
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredMatches = matches.filter((m) => {
    if (filter === "win") return m.isWin;
    if (filter === "loss") return !m.isWin;
    return true;
  });

  const handleCopyMatchId = (matchId: number) => {
    navigator.clipboard.writeText(String(matchId));
    setCopiedId(matchId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (matches.length === 0) {
    return (
      <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08]">
        <Skull className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-base font-mono font-bold text-white mb-1">
          No Recent Matches Found
        </h3>
        <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
          No recent public matches could be retrieved for this account. The player may have enabled match privacy or hasn&apos;t played recently.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 tactical-panel p-3.5 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-rose-500" />
          <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Match Filters:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-sm px-2.5 py-1 text-xs font-mono transition-all ${
                filter === "all"
                  ? "bg-rose-600 text-white font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              All ({matches.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("win")}
              className={`rounded-sm px-2.5 py-1 text-xs font-mono transition-all ${
                filter === "win"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-emerald-400"
              }`}
            >
              Victories ({matches.filter((m) => m.isWin).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("loss")}
              className={`rounded-sm px-2.5 py-1 text-xs font-mono transition-all ${
                filter === "loss"
                  ? "bg-rose-700 text-white font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-rose-400"
              }`}
            >
              Defeats ({matches.filter((m) => !m.isWin).length})
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          Showing <strong className="text-zinc-200">{filteredMatches.length}</strong> recorded matches
        </div>
      </div>

      {/* Aligned Column Header for Desktop */}
      <div className="hidden lg:grid grid-cols-[300px_1fr_170px] xl:grid-cols-[320px_1fr_180px] items-center gap-4 xl:gap-6 px-4 py-2 text-[10px] font-mono uppercase text-zinc-500 tracking-wider border-b border-white/[0.04]">
        <div>HERO &amp; MATCH OUTCOME</div>
        <div className="grid grid-cols-4 gap-4 xl:gap-6 px-4">
          <div className="flex items-center gap-1"><Swords className="h-3 w-3 text-zinc-400 shrink-0" /><span>K / D / A</span></div>
          <div className="flex items-center gap-1"><Coins className="h-3 w-3 text-zinc-400 shrink-0" /><span>GPM / XPM</span></div>
          <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-zinc-400 shrink-0" /><span>DURATION</span></div>
          <div className="flex items-center gap-1"><Zap className="h-3 w-3 text-zinc-400 shrink-0" /><span>PLAYED</span></div>
        </div>
        <div className="text-right">MATCH ID &amp; ACTIONS</div>
      </div>

      {/* Matches List / Table */}
      <div className="space-y-2">
        {filteredMatches.map((match) => (
          <div
            key={match.matchId}
            className={`group relative tactical-panel p-4 rounded-sm border transition-all ${
              match.isWin
                ? "border-emerald-500/20 hover:border-emerald-500/60 hover:bg-[#0c1614]"
                : "border-rose-500/20 hover:border-rose-500/60 hover:bg-[#160c10]"
            }`}
          >
            {/* Clickable Area Overlay to Match Data */}
            <Link
              href={`/match-data?id=${match.matchId}`}
              className="absolute inset-0 z-0"
              aria-label={`View match breakdown for ${match.heroLocalizedName}`}
            />

            <div className="relative z-10 pointer-events-none grid grid-cols-1 lg:grid-cols-[300px_1fr_170px] xl:grid-cols-[320px_1fr_180px] items-center gap-4 xl:gap-6">
              {/* Left: Hero Portrait, Name, Outcome */}
              <div className="flex items-center gap-3.5 min-w-0 w-full overflow-hidden">
                <div className="relative h-12 w-20 overflow-hidden rounded bg-black shrink-0 border border-white/[0.12] shadow-md group-hover:scale-105 transition-transform">
                  <Image
                    src={match.heroImageUrl}
                    alt={match.heroLocalizedName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors truncate max-w-[160px] xl:max-w-[180px]">
                      {match.heroLocalizedName}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase border ${
                        match.isWin
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/50"
                          : "bg-red-950/80 text-rose-400 border-rose-800/50"
                      }`}
                    >
                      {match.isWin ? "Victory" : "Defeat"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                    <span className="text-zinc-300 font-medium truncate">{match.gameModeName}</span>
                    <span className="text-zinc-600 shrink-0">•</span>
                    <span className={`shrink-0 ${match.isRadiant ? "text-emerald-400" : "text-rose-400"}`}>
                      {match.isRadiant ? "Radiant" : "Dire"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Metrics: KDA, GPM/XPM, Last Hits, Damage */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xl:gap-6 bg-black/40 border border-white/[0.04] p-2.5 px-4 rounded-sm w-full">
                {/* KDA */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <Swords className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span>K / D / A</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-400 mt-0.5 truncate whitespace-nowrap">
                    {match.kda}
                  </div>
                </div>

                {/* GPM / XPM */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <Coins className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span>GPM / XPM</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-200 mt-0.5 truncate whitespace-nowrap">
                    <span className="text-amber-300">{match.gpm}</span> /{" "}
                    <span className="text-blue-300">{match.xpm}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span>DURATION</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-200 mt-0.5 truncate whitespace-nowrap">
                    {match.durationFormatted}
                  </div>
                </div>

                {/* Time Ago */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <Zap className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span>PLAYED</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-400 mt-0.5 truncate whitespace-nowrap">
                    {match.timeAgo}
                  </div>
                </div>
              </div>

              {/* Right: Match ID and Action Link */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2.5 w-full pointer-events-auto border-t lg:border-t-0 border-white/[0.04] pt-2 lg:pt-0 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-500 text-[11px]">ID:</span>
                  <span className="text-zinc-300 font-bold">{match.matchId}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyMatchId(match.matchId);
                    }}
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-0.5"
                    title="Copy Match ID"
                    aria-label="Copy Match ID"
                  >
                    {copiedId === match.matchId ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <Link
                  href={`/match-data?id=${match.matchId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold text-rose-400 hover:text-white bg-white/[0.04] hover:bg-rose-600 transition-all uppercase whitespace-nowrap"
                >
                  <span>Match Details</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
