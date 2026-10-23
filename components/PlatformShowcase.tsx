"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Trophy, TrendingUp, Clock } from "lucide-react";

export function PlatformShowcase() {
  return (
    <section className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#07080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Clean, Human, Authoritative */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-white/[0.06]"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Match Analysis &amp; Meta Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-sans">
              Real-time gold advantage curves, rank bracket tier lists, and verified tournament series.
            </p>
          </div>
          <Link
            href="/match-data"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span>Launch Match Analyzer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Varied Rhythm Layout: 1 Flagship Hero Card + 2 Strategic Pillar Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Flagship Spotlight: Deep Match Analytics & Advantage Curves (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 rounded-xl bg-[#0B0D14] p-6 sm:p-8 flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.16] shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-rose-400">
                    Match Advantage &amp; Timelines
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-mono">
                  Patch 7.37e
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mb-3">
                Advantage Curves &amp; Early Game Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                Understand how matches play out. Pinpoint pivotal swings, Aegis takes, buyback commitments, and lane control margins.
              </p>

              {/* Realistic Match Preview Card */}
              <div className="rounded-lg bg-[#07090E] border border-white/[0.07] p-4 text-xs mb-6">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-3 border-b border-white/[0.06]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-zinc-200">Radiant +14,250 Lead</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>36:40 Game Time</span>
                  </span>
                </div>

                {/* Simulated Momentum Swing Bar */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                    <span className="text-emerald-400">Radiant Advantage</span>
                    <span className="text-rose-400">Dire Swing Potential</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[68%]" />
                    <div className="h-full bg-rose-600 w-[32%]" />
                  </div>
                </div>

                {/* Key Combat Markers */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-zinc-400">
                  <div className="p-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">Roshan Pit</span>
                    <span className="text-amber-400 font-medium">Aegis @ 31:14</span>
                  </div>
                  <div className="p-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">Key Engagement</span>
                    <span className="text-emerald-400 font-medium">4-for-1 River Fight</span>
                  </div>
                  <div className="p-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">Buybacks</span>
                    <span className="text-zinc-200 font-medium">2 Radiant / 0 Dire</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>CS@10 Timings</span>
                <span className="text-zinc-600">•</span>
                <span>Gold/XP Graph</span>
                <span className="text-zinc-600">•</span>
                <span>Facet Impact</span>
              </div>
              <Link
                href="/match-data"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white transition-colors"
              >
                <span>Demo Match #8042189312</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column (Span 5): 2 Strategic Pillar Tiles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 2. Rank Bracket Meta Trends Tile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="rounded-xl bg-[#0B0D14] p-6 flex-1 flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.16] shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-amber-400">
                      Skill Bracket Divergence
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">Herald → Immortal</span>
                </div>

                <h3 className="text-lg font-bold text-white font-sans mb-2">
                  Patch 7.37e Meta Trends &amp; Win Rates
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                  Track how hero performance shifts across skill brackets. Spot under-the-radar meta picks, high-synergy facet combinations, and ban recommendations.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-zinc-400">8 Skill Brackets Evaluated</span>
                <Link
                  href="/meta-trends"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>View Meta Tier List</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            {/* 3. Competitive Circuit & Tournaments Tile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="rounded-xl bg-[#0B0D14] p-6 flex-1 flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.16] shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-emerald-400">
                      Pro Esports Circuit
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">Liquipedia API</span>
                </div>

                <h3 className="text-lg font-bold text-white font-sans mb-2">
                  Championships &amp; Live Pro Matches
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                  Follow tier-1 Dota 2 tournaments, playoff brackets, series scores, team rosters, and real-time live games with Valve broadcast integration.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-zinc-400">Premier &amp; Major Leagues</span>
                <Link
                  href="/tournaments"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Tournaments Hub</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
