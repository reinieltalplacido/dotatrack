"use client";

import NextImage from "next/image";
import { Sparkles, Loader2, ArrowUpRight } from "lucide-react";
import { HeroAghsUpgrade } from "@/lib/opendota/hero-types";

interface HeroAghsViewProps {
  aghs?: HeroAghsUpgrade | null;
  loading?: boolean;
}

export function HeroAghsView({ aghs, loading = false }: HeroAghsViewProps) {
  if (loading) {
    return (
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Aghanim&apos;s Scepter &amp; Shard Upgrades
          </h3>
        </div>
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Synchronizing Aghanim&apos;s upgrades...</span>
        </div>
      </div>
    );
  }

  if (!aghs || (!aghs.has_scepter && !aghs.has_shard)) {
    return null;
  }

  return (
    <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Aghanim&apos;s Scepter &amp; Shard Upgrades
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <span className="hidden sm:inline">Tactical Enhancements</span>
        </div>
      </div>

      {/* Scepter & Shard Upgrade Cards */}
      <div className="space-y-3">
        {/* Aghanim's Scepter */}
        {aghs.has_scepter && (
          <div className="rounded bg-black/40 border border-amber-500/20 hover:border-amber-500/40 p-3.5 transition-all">
            <div className="flex items-start gap-3">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded bg-amber-950/40 border border-amber-500/40 flex items-center justify-center flex-shrink-0 p-1 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                <NextImage
                  src="/aghs_scepter.png"
                  alt="Aghanim's Scepter"
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wide">
                      Aghanim&apos;s Scepter
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-amber-200 border border-amber-700/60">
                      {aghs.scepter_new_skill ? "New Ability" : "Skill Upgrade"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-800/40">
                    4,200 Gold
                  </span>
                </div>

                {/* Target Skill Affected */}
                {aghs.scepter_skill_name && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-300 font-semibold mb-1.5">
                    <span className="text-zinc-400">Affects:</span>
                    <span className="text-white bg-white/[0.05] px-1.5 py-0.2 rounded border border-white/10">
                      {aghs.scepter_skill_name}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs font-sans text-zinc-200 leading-relaxed whitespace-pre-line">
                  {aghs.scepter_desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aghanim's Shard */}
        {aghs.has_shard && (
          <div className="rounded bg-black/40 border border-sky-500/20 hover:border-sky-500/40 p-3.5 transition-all">
            <div className="flex items-start gap-3">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded bg-sky-950/40 border border-sky-500/40 flex items-center justify-center flex-shrink-0 p-1 shadow-[0_0_12px_rgba(14,165,233,0.15)]">
                <NextImage
                  src="/aghs_shard.png"
                  alt="Aghanim's Shard"
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wide">
                      Aghanim&apos;s Shard
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-950/80 text-sky-200 border border-sky-700/60">
                      {aghs.shard_new_skill ? "New Ability" : "Skill Upgrade"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-950/30 px-1.5 py-0.5 rounded border border-sky-800/40">
                    1,400 Gold (Min 15:00)
                  </span>
                </div>

                {/* Target Skill Affected */}
                {aghs.shard_skill_name && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-300 font-semibold mb-1.5">
                    <span className="text-zinc-400">Affects:</span>
                    <span className="text-white bg-white/[0.05] px-1.5 py-0.2 rounded border border-white/10">
                      {aghs.shard_skill_name}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs font-sans text-zinc-200 leading-relaxed whitespace-pre-line">
                  {aghs.shard_desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
