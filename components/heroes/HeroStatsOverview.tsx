"use client";

import Image from "next/image";
import { Trophy, Flame, Layers, Radio } from "lucide-react";
import { HeroOverviewMetrics } from "@/lib/opendota/hero-types";

interface HeroStatsOverviewProps {
  metrics: HeroOverviewMetrics;
  onSelectHero?: (heroId: number) => void;
}

export function HeroStatsOverview({ metrics, onSelectHero }: HeroStatsOverviewProps) {
  const { strongestHero, mostPickedHero, totalHeroes, totalPubMatches, source, isCachedFallback } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Heroes */}
      <div className="tactical-panel corner-tick p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            TOTAL_HEROES // ACTIVE
          </span>
          <div className="h-7 w-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black font-mono text-white tracking-tight">
            {totalHeroes}
          </span>
          <span className="text-xs font-mono text-zinc-400">HERO ROSTER</span>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04] flex items-center justify-between">
          <span>Total Matches Sampled:</span>
          <span className="text-zinc-300 font-semibold">{totalPubMatches.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Strongest Win Rate Hero */}
      <div
        className={`tactical-panel corner-tick p-4 rounded-sm border border-emerald-900/30 relative overflow-hidden flex flex-col justify-between ${
          strongestHero && onSelectHero ? "cursor-pointer hover:border-emerald-500/50" : ""
        }`}
        onClick={() => strongestHero && onSelectHero?.(strongestHero.id)}
        role={strongestHero && onSelectHero ? "button" : undefined}
        tabIndex={strongestHero && onSelectHero ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && strongestHero && onSelectHero) {
            e.preventDefault();
            onSelectHero(strongestHero.id);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            HIGHEST_WIN_RATE // PEAK
          </span>
          <div className="h-7 w-7 rounded bg-emerald-950/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
            <Trophy className="h-3.5 w-3.5" />
          </div>
        </div>

        {strongestHero ? (
          <div className="flex items-center gap-3 mb-1">
            <div className="relative h-11 w-11 rounded-sm overflow-hidden border border-emerald-500/30 flex-shrink-0 bg-zinc-900">
              <Image
                src={strongestHero.img}
                alt={strongestHero.localized_name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-white truncate max-w-[130px]">
                {strongestHero.localized_name}
              </div>
              <div className="text-xl font-mono font-black text-emerald-400">
                {strongestHero.winRate.toFixed(1)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm font-mono text-zinc-500">Data unavailable</div>
        )}

        <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04] flex items-center justify-between">
          <span>Sample Size:</span>
          <span className="text-zinc-300 font-semibold">
            {strongestHero ? strongestHero.picks.toLocaleString() : "0"} picks
          </span>
        </div>
      </div>

      {/* 3. Most Picked Hero */}
      <div
        className={`tactical-panel corner-tick p-4 rounded-sm border border-rose-900/30 relative overflow-hidden flex flex-col justify-between ${
          mostPickedHero && onSelectHero ? "cursor-pointer hover:border-rose-500/50" : ""
        }`}
        onClick={() => mostPickedHero && onSelectHero?.(mostPickedHero.id)}
        role={mostPickedHero && onSelectHero ? "button" : undefined}
        tabIndex={mostPickedHero && onSelectHero ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && mostPickedHero && onSelectHero) {
            e.preventDefault();
            onSelectHero(mostPickedHero.id);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
            MOST_PICKED // POPULARITY
          </span>
          <div className="h-7 w-7 rounded bg-rose-950/40 border border-rose-700/40 flex items-center justify-center text-rose-400">
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>

        {mostPickedHero ? (
          <div className="flex items-center gap-3 mb-1">
            <div className="relative h-11 w-11 rounded-sm overflow-hidden border border-rose-500/30 flex-shrink-0 bg-zinc-900">
              <Image
                src={mostPickedHero.img}
                alt={mostPickedHero.localized_name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-white truncate max-w-[130px]">
                {mostPickedHero.localized_name}
              </div>
              <div className="text-xl font-mono font-black text-rose-400">
                {mostPickedHero.pickRate.toFixed(1)}% <span className="text-xs text-zinc-400 font-normal">pick</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm font-mono text-zinc-500">Data unavailable</div>
        )}

        <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04] flex items-center justify-between">
          <span>Total Matches Picked:</span>
          <span className="text-zinc-300 font-semibold">
            {mostPickedHero ? mostPickedHero.picks.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* 4. Live Telemetry Status */}
      <div className="tactical-panel corner-tick p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            TELEMETRY // FEED
          </span>
          <div className="h-7 w-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-2 w-2 rounded-full ${isCachedFallback ? "bg-amber-400" : "bg-emerald-400"} animate-ping`} />
            <span className="text-sm font-mono font-bold text-white">
              {isCachedFallback ? "Cached Archive" : "Live Stream Active"}
            </span>
          </div>
          <div className="text-xs font-mono text-zinc-400 truncate">
            {source}
          </div>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04] flex items-center justify-between">
          <span>Dota 2 Protocol:</span>
          <span className="text-rose-400 font-semibold">v7.37e Verified</span>
        </div>
      </div>
    </div>
  );
}
