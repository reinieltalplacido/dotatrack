"use client";

import { SteamIdSearch } from "./SteamIdSearch";
import { Shield, Swords, Flame, Activity, Trophy } from "lucide-react";

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
          <span className="text-zinc-400">VALVE STEAM TELEMETRY</span>
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
        <div className="mb-14">
          <SteamIdSearch />
        </div>

        {/* Realistic Dota 2 Telemetry Teaser Card */}
        <div id="live-preview" className="mx-auto max-w-4xl text-left tactical-panel rounded-sm p-4 sm:p-5 border border-white/[0.1] shadow-2xl">
          {/* Card Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400 shadow-[0_0_8px_#10B981]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Telemetry Sample — Match #7984120392
              </span>
              <span className="rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 px-2 py-0.2 text-[10px] font-mono font-semibold uppercase">
                Radiant Victory
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
              <span>RANKED ALL PICK</span>
              <span>DURATION: <strong className="text-white font-medium">38:42</strong></span>
              <span>SKILL: <strong className="text-amber-400 font-medium">VERY HIGH (IMMORTAL)</strong></span>
            </div>
          </div>

          {/* Player & Match Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Hero & Role */}
            <div className="md:col-span-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded bg-zinc-900 border border-rose-900/40 flex items-center justify-center font-mono font-black text-rose-500 text-lg">
                INV
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">Invoker</span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.06] px-1.5 py-0.2 rounded">
                    Lvl 26
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">
                  Facet: <span className="text-rose-400 font-semibold">Elitist</span> • Pos 2 (Mid)
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center bg-black/40 border border-white/[0.04] p-2.5 rounded-sm">
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">K / D / A</div>
                <div className="text-sm font-mono font-bold text-emerald-400">14 / 2 / 19</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">GPM / XPM</div>
                <div className="text-sm font-mono font-bold text-amber-400">712 / 785</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">CS / DN</div>
                <div className="text-sm font-mono font-bold text-zinc-200">342 / 24</div>
              </div>
            </div>

            {/* End Game Items */}
            <div className="md:col-span-4">
              <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1.5">Final Item Build</div>
              <div className="flex flex-wrap gap-1.5">
                {["Blink", "BKB", "Octarine", "Hex", "Shard", "Travels"].map((item) => (
                  <span
                    key={item}
                    className="rounded bg-zinc-900/90 border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
