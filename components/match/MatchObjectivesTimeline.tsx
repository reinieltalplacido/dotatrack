"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Shield,
  Skull,
  Clock,
  Trophy,
  AlertCircle,
  Sparkles,
  Flame,
  Swords,
  Layers,
} from "lucide-react";
import { MatchObjectiveEvent } from "@/lib/opendota/match-types";

interface MatchObjectivesTimelineProps {
  objectives: MatchObjectiveEvent[];
  isParsed: boolean;
}

type ObjectiveFilter = "all" | "firstblood" | "tower" | "barracks" | "roshan";

export function MatchObjectivesTimeline({ objectives, isParsed }: MatchObjectivesTimelineProps) {
  const [filter, setFilter] = useState<ObjectiveFilter>("all");

  const filteredObjectives = objectives.filter((obj) => {
    if (filter === "all") return true;
    if (filter === "firstblood") return obj.type === "firstblood";
    if (filter === "tower") return obj.type === "tower";
    if (filter === "barracks") return obj.type === "barracks";
    if (filter === "roshan") return obj.type === "roshan" || obj.type === "aegis";
    return true;
  });

  const firstBloodCount = objectives.filter((o) => o.type === "firstblood").length;
  const towerCount = objectives.filter((o) => o.type === "tower").length;
  const barracksCount = objectives.filter((o) => o.type === "barracks").length;
  const roshanCount = objectives.filter((o) => o.type === "roshan" || o.type === "aegis").length;

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              Objectives &amp; Structure Timeline
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Chronological milestones for First Blood, lane towers, barracks, Roshan kills, and Aegis claims.
          </p>
        </div>

        {/* Filter Pills */}
        {isParsed && objectives.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: "all" as const, label: "All Milestones", count: objectives.length },
              { id: "firstblood" as const, label: "First Blood", count: firstBloodCount },
              { id: "tower" as const, label: "Towers", count: towerCount },
              { id: "barracks" as const, label: "Barracks", count: barracksCount },
              { id: "roshan" as const, label: "Roshan & Aegis", count: roshanCount },
            ]
              .filter((f) => f.id === "all" || f.count > 0)
              .map((f) => {
                const isActive = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-rose-950 text-rose-300 border border-rose-600 font-bold"
                        : "bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{f.label}</span>
                    <span
                      className={`text-[9px] px-1 rounded-full ${
                        isActive ? "bg-rose-500/30 text-rose-200" : "bg-black/40 text-zinc-500"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
          </div>
        )}
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
      ) : filteredObjectives.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04] text-xs font-mono text-zinc-400">
          No events found for this filter.
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
          {filteredObjectives.map((obj, idx) => {
            const isRadiant = obj.team === "Radiant";
            const isDire = obj.team === "Dire";
            const isFirstBlood = obj.type === "firstblood";
            const isRoshan = obj.type === "roshan";
            const isAegis = obj.type === "aegis";
            const isTower = obj.type === "tower";
            const isBarracks = obj.type === "barracks";

            return (
              <div
                key={`obj-${idx}`}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-sm border transition-colors text-xs font-mono ${
                  isFirstBlood
                    ? "bg-rose-950/20 border-rose-600/40 hover:border-rose-500/70"
                    : isRoshan
                    ? "bg-amber-950/20 border-amber-600/40 hover:border-amber-500/70"
                    : isAegis
                    ? "bg-yellow-950/20 border-yellow-500/40 hover:border-yellow-400/70"
                    : "bg-zinc-950/80 border-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Icon Indicator */}
                  <div
                    className={`p-2 rounded-xs border shrink-0 ${
                      isFirstBlood
                        ? "bg-rose-950/80 border-rose-500/60 text-rose-400"
                        : isRoshan
                        ? "bg-amber-950/80 border-amber-500/60 text-amber-400"
                        : isAegis
                        ? "bg-yellow-950/80 border-yellow-500/60 text-yellow-300"
                        : isTower || isBarracks
                        ? isRadiant
                          ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-400"
                          : "bg-rose-950/80 border-rose-500/50 text-rose-400"
                        : "bg-zinc-900 border-white/[0.08] text-blue-400"
                    }`}
                  >
                    {isFirstBlood ? (
                      <Flame className="h-4 w-4" />
                    ) : isRoshan ? (
                      <Skull className="h-4 w-4" />
                    ) : isAegis ? (
                      <Sparkles className="h-4 w-4" />
                    ) : isTower ? (
                      <Shield className="h-4 w-4" />
                    ) : isBarracks ? (
                      <Layers className="h-4 w-4" />
                    ) : (
                      <Swords className="h-4 w-4" />
                    )}
                  </div>

                  {/* Hero Portait if available (for killer or first blood) */}
                  {obj.killerHero && (
                    <div className="relative h-8 w-14 overflow-hidden rounded bg-black shrink-0 border border-white/[0.12] hidden sm:block">
                      <Image
                        src={obj.killerHero.img}
                        alt={obj.killerHero.localizedName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Event Description */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold ${
                          isFirstBlood
                            ? "text-rose-300 font-extrabold"
                            : isRoshan
                            ? "text-amber-300 font-extrabold"
                            : isAegis
                            ? "text-yellow-300 font-extrabold"
                            : isRadiant
                            ? "text-emerald-400"
                            : isDire
                            ? "text-rose-400"
                            : "text-zinc-200"
                        }`}
                      >
                        {obj.description}
                      </span>

                      {/* Pill Badge */}
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase border ${
                          isFirstBlood
                            ? "bg-rose-950 text-rose-300 border-rose-700/60"
                            : isRoshan
                            ? "bg-amber-950 text-amber-300 border-amber-700/60"
                            : isAegis
                            ? "bg-yellow-950 text-yellow-300 border-yellow-700/60"
                            : isRadiant
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800/40"
                            : isDire
                            ? "bg-rose-950 text-rose-300 border-rose-800/40"
                            : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
                        }`}
                      >
                        {obj.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                      <span>Team: {obj.team}</span>
                      {obj.victimHero && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400">
                            Victim: {obj.victimHero.localizedName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Timestamp */}
                <div className="flex items-center gap-1.5 text-zinc-300 shrink-0 self-start sm:self-center bg-black/40 px-2.5 py-1 rounded border border-white/[0.04]">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  <span className="font-bold">{obj.timeFormatted}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
