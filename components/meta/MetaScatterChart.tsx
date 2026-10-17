"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Crosshair,
  BarChart2,
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  Brain,
  Filter,
} from "lucide-react";
import { MetaHeroEntry, PrimaryAttrType } from "@/lib/opendota/meta-types";

interface MetaScatterChartProps {
  heroes: MetaHeroEntry[];
  totalMatches: number;
  onSelectHero?: (heroId: number) => void;
}

type ChartViewMode = "scatter" | "wr_leaders" | "pr_leaders";

export function MetaScatterChart({ heroes, totalMatches, onSelectHero }: MetaScatterChartProps) {
  const [viewMode, setViewMode] = useState<ChartViewMode>("scatter");
  const [selectedAttr, setSelectedAttr] = useState<"all" | PrimaryAttrType>("all");
  const [hoveredHero, setHoveredHero] = useState<MetaHeroEntry | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Filter heroes with non-zero picks and selected attribute
  const validHeroes = useMemo(() => {
    return heroes.filter((h) => {
      if (h.picks === 0) return false;
      if (selectedAttr !== "all" && h.primary_attr !== selectedAttr) return false;
      return true;
    });
  }, [heroes, selectedAttr]);

  // Statistical boundaries for scatter plot
  const { minWR, maxWR, minPR, maxPR, medianPR } = useMemo(() => {
    if (validHeroes.length === 0) {
      return { minWR: 40, maxWR: 60, minPR: 0, maxPR: 30, medianPR: 8 };
    }
    const wrs = validHeroes.map((h) => h.winRate);
    const prs = validHeroes.map((h) => h.pickRate);

    const rawMinWR = Math.min(...wrs);
    const rawMaxWR = Math.max(...wrs);
    const rawMaxPR = Math.max(...prs);

    // Sorted pick rates for median threshold
    const sortedPR = [...prs].sort((a, b) => a - b);
    const medPR = sortedPR[Math.floor(sortedPR.length / 2)] || 8.0;

    return {
      minWR: Math.max(35, Math.floor(rawMinWR - 1)),
      maxWR: Math.min(65, Math.ceil(rawMaxWR + 1)),
      minPR: 0,
      maxPR: Math.max(25, Math.ceil(rawMaxPR + 2)),
      medianPR: Number(medPR.toFixed(1)),
    };
  }, [validHeroes]);

  // Dimensions for SVG Scatter View
  const svgWidth = 800;
  const svgHeight = 440;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (pr: number) => {
    return padding.left + ((pr - minPR) / (maxPR - minPR)) * plotWidth;
  };

  const scaleY = (wr: number) => {
    return padding.top + plotHeight - ((wr - minWR) / (maxWR - minWR)) * plotHeight;
  };

  const benchmarkY = scaleY(50.0);
  const benchmarkX = scaleX(medianPR);

  // Leaders calculations
  const winRateLeaders = useMemo(() => {
    // Require minimum 0.5% picks or 500 picks for statistical reliability
    const minPicks = Math.max(300, Math.round(totalMatches * 0.005));
    const qualified = validHeroes.filter((h) => h.picks >= minPicks);
    const pool = qualified.length >= 10 ? qualified : validHeroes;
    return [...pool].sort((a, b) => b.winRate - a.winRate).slice(0, 10);
  }, [validHeroes, totalMatches]);

  const pickRateLeaders = useMemo(() => {
    return [...validHeroes].sort((a, b) => b.picks - a.picks).slice(0, 10);
  }, [validHeroes]);

  const getAttrColor = (attr: PrimaryAttrType) => {
    switch (attr) {
      case "str":
        return "#EF4444"; // red
      case "agi":
        return "#10B981"; // green
      case "int":
        return "#3B82F6"; // blue
      case "all":
        return "#A855F7"; // purple universal
      default:
        return "#E11D48";
    }
  };

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Chart Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-rose-500" />
              <span>PERFORMANCE MATRIX &amp; VISUALIZATIONS</span>
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Interactive correlation between hero win rate and meta pick frequency.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-sm bg-zinc-900 border border-white/[0.08] p-0.5">
            <button
              onClick={() => setViewMode("scatter")}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                viewMode === "scatter"
                  ? "bg-rose-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Scatter Matrix
            </button>
            <button
              onClick={() => setViewMode("wr_leaders")}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                viewMode === "wr_leaders"
                  ? "bg-rose-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Top Win Rate
            </button>
            <button
              onClick={() => setViewMode("pr_leaders")}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                viewMode === "pr_leaders"
                  ? "bg-rose-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Most Picked
            </button>
          </div>
        </div>
      </div>

      {/* Attribute Filters for Chart */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Filter className="h-3 w-3 text-zinc-500" />
          <span>Attribute:</span>
          <div className="flex items-center gap-1 ml-1">
            {(
              [
                { id: "all", label: "ALL" },
                { id: "str", label: "STR", color: "text-red-400" },
                { id: "agi", label: "AGI", color: "text-emerald-400" },
                { id: "int", label: "INT", color: "text-blue-400" },
                { id: "all", label: "UNI", color: "text-purple-400" },
              ] as const
            ).map((item, idx) => (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => setSelectedAttr(item.id as "all" | PrimaryAttrType)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-sm transition-colors cursor-pointer border ${
                  selectedAttr === item.id
                    ? "bg-zinc-800 text-white border-white/[0.2] font-bold"
                    : "bg-zinc-900/60 text-zinc-500 border-white/[0.04] hover:text-zinc-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-zinc-400">
          Showing <span className="text-white font-bold">{validHeroes.length}</span> heroes
        </div>
      </div>

      {/* VIEW: Scatter Plot Matrix */}
      {viewMode === "scatter" && (
        <div className="relative w-full overflow-hidden bg-black/40 border border-white/[0.06] rounded-sm p-2 sm:p-4">
          {/* Quadrant Watermarks */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none p-12 text-[10px] font-mono select-none">
            {/* Top Left: Hidden Gems */}
            <div className="flex items-start justify-start p-2 text-emerald-500/25 uppercase font-bold tracking-wider">
              [ HIDDEN GEMS ] <br /> High Win Rate • Low Pick Rate
            </div>
            {/* Top Right: Meta Staples */}
            <div className="flex items-start justify-end p-2 text-rose-500/30 uppercase font-bold tracking-wider text-right">
              [ META STAPLES ] <br /> High Win Rate • High Pick Rate
            </div>
            {/* Bottom Left: Niche / Struggling */}
            <div className="flex items-end justify-start p-2 text-zinc-600/30 uppercase font-bold tracking-wider">
              [ NICHE / STRUGGLING ] <br /> Low Win Rate • Low Pick Rate
            </div>
            {/* Bottom Right: Popular Pitfalls */}
            <div className="flex items-end justify-end p-2 text-amber-500/30 uppercase font-bold tracking-wider text-right">
              [ POPULAR PITFALLS ] <br /> Low Win Rate • High Pick Rate
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[500px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              onMouseLeave={() => setHoveredHero(null)}
            >
              {/* Background Grid Lines */}
              {[40, 45, 50, 55, 60].map((wr) => {
                const y = scaleY(wr);
                if (y < padding.top || y > padding.top + plotHeight) return null;
                return (
                  <g key={`grid-y-${wr}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + plotWidth}
                      y2={y}
                      stroke={wr === 50 ? "rgba(225, 29, 72, 0.4)" : "rgba(255, 255, 255, 0.05)"}
                      strokeDasharray={wr === 50 ? "4 4" : undefined}
                      strokeWidth={wr === 50 ? 1.5 : 1}
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      fill={wr === 50 ? "#F43F5E" : "#71717A"}
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {wr}%
                    </text>
                  </g>
                );
              })}

              {/* Benchmark X (Median Pick Rate) */}
              <line
                x1={benchmarkX}
                y1={padding.top}
                x2={benchmarkX}
                y2={padding.top + plotHeight}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={benchmarkX}
                y={padding.top - 8}
                fill="#A1A1AA"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Median PR ({medianPR}%)
              </text>

              {/* X Axis Labels */}
              {[0, 5, 10, 15, 20, 25].map((pr) => {
                const x = scaleX(pr);
                if (x < padding.left || x > padding.left + plotWidth) return null;
                return (
                  <g key={`grid-x-${pr}`}>
                    <line
                      x1={x}
                      y1={padding.top + plotHeight}
                      x2={x}
                      y2={padding.top + plotHeight + 6}
                      stroke="rgba(255, 255, 255, 0.2)"
                    />
                    <text
                      x={x}
                      y={padding.top + plotHeight + 18}
                      fill="#71717A"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pr}%
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={svgHeight - 10}
                fill="#A1A1AA"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                PICK RATE (% of matches)
              </text>

              <text
                transform={`rotate(-90 ${18} ${padding.top + plotHeight / 2})`}
                x={18}
                y={padding.top + plotHeight / 2}
                fill="#A1A1AA"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                WIN RATE (%)
              </text>

              {/* Hero Scatter Nodes */}
              {validHeroes.map((hero) => {
                const cx = scaleX(hero.pickRate);
                const cy = scaleY(hero.winRate);
                const isHovered = hoveredHero?.id === hero.id;
                const nodeColor = getAttrColor(hero.primary_attr);

                return (
                  <g
                    key={hero.id}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={(e) => {
                      setHoveredHero(hero);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onClick={() => onSelectHero?.(hero.id)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : 4}
                      fill={nodeColor}
                      fillOpacity={isHovered ? 1 : 0.75}
                      stroke="#FFFFFF"
                      strokeWidth={isHovered ? 2 : 0.8}
                      className="transition-all"
                    />

                    {/* Prominent label on hover or key meta heroes */}
                    {isHovered && (
                      <text
                        x={cx}
                        y={cy - 10}
                        fill="#FFFFFF"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {hero.localized_name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredHero && (
              <div className="absolute top-4 right-4 z-20 pointer-events-none bg-zinc-950/95 border border-rose-500/40 p-3 rounded-sm shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-white/[0.1] shrink-0">
                    <Image
                      src={hoveredHero.img}
                      alt={hoveredHero.localized_name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white leading-tight">
                      {hoveredHero.localized_name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">
                      {hoveredHero.attack_type} • {hoveredHero.primary_attr.toUpperCase()}
                    </div>
                  </div>
                  <span
                    className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                      hoveredHero.tier === "S"
                        ? "bg-rose-950 text-rose-300 border border-rose-700"
                        : hoveredHero.tier === "A"
                        ? "bg-amber-950 text-amber-300 border border-amber-700"
                        : hoveredHero.tier === "B"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    TIER {hoveredHero.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-2 text-[11px] font-mono">
                  <div>
                    <div className="text-zinc-500 text-[9px]">WIN RATE</div>
                    <div
                      className={`font-bold ${
                        hoveredHero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {hoveredHero.winRate.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[9px]">PICK RATE</div>
                    <div className="font-bold text-white">{hoveredHero.pickRate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[9px]">TOTAL PICKS</div>
                    <div className="font-bold text-zinc-300">
                      {hoveredHero.picks.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[9px]">META SCORE</div>
                    <div className="font-bold text-amber-400">{hoveredHero.metaScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: Win Rate Leaders */}
      {viewMode === "wr_leaders" && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400 mb-2">
            Top 10 statistically reliable win rates (minimum sample size threshold applied):
          </div>
          <div className="space-y-2">
            {winRateLeaders.map((hero, index) => (
              <div
                key={hero.id}
                className="flex items-center gap-3 p-2.5 rounded-sm bg-black/30 border border-white/[0.06] hover:border-rose-500/40 transition-colors"
              >
                <span className="w-5 text-center text-xs font-mono font-bold text-zinc-500">
                  #{index + 1}
                </span>

                <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-white/[0.1] shrink-0">
                  <Image src={hero.img} alt={hero.localized_name} fill sizes="32px" className="object-cover" />
                </div>

                <div className="w-36 truncate text-xs font-mono font-bold text-white">
                  {hero.localized_name}
                </div>

                {/* Bar */}
                <div className="flex-1 max-w-md hidden sm:block">
                  <div className="h-2 w-full bg-zinc-900 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-xs transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, (hero.winRate - 40) * 4))}%` }}
                    />
                  </div>
                </div>

                <div className="text-right ml-auto">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {hero.winRate.toFixed(2)}%
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {hero.picks.toLocaleString()} picks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: Pick Rate Leaders */}
      {viewMode === "pr_leaders" && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400 mb-2">
            Top 10 most picked heroes across active matchmaking dataset:
          </div>
          <div className="space-y-2">
            {pickRateLeaders.map((hero, index) => (
              <div
                key={hero.id}
                className="flex items-center gap-3 p-2.5 rounded-sm bg-black/30 border border-white/[0.06] hover:border-rose-500/40 transition-colors"
              >
                <span className="w-5 text-center text-xs font-mono font-bold text-zinc-500">
                  #{index + 1}
                </span>

                <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-white/[0.1] shrink-0">
                  <Image src={hero.img} alt={hero.localized_name} fill sizes="32px" className="object-cover" />
                </div>

                <div className="w-36 truncate text-xs font-mono font-bold text-white">
                  {hero.localized_name}
                </div>

                {/* Bar */}
                <div className="flex-1 max-w-md hidden sm:block">
                  <div className="h-2 w-full bg-zinc-900 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-xs transition-all duration-300"
                      style={{ width: `${Math.min(100, (hero.pickRate / 30) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-right ml-auto">
                  <div className="text-xs font-mono font-bold text-rose-400">
                    {hero.pickRate.toFixed(2)}% PR
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {hero.picks.toLocaleString()} picks ({hero.winRate.toFixed(1)}% WR)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
