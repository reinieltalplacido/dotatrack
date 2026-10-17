"use client";

import Image from "next/image";
import { BarChart3, Eye, Zap, Layers, Sparkles } from "lucide-react";
import { MatchPlayerDetailed } from "@/lib/opendota/match-types";

interface MatchAdvancedStatsProps {
  players: MatchPlayerDetailed[];
}

export function MatchAdvancedStats({ players }: MatchAdvancedStatsProps) {
  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              ADVANCED COMBAT &amp; UTILITY METRICS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Kill participation, damage share, vision contributions, and crowd control durations.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono min-w-[760px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-black/40 text-[10px] uppercase text-zinc-400 tracking-wider">
              <th className="py-2.5 px-3">Hero / Player</th>
              <th className="py-2.5 px-2 text-center">TEAM</th>
              <th className="py-2.5 px-2 text-center">KILL PART. %</th>
              <th className="py-2.5 px-2 text-center">DMG SHARE %</th>
              <th className="py-2.5 px-2 text-center">GOLD SHARE %</th>
              <th className="py-2.5 px-2 text-center">OBS / SENTRY</th>
              <th className="py-2.5 px-2 text-center">STUN DURATION</th>
              <th className="py-2.5 px-2 text-center">CAMPS STACKED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {players.map((player) => (
              <tr key={player.playerSlot} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-6 rounded-xs overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
                      <Image src={player.heroImg} alt={player.heroLocalizedName} fill sizes="32px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white truncate max-w-[140px]">
                        {player.personaName}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {player.heroLocalizedName}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-2.5 px-2 text-center font-bold">
                  <span className={player.isRadiant ? "text-emerald-400" : "text-rose-400"}>
                    {player.isRadiant ? "Radiant" : "Dire"}
                  </span>
                </td>

                <td className="py-2.5 px-2 text-center font-bold text-amber-400">
                  {player.killParticipation}%
                </td>

                <td className="py-2.5 px-2 text-center text-zinc-200">
                  {player.damageShare}%
                </td>

                <td className="py-2.5 px-2 text-center text-zinc-300">
                  {player.goldShare}%
                </td>

                <td className="py-2.5 px-2 text-center text-zinc-300">
                  <span className="text-amber-300">{player.obsPlaced}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-blue-300">{player.senPlaced}</span>
                </td>

                <td className="py-2.5 px-2 text-center text-zinc-300">
                  {player.stunsDuration > 0 ? `${player.stunsDuration.toFixed(1)}s` : "0.0s"}
                </td>

                <td className="py-2.5 px-2 text-center text-zinc-300">
                  {player.campsStacked}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
