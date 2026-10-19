"use client";

import { Activity, Swords, Coins, Zap, Shield, Sparkles } from "lucide-react";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface PerformanceTabProps {
  data: PlayerDashboardData;
}

export function PerformanceTab({ data }: PerformanceTabProps) {
  const { recentSummary, lifetimeTotals } = data;

  return (
    <div className="space-y-6">
      {/* Telemetry Summary Banner */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-rose-500" />
          <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
            Performance Benchmark
          </h2>
        </div>
        <p className="text-xs font-mono text-zinc-400 leading-relaxed max-w-2xl">
          Compare your recent performance (last {recentSummary.sampleSize} games) with your lifetime averages.
        </p>

        {/* Comparison Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-zinc-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">Metric Category</th>
                <th className="py-2.5 px-3">Recent Sample ({recentSummary.sampleSize} Games)</th>
                <th className="py-2.5 px-3">Lifetime Baseline</th>
                <th className="py-2.5 px-3">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Swords className="h-3.5 w-3.5 text-rose-400" />
                  Kills Per Game
                </td>
                <td className="py-3 px-3 text-amber-400 font-bold">{recentSummary.avgKills}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.killsAvg ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.avgKills >= lifetimeTotals.killsAvg
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {recentSummary.avgKills >= lifetimeTotals.killsAvg ? "+" : ""}
                      {(recentSummary.avgKills - lifetimeTotals.killsAvg).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                  Deaths Per Game
                </td>
                <td className="py-3 px-3 text-amber-400 font-bold">{recentSummary.avgDeaths}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.deathsAvg ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.avgDeaths <= lifetimeTotals.deathsAvg
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {(recentSummary.avgDeaths - lifetimeTotals.deathsAvg).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  Assists Per Game
                </td>
                <td className="py-3 px-3 text-amber-400 font-bold">{recentSummary.avgAssists}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.assistsAvg ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.avgAssists >= lifetimeTotals.assistsAvg
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {recentSummary.avgAssists >= lifetimeTotals.assistsAvg ? "+" : ""}
                      {(recentSummary.avgAssists - lifetimeTotals.assistsAvg).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  KDA Ratio
                </td>
                <td className="py-3 px-3 text-amber-400 font-bold">{recentSummary.kdaRatio}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.kdaRatio ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.kdaRatio >= lifetimeTotals.kdaRatio
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {recentSummary.kdaRatio >= lifetimeTotals.kdaRatio ? "+" : ""}
                      {(recentSummary.kdaRatio - lifetimeTotals.kdaRatio).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-amber-300" />
                  Gold Per Minute (GPM)
                </td>
                <td className="py-3 px-3 text-amber-300 font-bold">{recentSummary.avgGpm}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.gpmAvg ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.avgGpm >= lifetimeTotals.gpmAvg
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {recentSummary.avgGpm >= lifetimeTotals.gpmAvg ? "+" : ""}
                      {recentSummary.avgGpm - lifetimeTotals.gpmAvg}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                  XP Per Minute (XPM)
                </td>
                <td className="py-3 px-3 text-blue-300 font-bold">{recentSummary.avgXpm}</td>
                <td className="py-3 px-3 text-zinc-400">
                  {lifetimeTotals?.xpmAvg ?? "N/A"}
                </td>
                <td className="py-3 px-3">
                  {lifetimeTotals ? (
                    <span
                      className={
                        recentSummary.avgXpm >= lifetimeTotals.xpmAvg
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {recentSummary.avgXpm >= lifetimeTotals.xpmAvg ? "+" : ""}
                      {recentSummary.avgXpm - lifetimeTotals.xpmAvg}
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Roadmap Notice */}
      <div className="rounded-sm border border-white/[0.08] bg-[#0E1017] p-4 text-xs font-mono text-zinc-400 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-200 uppercase">Coming Soon: Advanced Replay Stats </strong>
          <span>
            Upcoming releases will include ward map heatmaps, lane outcome win percentages, and net worth swing graphs directly parsed from Valve demo files.
          </span>
        </div>
      </div>
    </div>
  );
}
