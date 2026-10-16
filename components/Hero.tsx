"use client";

import { SteamIdSearch } from "./SteamIdSearch";
import { Sparkles, Trophy, Users, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background ambient lighting and fine esports grid */}
      <div className="absolute inset-0 dota-radial-glow pointer-events-none" />
      <div className="absolute inset-0 dota-grid-pattern opacity-40 pointer-events-none" />

      {/* Subtle crimson diagonal atmospheric beam */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-rose-600/10 via-red-900/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Intro Tag / Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-[#170E14]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-rose-300 shadow-inner mb-6 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>DOTA 2 PLAYER ANALYTICS</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
          YOUR MATCHES.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-400 to-rose-600">
            YOUR STATS.
          </span>{" "}
          YOUR LEGACY.
        </h1>

        {/* Supporting Description */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed mb-10">
          Explore your Dota 2 performance, analyze your match history, and discover the heroes behind your victories.
        </p>

        {/* Primary Interaction: Steam ID Search Component */}
        <div className="mb-12">
          <SteamIdSearch />
        </div>

        {/* Quick Trust / Scope Indicators */}
        <div className="mx-auto max-w-2xl pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-around gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-500/80" />
            <span>Public Steam Profile Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-rose-500/80" />
            <span>Ranked & Unranked Matches</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-rose-500/80" />
            <span>All 124+ Heroes Tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
