"use client";

import { Shield, Skull, Clock, Trophy, AlertCircle, Sparkles } from "lucide-react";
import { MatchObjectiveEvent } from "@/lib/opendota/match-types";

interface MatchObjectivesTimelineProps {
  objectives: MatchObjectiveEvent[];
  isParsed: boolean;
}

export function MatchObjectivesTimeline({ objectives, isParsed }: MatchObjectivesTimelineProps) {
  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              OBJECTIVES &amp; STRUCTURE TIMELINE
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Chronological milestones for Towers, Barracks, Roshan kills, and Aegis claims.
          </p>
        </div>
      </div>

      {!isParsed || objectives.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Objectives Timeline Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Detailed objective logs with exact timestamps require replay event parsing.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
          {objectives.map((obj, idx) => {
            const isRadiant = obj.team === "Radiant";
            const isDire = obj.team === "Dire";

            return (
              <div
                key={`obj-${idx}`}
                className="flex items-center justify-between p-3 rounded-sm bg-zinc-950/80 border border-white/[0.04] hover:border-white/[0.12] transition-colors text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-xs bg-zinc-900 border border-white/[0.08] text-rose-400">
                    {obj.type === "tower" || obj.type === "barracks" ? (
                      <Shield className="h-3.5 w-3.5" />
                    ) : obj.type === "roshan" ? (
                      <Skull className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    )}
                  </div>

                  <div>
                    <span
                      className={`font-bold ${
                        isRadiant ? "text-emerald-400" : isDire ? "text-rose-400" : "text-amber-400"
                      }`}
                    >
                      {obj.description}
                    </span>
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      {obj.type} • {obj.team}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  <span>{obj.timeFormatted}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
