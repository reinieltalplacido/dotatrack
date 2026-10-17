"use client";

import Image from "next/image";
import { Swords, Clock, AlertCircle, Coins, Sparkles } from "lucide-react";
import { MatchTeamfight } from "@/lib/opendota/match-types";

interface MatchTeamfightsProps {
  teamfights: MatchTeamfight[];
  isParsed: boolean;
}

export function MatchTeamfights({ teamfights, isParsed }: MatchTeamfightsProps) {
  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              TEAMFIGHT ENGAGEMENTS &amp; CASUALTIES
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Major skirmishes and team engagements automatically grouped by combat density.
          </p>
        </div>

        {isParsed && (
          <span className="text-xs font-mono text-zinc-400">
            Total Engagements: <strong className="text-white">{teamfights.length}</strong>
          </span>
        )}
      </div>

      {!isParsed || teamfights.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Teamfight Telemetry Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Teamfight clustering and gold/XP swing calculations require replay parsing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {teamfights.map((tf) => {
            const isRadWin = tf.outcome === "Radiant Victory";
            const isDireWin = tf.outcome === "Dire Victory";

            return (
              <div
                key={`tf-${tf.fightId}`}
                className="p-4 rounded-sm bg-black/40 border border-white/[0.08] hover:border-white/[0.15] transition-colors"
              >
                {/* Fight Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.04] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">FIGHT #{tf.fightId}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span>{tf.startFormatted} – {tf.endFormatted} ({tf.durationSeconds}s)</span>
                    </span>
                  </div>

                  {/* Outcome Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-xs font-bold text-[11px] border ${
                      isRadWin
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                        : isDireWin
                        ? "bg-rose-950/80 text-rose-300 border-rose-700/60"
                        : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                    }`}
                  >
                    {tf.outcome}
                  </span>
                </div>

                {/* Casualties & Swings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Casualties */}
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1.5">
                      Casualties ({tf.deaths.length})
                    </span>
                    {tf.deaths.length === 0 ? (
                      <span className="text-zinc-500 text-xs">No deaths recorded</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {tf.deaths.map((d, i) => (
                          <div
                            key={`d-${i}`}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-xs border ${
                              d.isRadiant
                                ? "bg-emerald-950/40 border-emerald-700/40 text-emerald-300"
                                : "bg-rose-950/40 border-rose-700/40 text-rose-300"
                            }`}
                            title={`${d.name} (${d.isRadiant ? "Radiant" : "Dire"})`}
                          >
                            <div className="relative w-5 h-4 rounded-xs overflow-hidden shrink-0">
                              <Image src={d.img} alt={d.name} fill sizes="20px" className="object-cover" />
                            </div>
                            <span className="text-[10px] truncate max-w-[80px]">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gold & XP Swing */}
                  <div className="flex items-center justify-start md:justify-end gap-4 text-right">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 font-bold block flex items-center gap-1 justify-end">
                        <Coins className="h-3 w-3 text-amber-400" />
                        <span>Gold Swing</span>
                      </span>
                      <span
                        className={`font-bold ${
                          tf.goldDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {tf.goldDelta >= 0
                          ? `Radiant +${tf.goldDelta.toLocaleString()}`
                          : `Dire +${Math.abs(tf.goldDelta).toLocaleString()}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 font-bold block flex items-center gap-1 justify-end">
                        <Sparkles className="h-3 w-3 text-blue-400" />
                        <span>XP Swing</span>
                      </span>
                      <span
                        className={`font-bold ${
                          tf.xpDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {tf.xpDelta >= 0
                          ? `Radiant +${tf.xpDelta.toLocaleString()}`
                          : `Dire +${Math.abs(tf.xpDelta).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
