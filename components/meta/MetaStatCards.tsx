"use client";

import Image from "next/image";
import { Activity, ShieldAlert, Award, Flame, Users } from "lucide-react";
import { MetaOverviewStats } from "@/lib/opendota/meta-types";

interface MetaStatCardsProps {
  overview: MetaOverviewStats;
}

export function MetaStatCards({ overview }: MetaStatCardsProps) {
  const {
    totalMatches,
    activeHeroesCount,
    highestWinRateHero,
    mostPickedHero,
    selectedBracketName,
  } = overview;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Matches Analyzed */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] corner-tick relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              MATCHES ANALYZED
            </span>
            <div className="p-1.5 rounded-sm bg-zinc-800/80 border border-white/[0.08] text-rose-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight mb-1">
            {totalMatches > 0 ? totalMatches.toLocaleString() : "—"}
          </div>

          <p className="text-[11px] font-mono text-zinc-400 leading-normal">
            Total verified games in <span className="text-rose-400">{selectedBracketName}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>POPULATION</span>
          <span className="text-zinc-300">10 Heroes / Match</span>
        </div>
      </div>

      {/* 2. Heroes with Usable Telemetry */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] corner-tick relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              ACTIVE HERO POOL
            </span>
            <div className="p-1.5 rounded-sm bg-zinc-800/80 border border-white/[0.08] text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight mb-1">
            {activeHeroesCount} <span className="text-sm font-normal text-zinc-500">/ 127</span>
          </div>

          <p className="text-[11px] font-mono text-zinc-400 leading-normal">
            Heroes with non-zero match representation in bracket
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>COVERAGE</span>
          <span className="text-emerald-400 font-bold">
            {((activeHeroesCount / 127) * 100).toFixed(0)}% HEROES
          </span>
        </div>
      </div>

      {/* 3. Highest Verified Win-Rate Hero */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] corner-tick relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              HIGHEST WIN RATE
            </span>
            <div className="p-1.5 rounded-sm bg-zinc-800/80 border border-white/[0.08] text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>

          {highestWinRateHero ? (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-white/[0.12] bg-zinc-900 shrink-0">
                <Image
                  src={highestWinRateHero.img}
                  alt={highestWinRateHero.localized_name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-mono font-bold text-white truncate">
                  {highestWinRateHero.localized_name}
                </div>
                <div className="text-xl font-mono font-black text-emerald-400">
                  {highestWinRateHero.winRate.toFixed(2)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm font-mono text-zinc-500 py-2">No qualified hero data</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>SAMPLE SIZE</span>
          <span className="text-zinc-300">
            {highestWinRateHero ? `${highestWinRateHero.picks.toLocaleString()} picks` : "N/A"}
          </span>
        </div>
      </div>

      {/* 4. Most Picked Hero */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] corner-tick relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              MOST PICKED HERO
            </span>
            <div className="p-1.5 rounded-sm bg-zinc-800/80 border border-white/[0.08] text-rose-500">
              <Flame className="h-4 w-4" />
            </div>
          </div>

          {mostPickedHero ? (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-white/[0.12] bg-zinc-900 shrink-0">
                <Image
                  src={mostPickedHero.img}
                  alt={mostPickedHero.localized_name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-mono font-bold text-white truncate">
                  {mostPickedHero.localized_name}
                </div>
                <div className="text-xl font-mono font-black text-rose-400">
                  {mostPickedHero.pickRate.toFixed(2)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm font-mono text-zinc-500 py-2">No pick data</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>MATCH FREQUENCY</span>
          <span className="text-zinc-300">
            {mostPickedHero ? `${mostPickedHero.picks.toLocaleString()} picks` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
