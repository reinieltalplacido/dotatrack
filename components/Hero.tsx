"use client";

import { motion } from "framer-motion";
import { SteamIdSearch } from "./SteamIdSearch";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 bg-[#08090C]">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading with crisp solid contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5 font-sans"
        >
          Competitive Dota 2 Match Analytics &amp;{" "}
          <span className="text-rose-500">
            Player Intelligence
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 font-sans"
        >
          Analyze public matchmaking records, gold and XP advantage curves, lane efficiency, and hero facet synergies across Patch 7.37e.
        </motion.p>

        {/* Primary Interaction: Steam ID Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-10"
        >
          <SteamIdSearch />
        </motion.div>

        {/* Feature Highlights with Real Destinations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-zinc-400"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <strong className="text-zinc-200">126 Heroes</strong> Indexed
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <strong className="text-zinc-200">Replay Advantage</strong> Curves
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <strong className="text-zinc-200">Herald to Immortal</strong> Meta
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <strong className="text-zinc-200">Pro Circuit</strong> Matches
          </span>
        </motion.div>
      </div>
    </section>
  );
}
