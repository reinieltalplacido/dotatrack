"use client";

import Image from "next/image";
import { DraftRecommendation, DraftRole } from "@/lib/draft/draft-engine";
import { EnrichedHeroSummary } from "@/lib/opendota/hero-types";
import { Sparkles, TrendingUp, ShieldAlert, ArrowRight, Plus } from "lucide-react";

interface DraftRecommendationsProps {
  recommendations: DraftRecommendation[];
  activeTeam: "radiant" | "dire";
  onSelectHero: (hero: EnrichedHeroSummary) => void;
}

export function DraftRecommendations({
  recommendations,
  activeTeam,
  onSelectHero,
}: DraftRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="tactical-panel p-4 sm:p-5 rounded-sm border border-white/[0.08] bg-[#0A0C14] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Algorithmic Counter Recommendations for {activeTeam.toUpperCase()}
          </h3>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          Ranked by counter advantage &amp; composition void patching
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.hero.id}
            className={`p-3 rounded-sm border flex flex-col justify-between transition-all group ${
              activeTeam === "radiant"
                ? "bg-[#07130F] border-emerald-900/50 hover:border-emerald-500/70"
                : "bg-[#14080D] border-rose-900/50 hover:border-rose-500/70"
            }`}
          >
            <div>
              {/* Hero Header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="relative h-10 w-16 rounded-xs overflow-hidden border border-white/[0.1] bg-black shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src={rec.hero.img}
                    alt={rec.hero.localized_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {rec.hero.localized_name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-0.5">
                    <span className="text-emerald-400 font-bold">
                      +{rec.advantageDelta}% Adv
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500">{rec.recommendedRole}</span>
                  </div>
                </div>
              </div>

              {/* Suitability Meter */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">SUITABILITY SCORE</span>
                  <span className="text-amber-400 font-bold">{rec.suitabilityScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${rec.suitabilityScore}%` }}
                  />
                </div>
              </div>

              {/* Reasons & Counters Badges */}
              <div className="space-y-1 text-[10px] font-mono text-zinc-400 mb-3">
                {rec.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-1 leading-tight text-zinc-300">
                    <span className="text-amber-400 shrink-0">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Pick Button */}
            <button
              type="button"
              onClick={() => onSelectHero(rec.hero)}
              className={`w-full py-1.5 px-3 rounded-xs text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTeam === "radiant"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              }`}
            >
              <Plus className="h-3 w-3" />
              <span>Draft for {activeTeam.toUpperCase()}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
