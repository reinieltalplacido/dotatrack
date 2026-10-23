"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Activity,
  Crosshair,
  Coins,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface OverviewTabProps {
  data: PlayerDashboardData;
  onNavigateToMatches: () => void;
  onNavigateToHeroes: () => void;
}

export function OverviewTab({
  data,
  onNavigateToMatches,
  onNavigateToHeroes,
}: OverviewTabProps) {
  const { lifetime, recentSummary, lifetimeTotals, topHeroes, recentMatches, warningMessage } = data;

  const winCount = recentSummary.wins;
  const lossCount = recentSummary.losses;
  const sample = recentSummary.sampleSize;

  return (
    <div className="space-y-6">
      {/* Warning banner if partial data */}
      {warningMessage && (
        <div className="flex items-center gap-3 rounded-sm border border-amber-800/60 bg-amber-950/40 p-3 text-xs font-mono text-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Primary KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Matches */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>TOTAL MATCHES</span>
            <Activity className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-mono font-black text-white">
            {lifetime.totalMatches.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/[0.04] pt-1.5">
            <span className="text-zinc-500">Record:</span>
            <span>
              <strong className="text-emerald-400">{lifetime.wins.toLocaleString()}W</strong> -{" "}
              <strong className="text-rose-400">{lifetime.losses.toLocaleString()}L</strong>
            </span>
          </div>
        </div>

        {/* Lifetime Win Rate */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>LIFETIME WIN RATE</span>
            <Award className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div
            className={`mt-2 text-2xl font-mono font-black ${
              lifetime.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {lifetime.winRate > 0 ? `${lifetime.winRate}%` : "N/A"}
          </div>
          <div className="mt-1 text-[11px] font-mono text-zinc-500 border-t border-white/[0.04] pt-1.5">
            Computed from all public matches
          </div>
        </div>

        {/* Recent Average KDA */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>RECENT AVG KDA</span>
            <Crosshair className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-mono font-black text-amber-400">
            {recentSummary.avgKills} / {recentSummary.avgDeaths} / {recentSummary.avgAssists}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/[0.04] pt-1.5">
            <span className="text-zinc-500">Ratio:</span>
            <span className="text-zinc-200 font-bold">{recentSummary.kdaRatio} KDA</span>
            <span className="text-rose-400 text-[10px]">({sample} matches)</span>
          </div>
        </div>

        {/* Recent GPM / XPM */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>RECENT GPM / XPM</span>
            <Coins className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-mono font-black text-zinc-100">
            <span className="text-amber-400">{recentSummary.avgGpm}</span>{" "}
            <span className="text-zinc-600 text-lg">/</span>{" "}
            <span className="text-blue-400">{recentSummary.avgXpm}</span>
          </div>
          <div className="mt-1 text-[11px] font-mono text-zinc-500 border-t border-white/[0.04] pt-1.5">
            Sample window: last {sample} matches
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Recent Form & Win/Loss Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Match Form Sequence & Trend (7 cols) */}
        <div className="lg:col-span-7 tactical-panel p-5 rounded-sm border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                Recent Match Form
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Sample: <strong className="text-zinc-200">Last {sample} Games</strong>
            </span>
          </div>

          {recentMatches.length === 0 ? (
            <div className="py-8 text-center font-mono text-sm text-zinc-500">
              No recent match history available from OpenDota.
            </div>
          ) : (
            <div>
              {/* Outcome Badges Bar */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {recentMatches.map((m) => (
                  <div
                    key={m.matchId}
                    className={`relative group flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-sm font-mono font-black text-xs border transition-all hover:scale-105 ${
                      m.isWin
                        ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                        : "bg-red-950/70 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(225,29,72,0.15)]"
                    }`}
                  >
                    <span>{m.isWin ? "W" : "L"}</span>

                    {/* Rich Tactical Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-44 rounded-sm border border-white/[0.15] bg-[#0E1017] p-2 text-left shadow-2xl z-30 group-hover:block">
                      <div className="flex items-center gap-2 mb-1 border-b border-white/[0.08] pb-1">
                        <div className="relative h-6 w-9 overflow-hidden rounded bg-black shrink-0">
                          <Image
                            src={m.heroImageUrl}
                            alt={m.heroLocalizedName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white truncate">
                          {m.heroLocalizedName}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono space-y-0.5 text-zinc-300">
                        <div>Outcome: <strong className={m.isWin ? "text-emerald-400" : "text-rose-400"}>{m.isWin ? "VICTORY" : "DEFEAT"}</strong></div>
                        <div>KDA: <strong className="text-amber-400">{m.kda}</strong></div>
                        <div>Duration: <span className="text-zinc-400">{m.durationFormatted}</span></div>
                        <div>Played: <span className="text-zinc-400">{m.timeAgo}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Sample Summary Bar */}
              <div className="grid grid-cols-3 gap-2 bg-black/40 border border-white/[0.04] p-3 rounded-sm text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">RECENT WIN RATE</span>
                  <span className="text-base font-bold text-emerald-400">{recentSummary.winRate}%</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">WINS / LOSSES</span>
                  <span className="text-base font-bold text-zinc-200">{winCount}W - {lossCount}L</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">SAMPLE WINDOW</span>
                  <span className="text-base font-bold text-rose-400">{sample} Matches</span>
                </div>
              </div>
            </div>
          )}

          {/* Lifetime Baseline comparison if totals exist */}
          {lifetimeTotals && (
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Lifetime Statistical Baseline ({lifetimeTotals.sampleSize.toLocaleString()} Matches)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">LIFETIME KDA</span>
                  <span className="text-zinc-200 font-bold">{lifetimeTotals.killsAvg} / {lifetimeTotals.deathsAvg} / {lifetimeTotals.assistsAvg}</span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">LIFETIME RATIO</span>
                  <span className="text-amber-400 font-bold">{lifetimeTotals.kdaRatio}</span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">LIFETIME GPM</span>
                  <span className="text-zinc-200 font-bold">{lifetimeTotals.gpmAvg}</span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.04]">
                  <span className="text-zinc-500 text-[10px] block">LIFETIME XPM</span>
                  <span className="text-zinc-200 font-bold">{lifetimeTotals.xpmAvg}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Win/Loss Distribution Gauge (5 cols) */}
        <div className="lg:col-span-5 tactical-panel p-5 rounded-sm border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                  Win / Loss Distribution
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">All Matches</span>
            </div>

            {/* Custom SVG Win/Loss Circular Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1E2230"
                    strokeWidth="8"
                  />
                  {/* Defeat / Loss Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E11D48"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                  {/* Victory / Win Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="8.5"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (lifetime.winRate || 0)) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-mono font-black text-white">
                    {lifetime.winRate}%
                  </span>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    WIN RATE
                  </span>
                </div>
              </div>
            </div>

            {/* Win/Loss Split Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">{lifetime.wins.toLocaleString()} Wins</span>
                <span className="text-rose-400 font-bold">{lifetime.losses.toLocaleString()} Losses</span>
              </div>
              <div className="h-2 w-full bg-rose-900/60 rounded-sm overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, lifetime.winRate))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Total Games: <strong className="text-white">{lifetime.totalMatches.toLocaleString()}</strong></span>
            <span className="text-zinc-500 text-[11px]">Data Source: OpenDota</span>
          </div>
        </div>
      </div>

      {/* Most Played Heroes Section */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Most Played Heroes
            </h2>
          </div>
          <button
            type="button"
            onClick={onNavigateToHeroes}
            className="flex items-center gap-1 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors uppercase font-bold"
          >
            <span>View All ({data.allHeroes.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {topHeroes.length === 0 ? (
          <div className="py-6 text-center font-mono text-sm text-zinc-500">
            No hero match records found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {topHeroes.map((hero) => (
              <div
                key={hero.heroId}
                className="group relative rounded-sm border border-white/[0.06] bg-[#0A0C12] p-3 hover:border-rose-500/50 hover:bg-zinc-900/70 transition-all"
              >
                {/* Hero Header with Portrait */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="relative h-10 w-16 overflow-hidden rounded bg-black shrink-0 border border-white/[0.1] group-hover:border-rose-500/70">
                    <Image
                      src={hero.heroImageUrl}
                      alt={hero.heroLocalizedName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate" title={hero.heroLocalizedName}>
                      {hero.heroLocalizedName}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      {hero.primaryAttr.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Hero Metrics */}
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 text-[11px]">Matches:</span>
                    <span className="font-bold text-zinc-200">{hero.games.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 text-[11px]">Win Rate:</span>
                    <span
                      className={`font-bold ${
                        hero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {hero.winRate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>{hero.win}W</span>
                    <span>{hero.loss}L</span>
                  </div>

                  {/* Visual Win-rate mini progress (Green for Wins, Red for Losses) */}
                  <div className="mt-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    {hero.games > 0 ? (
                      <>
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, hero.winRate))}%` }}
                          title={`${hero.winRate}% Win`}
                        />
                        <div
                          className="h-full bg-rose-500 transition-all duration-300"
                          style={{ width: `${Math.max(0, 100 - hero.winRate)}%` }}
                          title={`${(100 - hero.winRate).toFixed(1)}% Loss`}
                        />
                      </>
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Matches Snapshot */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Recent Matches Preview
            </h2>
          </div>
          <button
            type="button"
            onClick={onNavigateToMatches}
            className="flex items-center gap-1 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors uppercase font-bold"
          >
            <span>View Full Match History ({recentMatches.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {recentMatches.length === 0 ? (
          <div className="py-6 text-center font-mono text-sm text-zinc-500">
            No recent match history found for this account.
          </div>
        ) : (
          <div className="space-y-2">
            {recentMatches.slice(0, 5).map((match) => (
              <Link
                key={match.matchId}
                href={`/match-data?id=${match.matchId}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-sm border border-white/[0.04] bg-[#0A0C13] hover:border-rose-500/40 hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-14 overflow-hidden rounded bg-black shrink-0 border border-white/[0.08] group-hover:scale-105 transition-transform">
                    <Image
                      src={match.heroImageUrl}
                      alt={match.heroLocalizedName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                        {match.heroLocalizedName}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase border ${
                          match.isWin
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/40"
                            : "bg-red-950/80 text-rose-400 border-rose-800/40"
                        }`}
                      >
                        {match.isWin ? "Victory" : "Defeat"}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {match.gameModeName} • {match.isRadiant ? "Radiant" : "Dire"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">K / D / A</span>
                    <span className="font-bold text-zinc-200">{match.kda}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DURATION</span>
                    <span className="font-bold text-zinc-300">{match.durationFormatted}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">PLAYED</span>
                    <span className="text-zinc-400">{match.timeAgo}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
