"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Skull, Clock, Filter, AlertCircle } from "lucide-react";
import { MatchKillEvent } from "@/lib/opendota/match-types";

interface MatchCombatTimelineProps {
  killEvents: MatchKillEvent[];
  isParsed: boolean;
}

export function MatchCombatTimeline({ killEvents, isParsed }: MatchCombatTimelineProps) {
  const [teamFilter, setTeamFilter] = useState<"all" | "radiant" | "dire">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "early" | "mid" | "late">("all");

  const filteredEvents = useMemo(() => {
    return killEvents.filter((event) => {
      // Team filter
      if (teamFilter === "radiant" && !event.killerIsRadiant) return false;
      if (teamFilter === "dire" && event.killerIsRadiant) return false;

      // Time filter (early < 15m, mid 15-30m, late > 30m)
      if (timeFilter === "early" && event.time >= 900) return false;
      if (timeFilter === "mid" && (event.time < 900 || event.time > 1800)) return false;
      if (timeFilter === "late" && event.time <= 1800) return false;

      return true;
    });
  }, [killEvents, teamFilter, timeFilter]);

  return (
    <div className="tactical-panel p-4 sm:p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skull className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              COMBAT TIMELINE &amp; KILL LOG
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Chronological casualty log with killer attribution and kill timestamps.
          </p>
        </div>

        {/* Filters */}
        {isParsed && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Team Filter */}
            <div className="inline-flex rounded-sm bg-zinc-900 border border-white/[0.08] p-0.5">
              <button
                onClick={() => setTeamFilter("all")}
                className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                  teamFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTeamFilter("radiant")}
                className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                  teamFilter === "radiant" ? "bg-emerald-600 text-white font-bold" : "text-zinc-400"
                }`}
              >
                Radiant Kills
              </button>
              <button
                onClick={() => setTeamFilter("dire")}
                className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                  teamFilter === "dire" ? "bg-rose-600 text-white font-bold" : "text-zinc-400"
                }`}
              >
                Dire Kills
              </button>
            </div>

            {/* Time Filter */}
            <div className="inline-flex rounded-sm bg-zinc-900 border border-white/[0.08] p-0.5">
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-2 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer ${
                  timeFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
                }`}
              >
                Entire Game
              </button>
              <button
                onClick={() => setTimeFilter("early")}
                className={`px-2 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer ${
                  timeFilter === "early" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
                }`}
              >
                &lt; 15m
              </button>
              <button
                onClick={() => setTimeFilter("mid")}
                className={`px-2 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer ${
                  timeFilter === "mid" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
                }`}
              >
                15–30m
              </button>
              <button
                onClick={() => setTimeFilter("late")}
                className={`px-2 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer ${
                  timeFilter === "late" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
                }`}
              >
                &gt; 30m
              </button>
            </div>
          </div>
        )}
      </div>

      {!isParsed || killEvents.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Combat Event Timeline Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Detailed kill logs with exact timestamps require replay event parsing.
            Total kills per player are displayed in the Scoreboard.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
          {filteredEvents.map((event, idx) => (
            <div
              key={`kill-${idx}`}
              className="flex items-center justify-between p-2 sm:p-2.5 rounded-sm bg-zinc-950/80 border border-white/[0.04] hover:border-white/[0.12] transition-colors text-xs font-mono gap-1.5 sm:gap-2"
            >
              {/* Killer */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className="relative w-7 h-5 sm:w-8 sm:h-6 rounded-xs overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                  {event.killerImg && (
                    <Image src={event.killerImg} alt={event.killerName || "Killer"} fill sizes="32px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <span
                    className={`font-bold truncate block ${
                      event.killerIsRadiant ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {event.killerName || "Unknown Killer"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate">
                    {event.killerIsRadiant ? "Radiant" : "Dire"}
                  </span>
                </div>
              </div>

              {/* Action / Timestamp */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1 text-center">
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{event.timeFormatted}</span>
                </span>
                <span className="text-rose-500 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                  &rarr;
                </span>
              </div>

              {/* Victim */}
              <div className="flex items-center justify-end gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className="text-right min-w-0">
                  <span
                    className={`font-bold truncate block ${
                      event.victimIsRadiant ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {event.victimName}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate">
                    {event.victimIsRadiant ? "Radiant" : "Dire"}
                  </span>
                </div>
                <div className="relative w-7 h-5 sm:w-8 sm:h-6 rounded-xs overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                  <Image src={event.victimImg} alt={event.victimName} fill sizes="32px" className="object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
