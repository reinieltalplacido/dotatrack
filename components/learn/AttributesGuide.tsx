"use client";

import { useState } from "react";
import Image from "next/image";
import { ATTRIBUTES_DATA } from "@/lib/learn/learn-data";
import { Shield, Zap, Sparkles, Activity, Swords, Flame, Info } from "lucide-react";

export function AttributesGuide() {
  const [selectedAttr, setSelectedAttr] = useState<"str" | "agi" | "int" | "all">("str");
  const activeAttrData = ATTRIBUTES_DATA.find((a) => a.id === selectedAttr) || ATTRIBUTES_DATA[0];

  return (
    <div className="space-y-10">
      {/* Overview Intro Banner */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-[#0E1018] via-[#12141F] to-[#0E1018]">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The 4 Core Attributes of Dota 2
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Every hero in Dota 2 is shaped by three fundamental stats — <span className="text-red-400 font-semibold">Strength</span>, <span className="text-emerald-400 font-semibold">Agility</span>, and <span className="text-sky-400 font-semibold">Intelligence</span>. In modern Dota, heroes belong to either one of these three primary attributes, or the revolutionary fourth category: <span className="text-purple-400 font-semibold">Universal</span>.
          </p>
        </div>
      </div>

      {/* Attribute Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {ATTRIBUTES_DATA.map((attr) => {
          const isSelected = selectedAttr === attr.id;
          return (
            <button
              key={attr.id}
              onClick={() => setSelectedAttr(attr.id)}
              className={`text-left p-4 sm:p-5 rounded-sm border transition-all relative overflow-hidden group ${
                isSelected
                  ? `border-white/30 bg-[#161926] shadow-lg`
                  : `border-white/[0.08] bg-[#0E1018] hover:border-white/20 hover:bg-[#12141F]`
              }`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 ${
                  attr.id === "str"
                    ? "bg-red-500"
                    : attr.id === "agi"
                    ? "bg-emerald-500"
                    : attr.id === "int"
                    ? "bg-sky-500"
                    : "bg-purple-500"
                }`}
              />

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base font-bold text-white">{attr.name}</span>
                {attr.id === "str" && <Flame className="h-4 w-4 text-red-400" />}
                {attr.id === "agi" && <Zap className="h-4 w-4 text-emerald-400" />}
                {attr.id === "int" && <Sparkles className="h-4 w-4 text-sky-400" />}
                {attr.id === "all" && <Swords className="h-4 w-4 text-purple-400" />}
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {attr.tagline}
              </p>

              {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Active Inspection
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Attribute Detail Panel */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.1] bg-[#0E1018] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeAttrData.name} Mechanics
              </h3>
              <span className={`px-2.5 py-0.5 text-xs font-mono rounded border ${activeAttrData.badgeClass}`}>
                {activeAttrData.id.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">{activeAttrData.tagline}</p>
          </div>

          <div className="rounded-sm bg-black/40 border border-white/[0.08] px-4 py-2 text-xs font-mono text-zinc-300">
            <span className="text-zinc-500">Damage Formula: </span>
            <span className="text-white font-semibold">{activeAttrData.damageFormula}</span>
          </div>
        </div>

        {/* Per-Point Bonuses Breakdown */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-rose-400" />
            What 1 Point of {activeAttrData.name} Grants
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeAttrData.perPointBonuses.map((bonus, idx) => (
              <div
                key={idx}
                className="p-4 rounded-sm border border-white/[0.06] bg-black/30 hover:border-white/[0.12] transition-colors"
              >
                <div className="text-lg font-bold font-mono text-white mb-1">
                  {bonus.amount}
                </div>
                <div className="text-xs font-semibold text-zinc-200 mb-1">{bonus.stat}</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{bonus.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Guidance & Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-sm border border-white/[0.06] bg-black/20 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Strategic Role & Identity
            </h5>
            <ul className="space-y-2 text-xs text-zinc-300">
              {activeAttrData.primaryPerks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-sm border border-white/[0.06] bg-black/20 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              Itemization & Scaling Strategy
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeAttrData.strategicAdvice}
            </p>
          </div>
        </div>

        {/* Iconic Heroes */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
            Iconic {activeAttrData.name} Heroes
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeAttrData.iconicHeroes.map((hero) => (
              <div
                key={hero.id}
                className="flex items-center gap-3 p-3 rounded-sm border border-white/[0.06] bg-black/40 hover:border-white/20 transition-colors"
              >
                <div className="relative h-9 w-16 overflow-hidden rounded-sm border border-white/[0.08] flex-shrink-0">
                  <Image
                    src={hero.img}
                    alt={hero.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{hero.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate font-mono">{hero.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
