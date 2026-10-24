"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  History,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { MetaHeroEntry } from "@/lib/opendota/meta-types";

interface MetaShiftsTrackerProps {
  heroes: MetaHeroEntry[];
  deltaPeriodLabel: string;
  snapshotCollectionStartedAt: string;
  historicalSnapshotsCount: number;
  isSnapshotDeltaAvailable: boolean;
  currentPatchName: string;
}

export function MetaShiftsTracker({
  heroes,
  deltaPeriodLabel,
  snapshotCollectionStartedAt,
  historicalSnapshotsCount,
  isSnapshotDeltaAvailable,
  currentPatchName,
}: MetaShiftsTrackerProps) {
  // Filter heroes with recorded deltas and minimum sample size (picks >= 200)
  const heroesWithDelta = useMemo(() => {
    return heroes.filter(
      (h) => h.winRateDelta !== null && h.picks >= 200 && h.pickTrend.length >= 2
    );
  }, [heroes]);

  // Top Rising Heroes (by Win Rate Delta)
  const topRising = useMemo(() => {
    return [...heroesWithDelta]
      .filter((h) => (h.winRateDelta ?? 0) > 0)
      .sort((a, b) => (b.winRateDelta ?? 0) - (a.winRateDelta ?? 0))
      .slice(0, 5);
  }, [heroesWithDelta]);

  // Top Falling Heroes (by Win Rate Delta)
  const topFalling = useMemo(() => {
    return [...heroesWithDelta]
      .filter((h) => (h.winRateDelta ?? 0) < 0)
      .sort((a, b) => (a.winRateDelta ?? 0) - (b.winRateDelta ?? 0))
      .slice(0, 5);
  }, [heroesWithDelta]);

  // Top Popularity Gainers
  const topGainersPR = useMemo(() => {
    return [...heroesWithDelta]
      .filter((h) => (h.pickRateDelta ?? 0) > 0)
      .sort((a, b) => (b.pickRateDelta ?? 0) - (a.pickRateDelta ?? 0))
      .slice(0, 5);
  }, [heroesWithDelta]);

  const hasShiftData = topRising.length > 0 || topFalling.length > 0;

  const formattedStartDate = useMemo(() => {
    try {
      return new Date(snapshotCollectionStartedAt).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Current Session";
    }
  }, [snapshotCollectionStartedAt]);

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              ACTUAL WIN RATE SHIFTS &amp; HISTORICAL TRENDS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            {deltaPeriodLabel} under Patch <span className="text-rose-400 font-bold">{currentPatchName}</span>.
          </p>
        </div>

        {/* Ledger Info */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1.5 rounded-sm border border-white/[0.08]">
          <Clock className="h-3 w-3 text-zinc-500" />
          <span>Tracking baseline: {formattedStartDate}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 font-bold">
            {historicalSnapshotsCount} Ledger Snapshots
          </span>
        </div>
      </div>

      {/* Verified Data Integrity Guarantee Note */}
      <div className="mb-6 flex items-start gap-2.5 p-3 rounded-sm bg-black/40 border border-white/[0.06] text-xs font-mono text-zinc-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-200">Verified Data:</strong> Win rate and pick rate shifts
          are computed directly from OpenDota match records and snapshot history.
          No simulated numbers or placeholder percentages are displayed.
        </div>
      </div>

      {!hasShiftData ? (
        <div className="p-8 text-center rounded-sm bg-black/30 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Initial Snapshot Baseline Captured
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Historical snapshot recording began on {formattedStartDate}. Trend delta comparisons will
            expand dynamically as subsequent scheduled snapshots accumulate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Rising Win Rates */}
          <div className="p-4 rounded-sm bg-[#0E1018] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  LARGEST WIN RATE GAINS
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Δ Win Rate</span>
            </div>

            <div className="space-y-3">
              {topRising.map((hero) => (
                <HeroShiftRow
                  key={hero.id}
                  hero={hero}
                  delta={hero.winRateDelta ?? 0}
                  isPositive={true}
                  metricType="WR"
                />
              ))}
            </div>
          </div>

          {/* Top Falling Win Rates */}
          <div className="p-4 rounded-sm bg-[#0E1018] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                  LARGEST WIN RATE DROPS
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Δ Win Rate</span>
            </div>

            <div className="space-y-3">
              {topFalling.map((hero) => (
                <HeroShiftRow
                  key={hero.id}
                  hero={hero}
                  delta={hero.winRateDelta ?? 0}
                  isPositive={false}
                  metricType="WR"
                />
              ))}
            </div>
          </div>

          {/* Top Pick Rate / Popularity Gainers */}
          <div className="p-4 rounded-sm bg-[#0E1018] border border-amber-500/20 hover:border-amber-500/40 transition-colors md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  GAINING POPULARITY
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Δ Pick Rate</span>
            </div>

            <div className="space-y-3">
              {topGainersPR.map((hero) => (
                <HeroShiftRow
                  key={hero.id}
                  hero={hero}
                  delta={hero.pickRateDelta ?? 0}
                  isPositive={true}
                  metricType="PR"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroShiftRow({
  hero,
  delta,
  isPositive,
  metricType,
}: {
  hero: MetaHeroEntry;
  delta: number;
  isPositive: boolean;
  metricType: "WR" | "PR";
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-sm bg-zinc-950/60 border border-white/[0.04] hover:border-white/[0.12] transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-white/[0.08] shrink-0">
          <Image src={hero.img} alt={hero.localized_name} fill sizes="32px" className="object-cover" />
        </div>

        <div className="min-w-0">
          <div className="text-xs font-mono font-bold text-white truncate">
            {hero.localized_name}
          </div>
          <div className="text-[10px] font-mono text-zinc-400">
            Current: {hero.winRate.toFixed(1)}% WR • {hero.pickRate.toFixed(1)}% PR
          </div>
        </div>
      </div>

      {/* Delta indicator */}
      <div className="text-right shrink-0">
        <div
          className={`text-xs font-mono font-black ${
            isPositive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isPositive ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`}
        </div>
        <div className="text-[9px] font-mono text-zinc-500 uppercase">{metricType} SHIFT</div>
      </div>
    </div>
  );
}
