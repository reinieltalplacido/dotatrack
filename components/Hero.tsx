"use client";

import { SteamIdSearch } from "./SteamIdSearch";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 tactical-bg esports-grid">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-950/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Tactical Overline Badge */}
        <div className="inline-flex items-center gap-2 rounded-sm border border-rose-500/30 bg-[#120E15]/90 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-rose-300 shadow-sm mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#E11D48]" />
          <span>DOTA 2 PLAYER ANALYTICS</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">OFFICIAL MATCH STATS</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-5 font-mono">
          YOUR MATCHES.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-red-500">
            YOUR STATS.
          </span>{" "}
          YOUR LEGACY.
        </h1>

        {/* Supporting Description */}
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed mb-8">
          Explore your Dota 2 performance, analyze your match history, and discover the heroes behind your victories.
        </p>

        {/* Primary Interaction: Steam ID Search Component */}
        <div>
          <SteamIdSearch />
        </div>
      </div>
    </section>
  );
}
