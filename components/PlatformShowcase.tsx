"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Trophy, TrendingUp, Clock } from "lucide-react";

export function PlatformShowcase() {
  return (
    <section className="relative py-16 sm:py-24 border-t border-white/[0.08] bg-[#07080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Clean, Human, Authoritative */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-5 border-b border-white/[0.06]"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Match &amp; Player Analytics
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-sans">
              Match breakdowns, win advantage curves, and verified stats for Dota 2 players.
            </p>
          </div>
          <Link
            href="/match-data"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400 hover:text-rose-300 transition-colors"
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
            className="lg:col-span-7 tactical-panel rounded-sm p-6 sm:p-8 flex flex-col justify-between border border-white/[0.08] hover:border-rose-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-rose-950/40 border border-rose-800/40 text-rose-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                    MATCH &amp; COMBAT INSIGHTS
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                  Patch 7.37e Ready
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mb-3">
                Advantage Curves &amp; Early Game Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                Understand how the match played out. See the exact moments the game shifted, from Roshan pit fights and buyback timing to early lane performance.
              </p>

              {/* Realistic Match Preview Card (Dota 2 Net Worth Graph & Combat Breakdown) */}
              <div className="rounded-sm bg-[#0A0C14] border border-white/[0.08] p-4 font-mono text-xs mb-6">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-3 border-b border-white/[0.06]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-zinc-200">Radiant +14,250 Lead</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>36:40 Game Time</span>
                  </span>
                </div>

                {/* Simulated Momentum Swing Bar */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span className="text-emerald-400">Radiant Dominance</span>
                    <span className="text-rose-400">Dire Swing Potential</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-sm overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[68%]" />
                    <div className="h-full bg-rose-600 w-[32%]" />
                  </div>
                </div>

                {/* Key Combat Markers */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-zinc-400">
                  <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block">Roshan Pit:</span>
                    <span className="text-amber-400 font-semibold">Aegis Claimed @ 31:14</span>
                  </div>
                  <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block">Teamfight Trade:</span>
                    <span className="text-emerald-400 font-semibold">4 for 1 River Fight</span>
                  </div>
                  <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-zinc-500 block">Buyback Status:</span>
                    <span className="text-zinc-200 font-semibold">2 Radiant / 0 Dire</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                <span>• CS@10 CS &amp; Denies</span>
                <span>• Gold/XP Curves</span>
                <span>• Facet Synergy</span>
              </div>
              <Link
                href="/match-data"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 hover:text-white transition-colors"
              >
                <span>Demo Match #8042189312</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column (Span 5): 2 Distinct Tactical Tiles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 2. Rank Bracket Meta Trends Tile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="tactical-panel rounded-sm p-6 flex-1 flex flex-col justify-between border border-white/[0.08] hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-950/40 border border-amber-800/40 text-amber-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                      BRACKET INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Herald → Immortal</span>
                </div>

                <h3 className="text-lg font-bold text-white font-sans mb-2">
                  Patch 7.37e Meta Trends &amp; Win Rates
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                  Discover how win rates diverge across skill brackets. Spot under-the-radar meta picks, high-synergy facet combinations, and ban recommendations.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">8 Rank Brackets Tracked</span>
                <Link
                  href="/meta-trends"
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>View Tier List</span>
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
              className="tactical-panel rounded-sm p-6 flex-1 flex flex-col justify-between border border-white/[0.08] hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      PRO ESPORTS CIRCUIT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Liquipedia Data</span>
                </div>

                <h3 className="text-lg font-bold text-white font-sans mb-2">
                  Championships &amp; Live Pro Matches
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                  Follow tier-1 Dota 2 tournaments, playoff brackets, series scores, team rosters, and real-time live games with Valve broadcast integration.
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">Premier &amp; Major Leagues</span>
                <Link
                  href="/tournaments"
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
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
