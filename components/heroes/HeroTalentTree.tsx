"use client";

import NextImage from "next/image";
import { Loader2 } from "lucide-react";
import { HeroTalentTier } from "@/lib/opendota/hero-types";

interface HeroTalentTreeProps {
  talents: HeroTalentTier[];
  loading?: boolean;
}

export function HeroTalentTree({ talents, loading = false }: HeroTalentTreeProps) {
  if (loading) {
    return (
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
          <div className="relative h-5 w-5 flex-shrink-0">
            <NextImage
              src="/talent_tree.svg"
              alt="Talent Tree"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Hero Talent Tree
          </h3>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Synchronizing talent specializations...</span>
        </div>
      </div>
    );
  }

  if (!talents || talents.length === 0) {
    return null;
  }

  // Ensure talents are ordered from Level 25 down to Level 10
  const sortedTalents = [...talents].sort((a, b) => b.level - a.level);

  return (
    <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
      {/* Header with Official Dota 2 Talent Tree Emblem */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="relative h-6 w-6 p-0.5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <NextImage
              src="/talent_tree.svg"
              alt="Dota 2 Talent Tree"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Hero Talent Tree
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">
              Specialization Branches
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <span className="hidden sm:inline">Level Progression</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-700/50 text-amber-300 font-bold">
            Lv 10 &rarr; 25
          </span>
        </div>
      </div>

      {/* Talent Tree Hierarchy */}
      <div className="relative space-y-2.5">
        {/* Subtle Central Connecting Spine */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-amber-500/40 pointer-events-none"
        />

        {sortedTalents.map((tier) => (
          <div
            key={tier.level}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3.5 relative z-10"
          >
            {/* Left Branch Talent */}
            <div
              className="p-2 sm:p-2.5 rounded bg-black/40 border border-white/[0.06] hover:border-amber-500/40 hover:bg-amber-950/20 transition-all text-right group cursor-default"
              title={tier.left.dname}
            >
              <span className="text-xs font-mono text-zinc-200 group-hover:text-amber-200 transition-colors leading-snug block">
                {tier.left.dname}
              </span>
            </div>

            {/* Central Level Medallion */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#120F08] border-2 border-amber-500/60 flex items-center justify-center text-amber-300 font-mono font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(245,158,11,0.25)] select-none">
                <span className="tnum">{tier.level}</span>
              </div>
            </div>

            {/* Right Branch Talent */}
            <div
              className="p-2 sm:p-2.5 rounded bg-black/40 border border-white/[0.06] hover:border-amber-500/40 hover:bg-amber-950/20 transition-all text-left group cursor-default"
              title={tier.right.dname}
            >
              <span className="text-xs font-mono text-zinc-200 group-hover:text-amber-200 transition-colors leading-snug block">
                {tier.right.dname}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
