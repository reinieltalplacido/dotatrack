"use client";

import { useState } from "react";
import { GAME_TIMINGS_DATA, GameTiming } from "@/lib/learn/learn-data";
import { Clock, Shield, Sparkles, AlertCircle, Compass, Target, Swords } from "lucide-react";

export function GameTimingsGuide() {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredTimings = GAME_TIMINGS_DATA.filter(
    (t) => filterType === "all" || t.type === filterType
  );

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.08] bg-gradient-to-r from-[#0E1018] via-[#12141F] to-[#0E1018]">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Map Objectives & Critical Clock Timings
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Dota 2 matches are determined by objective rhythm. Winning teams anticipate the clock — rotating before <strong>Water Runes (2:00/4:00)</strong>, stacking before <strong>Wisdom Runes (7:00/14:00)</strong>, and grouping for <strong>Tormentor (20:00)</strong> and <strong>Roshan</strong>.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Match Milestones" },
          { id: "rune", label: "Rune Spawns" },
          { id: "objective", label: "Roshan & Tormentor" },
          { id: "creeps", label: "Creep Waves & Towers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-mono transition-colors ${
              filterType === tab.id
                ? "bg-amber-600 text-white font-bold"
                : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Grid */}
      <div className="space-y-4">
        {filteredTimings.map((timing, idx) => (
          <div
            key={idx}
            className="tactical-panel p-5 sm:p-6 rounded-sm border border-white/[0.08] bg-[#0E1018] hover:border-amber-500/30 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-black/60 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {timing.minute}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {timing.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 uppercase">
                  {timing.type}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    timing.impactLevel === "Critical"
                      ? "bg-red-950/80 border-red-800 text-red-300"
                      : timing.impactLevel === "High"
                      ? "bg-amber-950/80 border-amber-800 text-amber-300"
                      : "bg-sky-950/80 border-sky-800 text-sky-300"
                  }`}
                >
                  {timing.impactLevel} Priority
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {timing.description}
            </p>

            <div className="p-3 rounded-sm bg-black/30 border border-white/[0.04] flex items-start gap-2.5 text-xs font-mono text-zinc-300">
              <Target className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-emerald-400 font-bold mr-1.5">PRO EXECUTION:</span>
                <span>{timing.proExecution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Laning Fundamentals Cheat Sheet */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.1] bg-[#0E1018] space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Fundamental Laning & Creep Mechanics
          </h3>
          <p className="text-xs text-zinc-400">
            Micro-interactions that determine the outcome of the first 10 minutes of every Dota 2 game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-sm border border-white/[0.06] bg-black/30 space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-rose-400" />
              Creep Aggro Drawing
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Right-click an enemy hero anywhere on the map while within <strong>500 range</strong> of enemy creeps. The creeps will immediately switch targets to attack you for 2.5 seconds. Use this to pull enemy melee creeps onto your ranged creep to farm safely.
            </p>
          </div>

          <div className="p-4 rounded-sm border border-white/[0.06] bg-black/30 space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="h-3.5 w-3.5 text-emerald-400" />
              Camp Stacking & Pulling
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Attack neutral creeps at <strong>:53 - :55</strong> and run outward to pull them out of the spawn box, stacking the camp for your carry. Pull the small camp at <strong>:15 or :45</strong> to drag your lane wave into neutrals and reset lane equilibrium under your tower.
            </p>
          </div>

          <div className="p-4 rounded-sm border border-white/[0.06] bg-black/30 space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-sky-400" />
              Tower Protection Aura
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standing near your friendly tower grants <strong>+3 Armor</strong> and <strong>+3 HP Regeneration</strong> aura. Fight under your tower when dived; never fight outside the aura when at a disadvantage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
