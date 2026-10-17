"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { MetaRankBracket, RankBracketDefinition, PatchInfo } from "@/lib/opendota/meta-types";

interface MetaOverviewHeaderProps {
  currentPatch: PatchInfo;
  selectedBracket: MetaRankBracket;
  onSelectBracket: (bracket: MetaRankBracket) => void;
  availableBrackets: RankBracketDefinition[];
  lastUpdated: string;
  source: string;
  isCached: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export function MetaOverviewHeader({
  currentPatch,
  selectedBracket,
  onSelectBracket,
  availableBrackets,
  lastUpdated,
  source,
  isCached,
  isLoading,
  onRefresh,
}: MetaOverviewHeaderProps) {
  const formattedTime = useMemo(() => {
    try {
      const date = new Date(lastUpdated);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "Just now";
    }
  }, [lastUpdated]);

  return (
    <div className="tactical-panel p-6 sm:p-8 rounded-sm mb-8 relative overflow-hidden border border-white/[0.08]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/[0.07] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Top Bar with Patch badge & Refresh action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 rounded-sm bg-rose-950/70 border border-rose-700/50 px-2.5 py-1 text-[11px] font-mono text-rose-300 font-bold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>COMPETITIVE META RADAR</span>
          </div>

          {/* Official Patch Info */}
          <a
            href={currentPatch.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm bg-zinc-900/90 border border-white/[0.1] px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-rose-500/50 transition-colors"
            title="Read official Valve Dota 2 patch notes"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>PATCH {currentPatch.name}</span>
            <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
          </a>

          {/* Data Source Badge */}
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
            Source: <span className="text-zinc-300">{source}</span>
          </span>
        </div>

        {/* Refresh & Timestamp */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Clock className="h-3 w-3 text-zinc-500" />
            <span>Updated {formattedTime}</span>
            {isCached && (
              <span className="text-[10px] bg-amber-950/60 text-amber-300 border border-amber-800/50 px-1.5 py-0.2 rounded-sm">
                Cached
              </span>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-sm bg-zinc-900 border border-white/[0.12] hover:border-rose-500/60 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:text-white disabled:opacity-50 transition-all cursor-pointer active:scale-95"
            title="Refresh current meta statistics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-rose-400 ${isLoading ? "animate-spin text-rose-400" : ""}`} />
            <span className="hidden xs:inline">REFRESH</span>
          </button>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-rose-950/80 border border-rose-600/50 text-rose-400 shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
            META TRENDS &amp; WIN RATE SHIFTS
          </h1>
        </div>

        <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive competitive meta analysis across active Dota 2 pub matchmaking and professional play.
          All win rates, pick frequencies, and tier distributions are computed from verified match telemetry
          under official gameplay patch <span className="text-rose-400 font-bold">{currentPatch.name}</span>.
        </p>
      </div>

      {/* Rank Bracket Selector */}
      <div className="border-t border-white/[0.06] pt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-rose-500" />
            <span>Select Matchmaking Rank Bracket:</span>
          </div>

          {/* Explanation tooltip */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
            <Info className="h-3 w-3 text-zinc-500" />
            <span className="hidden sm:inline">Telemetry segregated by OpenDota MMR brackets</span>
          </div>
        </div>

        {/* Bracket Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {availableBrackets.map((bracket) => {
            const isSelected = selectedBracket === bracket.id;
            return (
              <button
                key={bracket.id}
                onClick={() => onSelectBracket(bracket.id)}
                className={`relative px-3 py-1.5 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/50 border border-rose-500"
                    : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.2]"
                }`}
                title={bracket.description}
              >
                <span>{bracket.name}</span>
                {bracket.id === "7" && (
                  <span className="ml-1 text-[9px] opacity-75 font-normal">
                    (4.6k+)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notice for Bracket 7 (Divine / Immortal) */}
        {selectedBracket === "7" && (
          <div className="mt-2 text-[11px] font-mono text-zinc-400 bg-black/40 border border-white/[0.06] px-2.5 py-1 rounded-sm flex items-center gap-2">
            <span className="text-amber-400 font-bold">NOTE:</span>
            <span>
              OpenDota telemetry combines Divine and Immortal into Rank Tier 7 (4620+ MMR).
              Bracket 8 is reserved in schema but unpopulated by upstream; all elite games are tracked under this tier.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
