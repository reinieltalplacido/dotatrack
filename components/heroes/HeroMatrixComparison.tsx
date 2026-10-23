"use client";

import { useState } from "react";
import NextImage from "next/image";
import {
  EnrichedHeroSummary,
  PrimaryAttrType,
} from "@/lib/opendota/hero-types";
import {
  Trophy,
  X,
  Plus,
  Crosshair,
  Columns,
  Shield,
  Zap,
  Brain,
  Sparkles,
  Info,
} from "lucide-react";

interface HeroMatrixComparisonProps {
  heroes: EnrichedHeroSummary[];
  comparedIds: number[];
  onToggleCompare: (heroId: number) => void;
  onClearCompare: () => void;
  onSelectHero: (heroId: number) => void;
}

export function HeroMatrixComparison({
  heroes,
  comparedIds,
  onToggleCompare,
  onClearCompare,
  onSelectHero,
}: HeroMatrixComparisonProps) {
  const [matrixAttrFilter, setMatrixAttrFilter] = useState<PrimaryAttrType | "all">("all");
  const [activeTab, setActiveTab] = useState<"scatter" | "comparison">("scatter");
  const [hoveredHero, setHoveredHero] = useState<EnrichedHeroSummary | null>(null);

  const comparedHeroes = comparedIds
    .map((id) => heroes.find((h) => h.id === id))
    .filter((h): h is EnrichedHeroSummary => Boolean(h));

  // Filter heroes for the scatter matrix
  const matrixHeroes = heroes.filter((h) => {
    if (matrixAttrFilter === "all") return true;
    return h.primary_attr === matrixAttrFilter;
  });

  // Calculate scatter bounds
  const minWin = 42;
  const maxWin = 58;
  const minPick = 0;
  const maxPick = 30;

  // Preset comparative matchups
  const applyPreset = (ids: number[]) => {
    onClearCompare();
    ids.forEach((id) => onToggleCompare(id));
    setActiveTab("comparison");
  };

  return (
    <div className="space-y-6">
      {/* Matrix Controls & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm border border-white/[0.08] bg-[#0E1019]">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1">
            ANALYTICS_MATRIX // METRIC CORRELATIONS
          </div>
          <h2 className="text-xl font-mono font-black text-white">
            Performance Matrix &amp; Multi-Hero Comparator
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Plot win rates against meta pick rates across {heroes.length} heroes, or compare hero stats head-to-head.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded bg-black/60 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab("scatter")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === "scatter"
                ? "bg-rose-600 text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>Win Rate vs Pick Rate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("comparison")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === "comparison"
                ? "bg-rose-600 text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Head-to-Head ({comparedHeroes.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW A: Win Rate vs Pick Rate Scatter Matrix */}
      {activeTab === "scatter" && (
        <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
          {/* Attribute Filters for Matrix */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Filter Matrix by Attribute:</span>
              <div className="flex gap-1">
                {(
                  [
                    { id: "all", label: "All Attributes" },
                    { id: "str", label: "STR", icon: Shield, text: "text-red-400" },
                    { id: "agi", label: "AGI", icon: Zap, text: "text-emerald-400" },
                    { id: "int", label: "INT", icon: Brain, text: "text-sky-400" },
                    { id: "all_attr", label: "UNI", icon: Sparkles, text: "text-amber-400" },
                  ] as const
                ).map((opt) => {
                  const currentOpt = opt.id === "all_attr" ? "all" : opt.id;
                  const isActive = matrixAttrFilter === currentOpt;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMatrixAttrFilter(currentOpt as PrimaryAttrType | "all")}
                      className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                        isActive
                          ? "bg-white/[0.1] text-white border border-rose-500/80 font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400">
              Showing <strong className="text-white">{matrixHeroes.length}</strong> plotted heroes
            </div>
          </div>

          {/* Quadrant Scatter Container */}
          <div className="relative w-full h-[460px] bg-[#0A0B12] rounded border border-white/[0.08] p-4 select-none overflow-hidden">
            {/* Background 4-Quadrant Labels */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-40">
              {/* Top-Left: Specialists */}
              <div className="border-r border-b border-white/[0.06] p-3 sm:p-4 flex flex-col justify-start items-start">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                  Specialist Niches
                </span>
                <span className="text-[9px] font-mono text-zinc-500 hidden sm:block">High Win Rate • Lower Pick Rate</span>
              </div>

              {/* Top-Right: Meta Kings */}
              <div className="border-b border-white/[0.06] p-3 sm:p-4 flex flex-col justify-start items-end text-right">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-rose-400 tracking-wider">
                  Meta Dominance
                </span>
                <span className="text-[9px] font-mono text-zinc-500 hidden sm:block">High Win Rate • High Pick Rate</span>
              </div>

              {/* Bottom-Left: Off-Meta */}
              <div className="border-r border-white/[0.06] p-3 sm:p-4 flex flex-col justify-end items-start">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-zinc-500 tracking-wider">
                  Off-Meta
                </span>
                <span className="text-[9px] font-mono text-zinc-600 hidden sm:block">Lower Win Rate • Low Pick Rate</span>
              </div>

              {/* Bottom-Right: Popular Traps */}
              <div className="p-3 sm:p-4 flex flex-col justify-end items-end text-right">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-amber-500 tracking-wider">
                  Popular Traps
                </span>
                <span className="text-[9px] font-mono text-zinc-500 hidden sm:block">Sub-50% Win Rate • High Pick Rate</span>
              </div>
            </div>

            {/* 50% Win Rate Reference Line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-white/20 z-0 pointer-events-none"
              style={{
                top: `${((maxWin - 50) / (maxWin - minWin)) * 100}%`,
              }}
            >
              <span className="absolute right-2 -top-4 text-[9px] font-mono text-zinc-400 bg-[#0A0B12]/80 px-1 rounded">
                50.0% Win Threshold
              </span>
            </div>

            {/* Plotted Hero Bubbles */}
            <div className="absolute inset-8 z-10">
              {matrixHeroes.map((hero) => {
                // Calculate % position
                const clampedWin = Math.max(minWin, Math.min(maxWin, hero.winRate));
                const clampedPick = Math.max(minPick, Math.min(maxPick, hero.pickRate));

                const x = ((clampedPick - minPick) / (maxPick - minPick)) * 100;
                const y = 100 - ((clampedWin - minWin) / (maxWin - minWin)) * 100;

                const isSelected = comparedIds.includes(hero.id);
                const isHovered = hoveredHero?.id === hero.id;

                const attrColor =
                  hero.primary_attr === "str"
                    ? "bg-red-500"
                    : hero.primary_attr === "agi"
                    ? "bg-emerald-500"
                    : hero.primary_attr === "int"
                    ? "bg-sky-500"
                    : "bg-amber-500";

                return (
                  <div
                    key={hero.id}
                    onClick={() => onSelectHero(hero.id)}
                    onMouseEnter={() => setHoveredHero(hero)}
                    onMouseLeave={() => setHoveredHero(null)}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 ${
                      isHovered || isSelected ? "z-30 scale-150" : "z-10 hover:scale-125"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-[#0A0B12] shadow-sm ${attrColor} ${
                        isSelected ? "ring-2 ring-rose-500 ring-offset-1 ring-offset-black" : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Hovered Hero Tooltip Card */}
            {hoveredHero && (
              <div className="absolute bottom-4 left-4 z-40 p-3 rounded-sm bg-black/90 border border-white/20 backdrop-blur shadow-2xl flex items-center gap-3">
                <div className="relative h-10 w-14 rounded overflow-hidden border border-white/10 flex-shrink-0">
                  <NextImage
                    src={hoveredHero.img}
                    alt={hoveredHero.localized_name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="font-mono">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{hoveredHero.localized_name}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">({hoveredHero.primary_attr})</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 mt-0.5">
                    Win Rate:{" "}
                    <strong
                      className={hoveredHero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}
                    >
                      {hoveredHero.winRate.toFixed(1)}%
                    </strong>{" "}
                    • Pick Rate: <strong className="text-white">{hoveredHero.pickRate.toFixed(1)}%</strong>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">Click to view full details</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> STR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> AGI
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> INT
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Universal
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Info className="h-3.5 w-3.5" />
              <span>Click any hero point to inspect details or add to comparison</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: Head-to-Head Hero Comparison Matrix */}
      {activeTab === "comparison" && (
        <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Head-to-Head Comparison ({comparedHeroes.length} / 4 Selected)
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Compare base attributes, damage, armor, and competitive rank brackets.
              </p>
            </div>

            {comparedHeroes.length > 0 && (
              <button
                type="button"
                onClick={onClearCompare}
                className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.2] transition-colors"
              >
                <X className="h-3 w-3" />
                <span>Clear Selection</span>
              </button>
            )}
          </div>

          {/* If No Heroes Selected: Show Quick Presets */}
          {comparedHeroes.length === 0 ? (
            <div className="text-center py-12 px-4 rounded border border-dashed border-white/[0.1] bg-black/20">
              <Columns className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
              <h4 className="text-base font-mono font-bold text-white mb-1">
                No Heroes Selected for Direct Comparison
              </h4>
              <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto mb-6">
                Click the “+” icon on any hero card in the compendium to compare up to 4 heroes side-by-side, or choose one of our benchmark presets:
              </p>

              {/* Presets Grid */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => applyPreset([1, 44, 8])} // Anti-Mage, Phantom Assassin, Juggernaut
                  className="rounded px-3 py-1.5 text-xs font-mono bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:text-white hover:border-rose-500/50 transition-colors"
                >
                  ⚡ Carry Trio (Anti-Mage vs PA vs Juggernaut)
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset([2, 96, 19])} // Axe, Centaur, Tiny
                  className="rounded px-3 py-1.5 text-xs font-mono bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:text-white hover:border-rose-500/50 transition-colors"
                >
                  🛡️ Frontline Initiators (Axe vs Centaur vs Tiny)
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset([26, 5, 86])} // Lion, Crystal Maiden, Rubick
                  className="rounded px-3 py-1.5 text-xs font-mono bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:text-white hover:border-rose-500/50 transition-colors"
                >
                  🔮 Support Staples (Lion vs CM vs Rubick)
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-wider">
                    <th className="sticky left-0 bg-[#0E1019] z-20 py-3 px-3 sm:px-4 w-36 sm:w-44 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Metric</th>
                    {comparedHeroes.map((hero) => (
                      <th key={hero.id} className="py-3 px-4 min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative h-7 w-11 rounded overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10">
                              <NextImage
                                src={hero.img}
                                alt={hero.localized_name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block">
                                {hero.localized_name}
                              </span>
                              <span className="text-[9px] text-zinc-400 uppercase">
                                {hero.primary_attr} • {hero.attack_type}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onToggleCompare(hero.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400"
                            title="Remove from comparison"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {/* Pub Win Rate */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 font-semibold border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Pub Win Rate</td>
                    {comparedHeroes.map((hero) => {
                      const highestWinRate = Math.max(...comparedHeroes.map((h) => h.winRate));
                      const isBest = hero.winRate === highestWinRate;
                      return (
                        <td key={hero.id} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-base font-bold ${
                                hero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
                              }`}
                            >
                              {hero.winRate.toFixed(1)}%
                            </span>
                            {isBest && comparedHeroes.length > 1 && (
                              <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                                <Trophy className="h-2.5 w-2.5" /> Best
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Pub Pick Rate & Matches */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Pick Rate</td>
                    {comparedHeroes.map((hero) => (
                      <td key={hero.id} className="py-3 px-4">
                        <span className="font-bold text-white">{hero.pickRate.toFixed(1)}%</span>
                        <span className="text-[10px] text-zinc-500 block">
                          {hero.pub_pick.toLocaleString()} matches
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Pro Win Rate */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Pro Win Rate</td>
                    {comparedHeroes.map((hero) => (
                      <td key={hero.id} className="py-3 px-4">
                        {hero.pro_pick > 0 ? (
                          <span className="font-bold text-white">
                            {hero.proWinRate.toFixed(1)}%{" "}
                            <span className="text-[10px] text-zinc-500 font-normal">
                              ({hero.pro_pick} games)
                            </span>
                          </span>
                        ) : (
                          <span className="text-zinc-600">No Pro Sample</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Base Attributes */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Attributes &amp; Gain</td>
                    {comparedHeroes.map((hero) => (
                      <td key={hero.id} className="py-3 px-4 space-y-0.5 text-[11px]">
                        <div className="text-red-400">
                          STR: {hero.base_str} <span className="text-zinc-500">+{hero.str_gain}</span>
                        </div>
                        <div className="text-emerald-400">
                          AGI: {hero.base_agi} <span className="text-zinc-500">+{hero.agi_gain}</span>
                        </div>
                        <div className="text-sky-400">
                          INT: {hero.base_int} <span className="text-zinc-500">+{hero.int_gain}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Health, Mana & Armor */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">HP / Mana / Armor</td>
                    {comparedHeroes.map((hero) => (
                      <td key={hero.id} className="py-3 px-4 space-y-0.5 text-[11px]">
                        <div>HP: <strong className="text-white">{hero.base_health}</strong></div>
                        <div>Mana: <strong className="text-white">{hero.base_mana}</strong></div>
                        <div>Armor: <strong className="text-white">{hero.base_armor.toFixed(1)}</strong></div>
                      </td>
                    ))}
                  </tr>

                  {/* Damage & Range */}
                  <tr>
                    <td className="sticky left-0 bg-[#0E1019] z-10 py-3 px-3 sm:px-4 text-zinc-400 border-r border-white/[0.06] shadow-[2px_0_6px_rgba(0,0,0,0.6)]">Damage / Speed / Range</td>
                    {comparedHeroes.map((hero) => (
                      <td key={hero.id} className="py-3 px-4 space-y-0.5 text-[11px]">
                        <div>Dmg: <strong className="text-white">{hero.base_attack_min}-{hero.base_attack_max}</strong></div>
                        <div>Speed: <strong className="text-white">{hero.move_speed}</strong></div>
                        <div>Range: <strong className="text-white">{hero.attack_range}</strong></div>
                      </td>
                    ))}
                  </tr>

                  {/* Rank Brackets Performance */}
                  {([1, 3, 5, 7] as const).map((bracketId) => {
                    const bracketName =
                      bracketId === 1
                        ? "Herald Tier"
                        : bracketId === 3
                        ? "Crusader Tier"
                        : bracketId === 5
                        ? "Legend Tier"
                        : "Divine Tier";

                    return (
                      <tr key={bracketId}>
                        <td className="py-3 px-4 text-zinc-400">{bracketName}</td>
                        {comparedHeroes.map((hero) => {
                          const bracketStat = hero.brackets.find((b) => b.bracketId === bracketId);
                          const winRate = bracketStat ? bracketStat.winRate : 0;
                          return (
                            <td key={hero.id} className="py-3 px-4">
                              <span
                                className={`font-bold ${
                                  winRate >= 50 ? "text-emerald-400" : "text-rose-400"
                                }`}
                              >
                                {winRate > 0 ? `${winRate.toFixed(1)}%` : "N/A"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
