"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SteamIdSearch } from "./SteamIdSearch";
import { MissionControlMockup } from "./landing/MissionControlMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-18 sm:pb-24">
      {/* Subtle radial ambient glow focused behind the card */}
      <div
        className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-red-600/[0.08] blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Clean subtle dot matrix pattern */}
      <div
        className="absolute inset-0 bg-dot-matrix pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Left Column: Hero Content & Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Headline */}
            <div className="relative mb-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                <span>Dota 2 Match Analysis,</span>
                <span className="block mt-1 sm:mt-2">
                  Hero Meta &amp; Player Stats
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-7 font-sans">
              Inspect match timelines, gold advantage curves, and rank bracket meta divergence from verified public Dota 2 matchmaking data.
            </p>

            {/* Quick Explore Pills (Clean navigation, zero sparkles) */}
            <div className="flex flex-wrap items-center gap-2.5 mb-7">
              <span className="text-xs text-zinc-400 font-medium mr-1">Quick explore:</span>
              <Link
                href="/meta-trends"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white border border-white/[0.08] text-xs font-medium transition-all"
              >
                <span>Meta Trends</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </Link>

              <Link
                href="/heroes"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white border border-white/[0.08] text-xs font-medium transition-all"
              >
                <span>Hero Compendium</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </Link>

              <Link
                href="/tournaments"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white border border-white/[0.08] text-xs font-medium transition-all"
              >
                <span>Tournaments</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </Link>
            </div>

            {/* Embedded Steam ID Search Station - Primary Call to Action */}
            <div className="w-full max-w-xl">
              <SteamIdSearch />
            </div>
          </motion.div>

          {/* Right Column: 3D Card */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end [perspective:1200px]"
          >
            <MissionControlMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
