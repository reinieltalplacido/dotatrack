"use client";

import { TeamRadarScores } from "@/lib/draft/draft-engine";
import { Swords, Shield, Flame, Zap, Trophy, Sparkles } from "lucide-react";

interface DraftCompositionRadarProps {
  radiantScores: TeamRadarScores;
  direScores: TeamRadarScores;
}

export function DraftCompositionRadar({ radiantScores, direScores }: DraftCompositionRadarProps) {
  const categories = [
    {
      key: "lockdown" as const,
      label: "Stuns & Hard Lockdown",
      icon: <Shield className="h-3.5 w-3.5 text-blue-400" />,
      desc: "Single-target and AOE disables to interrupt channels and control cores",
    },
    {
      key: "initiation" as const,
      label: "Initiation & Frontline",
      icon: <Swords className="h-3.5 w-3.5 text-amber-400" />,
      desc: "Durable vanguards and gap-closing teamfight jump capabilities",
    },
    {
      key: "push" as const,
      label: "Tower Siege & Push",
      icon: <Trophy className="h-3.5 w-3.5 text-yellow-400" />,
      desc: "Building damage and summons to conquer objectives post-teamfight",
    },
    {
      key: "waveclear" as const,
      label: "Waveclear & Depush",
      icon: <Flame className="h-3.5 w-3.5 text-orange-400" />,
      desc: "Creep wave neutralization to prevent enemy deathball pushes",
    },
    {
      key: "magicBurst" as const,
      label: "Magic Damage Burst",
      icon: <Zap className="h-3.5 w-3.5 text-purple-400" />,
      desc: "High-impact spell damage to erase priority targets instantly",
    },
    {
      key: "physicalSustain" as const,
      label: "Physical Sustained DPS",
      icon: <Sparkles className="h-3.5 w-3.5 text-emerald-400" />,
      desc: "Scaling right-click damage through armor reduction and BKB timings",
    },
  ];

  return (
    <div className="tactical-panel p-4 sm:p-5 rounded-sm border border-white/[0.08] bg-[#0A0C14] space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Tactical Composition Balance (6-Axis Radar)</span>
          </h3>
          <p className="text-[11px] font-mono text-zinc-400">
            Head-to-head capability comparison between Radiant and Dire drafts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Radiant
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Dire
          </span>
        </div>
      </div>

      {/* Axis Rating Rows */}
      <div className="space-y-3.5">
        {categories.map((cat) => {
          const radScore = radiantScores[cat.key];
          const direScore = direScores[cat.key];
          const diff = Number((radScore - direScore).toFixed(1));

          return (
            <div key={cat.key} className="space-y-1.5 bg-black/30 p-2.5 rounded-sm border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-white font-medium">
                  {cat.icon}
                  <span>{cat.label}</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{radScore}</span>
                  <span className="text-zinc-600">vs</span>
                  <span className="text-rose-400 font-bold">{direScore}</span>
                  {diff !== 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1 rounded ${
                        diff > 0
                          ? "bg-emerald-950 text-emerald-300"
                          : "bg-rose-950 text-rose-300"
                      }`}
                    >
                      {diff > 0 ? `+${diff} RAD` : `${diff} DIRE`}
                    </span>
                  )}
                </div>
              </div>

              {/* Comparative Dual Gauge Bar */}
              <div className="grid grid-cols-2 gap-1.5 h-2 w-full">
                {/* Radiant Bar (grows left-to-right) */}
                <div className="bg-zinc-900 rounded-xs overflow-hidden flex justify-end">
                  <div
                    className="bg-emerald-500 h-full rounded-xs transition-all duration-300"
                    style={{ width: `${(radScore / 10) * 100}%` }}
                  />
                </div>

                {/* Dire Bar (grows left-to-right) */}
                <div className="bg-zinc-900 rounded-xs overflow-hidden flex justify-start">
                  <div
                    className="bg-rose-500 h-full rounded-xs transition-all duration-300"
                    style={{ width: `${(direScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
