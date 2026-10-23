"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SteamIdSearch } from "./SteamIdSearch";
import { MissionControlMockup } from "./landing/MissionControlMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
      {/* Parallel-inspired Diagonal Aurora Beam & Lights (Dota Red Theme) */}
      <div className="aurora-beam" aria-hidden="true" />
      <div className="aurora-slash" aria-hidden="true" />

      {/* Ambient background glow & fine dot matrix */}
      <div
        className="absolute inset-0 bg-dot-matrix pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content & Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Headline */}
            <div className="relative mb-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                <span>Tactical Intelligence</span>
                <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-red-500">
                  for Dota 2
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8 font-sans">
              Match history, win rates, hero builds, and gold advantage curves from public Dota 2 matchmaking data.
            </p>

            {/* Quick CTAs Row */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href="#search-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 hover:scale-[1.02] cursor-pointer"
              >
                <span>Track Player Stats</span>
              </a>

              <Link
                href="/meta-trends"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] font-medium text-xs sm:text-sm transition-all hover:scale-[1.02]"
              >
                <span>Explore Meta Trends</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>

              <Link
                href="/match-data"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-rose-300 transition-colors ml-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Advantage Curves</span>
              </Link>
            </div>

            {/* Embedded Steam ID Search Station */}
            <div className="w-full max-w-xl">
              <SteamIdSearch />
            </div>
          </motion.div>

          {/* Right Column: 3D Angled Mission Control Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <MissionControlMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
