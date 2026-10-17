"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { Coins, Filter, ShieldAlert, Sparkles, TrendingUp, Clock } from "lucide-react";
import { MatchPlayerDetailed } from "@/lib/opendota/match-types";

interface MatchHeroNetWorthChartProps {
  players: MatchPlayerDetailed[];
  durationSeconds: number;
  isParsed: boolean;
}

// 10 distinct, vibrant esports color tokens for each player slot
const PLAYER_COLORS: Record<number, { stroke: string; bg: string; text: string }> = {
  // Radiant
  0: { stroke: "#10b981", bg: "bg-emerald-500", text: "text-emerald-400" }, // Emerald
  1: { stroke: "#06b6d4", bg: "bg-cyan-500", text: "text-cyan-400" }, // Cyan
  2: { stroke: "#3b82f6", bg: "bg-blue-500", text: "text-blue-400" }, // Blue
  3: { stroke: "#14b8a6", bg: "bg-teal-500", text: "text-teal-400" }, // Teal
  4: { stroke: "#84cc16", bg: "bg-lime-500", text: "text-lime-400" }, // Lime
  // Dire
  128: { stroke: "#f43f5e", bg: "bg-rose-500", text: "text-rose-400" }, // Rose
  129: { stroke: "#f59e0b", bg: "bg-amber-500", text: "text-amber-400" }, // Amber
  130: { stroke: "#a855f7", bg: "bg-purple-500", text: "text-purple-400" }, // Purple
  131: { stroke: "#ec4899", bg: "bg-pink-500", text: "text-pink-400" }, // Pink
  132: { stroke: "#fb923c", bg: "bg-orange-500", text: "text-orange-400" }, // Orange
};

function getPlayerColor(slot: number, idx: number, isRadiant: boolean) {
  if (PLAYER_COLORS[slot]) return PLAYER_COLORS[slot];
  // Fallback by index
  const radiantColors = [
    { stroke: "#10b981", bg: "bg-emerald-500", text: "text-emerald-400" },
    { stroke: "#06b6d4", bg: "bg-cyan-500", text: "text-cyan-400" },
    { stroke: "#3b82f6", bg: "bg-blue-500", text: "text-blue-400" },
    { stroke: "#14b8a6", bg: "bg-teal-500", text: "text-teal-400" },
    { stroke: "#84cc16", bg: "bg-lime-500", text: "text-lime-400" },
  ];
  const direColors = [
    { stroke: "#f43f5e", bg: "bg-rose-500", text: "text-rose-400" },
    { stroke: "#f59e0b", bg: "bg-amber-500", text: "text-amber-400" },
    { stroke: "#a855f7", bg: "bg-purple-500", text: "text-purple-400" },
    { stroke: "#ec4899", bg: "bg-pink-500", text: "text-pink-400" },
    { stroke: "#fb923c", bg: "bg-orange-500", text: "text-orange-400" },
  ];
  return isRadiant ? radiantColors[idx % 5] : direColors[idx % 5];
}

export function MatchHeroNetWorthChart({
  players,
  durationSeconds,
  isParsed,
}: MatchHeroNetWorthChartProps) {
  // Determine maximum available minutes in the match
  const maxMinuteFromDuration = Math.max(1, Math.floor(durationSeconds / 60));
  
  // Find longest networth timeline among players
  const maxTimelineLength = useMemo(() => {
    let len = 0;
    players.forEach((p) => {
      if (Array.isArray(p.networthTimeline) && p.networthTimeline.length > len) {
        len = p.networthTimeline.length;
      }
    });
    return len > 0 ? len - 1 : maxMinuteFromDuration;
  }, [players, maxMinuteFromDuration]);

  const totalMinutes = Math.max(10, maxTimelineLength);

  // Hover state (default to game end or 10 min)
  const [hoveredMinute, setHoveredMinute] = useState<number>(totalMinutes);
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [teamFilter, setTeamFilter] = useState<"all" | "radiant" | "dire">("all");

  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Check if any player has net worth timeline data
  const hasTimelineData = useMemo(() => {
    return players.some(
      (p) => Array.isArray(p.networthTimeline) && p.networthTimeline.length > 0
    );
  }, [players]);

  // Global peak net worth across all players and all minutes
  const maxNetWorth = useMemo(() => {
    let peak = 1000;
    players.forEach((p) => {
      if (Array.isArray(p.networthTimeline) && p.networthTimeline.length > 0) {
        const pMax = Math.max(...p.networthTimeline);
        if (pMax > peak) peak = pMax;
      } else if (p.netWorth > peak) {
        peak = p.netWorth;
      }
    });
    // Round up to nice threshold
    return Math.max(5000, Math.ceil(peak / 2500) * 2500);
  }, [players]);

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 380;
  const padding = { top: 25, right: 25, bottom: 35, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = useCallback(
    (min: number) => {
      return padding.left + (Math.min(min, totalMinutes) / totalMinutes) * plotWidth;
    },
    [padding.left, plotWidth, totalMinutes]
  );

  const scaleY = useCallback(
    (nw: number) => {
      const clamped = Math.max(0, Math.min(nw, maxNetWorth));
      return padding.top + plotHeight - (clamped / maxNetWorth) * plotHeight;
    },
    [padding.top, plotHeight, maxNetWorth]
  );

  // Filtered players list based on team filter
  const visiblePlayers = useMemo(() => {
    return players.filter((p) => {
      if (teamFilter === "radiant") return p.isRadiant;
      if (teamFilter === "dire") return !p.isRadiant;
      return true;
    });
  }, [players, teamFilter]);

  // Paths for each player
  const playerPaths = useMemo(() => {
    return players.map((p, idx) => {
      const color = getPlayerColor(p.playerSlot, idx, p.isRadiant);
      const timeline = Array.isArray(p.networthTimeline) && p.networthTimeline.length > 0
        ? p.networthTimeline
        : [0, p.netWorth];

      let d = "";
      timeline.forEach((nw, min) => {
        if (min > totalMinutes) return;
        const x = scaleX(min);
        const y = scaleY(nw);
        d += min === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      });

      return {
        player: p,
        d,
        color,
      };
    });
  }, [players, totalMinutes, scaleX, scaleY]);

  // Ranking of all players at the currently hovered minute
  const rankedPlayersAtMinute = useMemo(() => {
    const list = players.map((p, idx) => {
      const color = getPlayerColor(p.playerSlot, idx, p.isRadiant);
      let nwAtMin = 0;
      let lhAtMin = 0;

      if (Array.isArray(p.networthTimeline) && p.networthTimeline.length > 0) {
        if (hoveredMinute < p.networthTimeline.length) {
          nwAtMin = p.networthTimeline[hoveredMinute];
        } else {
          nwAtMin = p.networthTimeline[p.networthTimeline.length - 1];
        }
      } else {
        // Fallback interpolation if timeline is missing
        nwAtMin = Math.round((p.netWorth * Math.min(hoveredMinute, totalMinutes)) / totalMinutes);
      }

      if (Array.isArray(p.lhTimeline) && p.lhTimeline.length > 0) {
        if (hoveredMinute < p.lhTimeline.length) {
          lhAtMin = p.lhTimeline[hoveredMinute];
        } else {
          lhAtMin = p.lhTimeline[p.lhTimeline.length - 1];
        }
      } else {
        lhAtMin = Math.round((p.lastHits * Math.min(hoveredMinute, totalMinutes)) / totalMinutes);
      }

      return {
        player: p,
        netWorth: nwAtMin,
        lastHits: lhAtMin,
        color,
      };
    });

    list.sort((a, b) => b.netWorth - a.netWorth);
    return list;
  }, [players, hoveredMinute, totalMinutes]);

  // Handle pointer hover / scrub over SVG
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relX = clientX - (padding.left / svgWidth) * rect.width;
    const effectivePlotWidth = (plotWidth / svgWidth) * rect.width;

    const ratio = Math.max(0, Math.min(1, relX / effectivePlotWidth));
    const targetMin = Math.round(ratio * totalMinutes);
    setHoveredMinute(targetMin);
  };

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const count = 5;
    const step = maxNetWorth / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(i * step));
  }, [maxNetWorth]);

  // X-axis ticks (every 5 or 10 min)
  const xTicks = useMemo(() => {
    const step = totalMinutes <= 30 ? 5 : totalMinutes <= 60 ? 10 : 15;
    const ticks: number[] = [];
    for (let m = 0; m <= totalMinutes; m += step) {
      ticks.push(m);
    }
    if (ticks[ticks.length - 1] !== totalMinutes) {
      ticks.push(totalMinutes);
    }
    return ticks;
  }, [totalMinutes]);

  const topNetWorthAtMinute = rankedPlayersAtMinute[0]?.netWorth || 1;

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-amber-400" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              HERO NET WORTH TIMELINE &amp; TIME SCRUBBER
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Hover over any minute along the timeline to inspect live hero economy rankings and farm trajectories.
          </p>
        </div>

        {/* Team Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-sm bg-zinc-900 border border-white/[0.08] p-0.5 text-xs font-mono">
            <button
              onClick={() => setTeamFilter("all")}
              className={`px-3 py-1 rounded-xs transition-colors ${
                teamFilter === "all"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All 10 Heroes
            </button>
            <button
              onClick={() => setTeamFilter("radiant")}
              className={`px-3 py-1 rounded-xs transition-colors ${
                teamFilter === "radiant"
                  ? "bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-600/40"
                  : "text-zinc-400 hover:text-emerald-400"
              }`}
            >
              Radiant Only
            </button>
            <button
              onClick={() => setTeamFilter("dire")}
              className={`px-3 py-1 rounded-xs transition-colors ${
                teamFilter === "dire"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-600/40"
                  : "text-zinc-400 hover:text-rose-400"
              }`}
            >
              Dire Only
            </button>
          </div>
        </div>
      </div>

      {!isParsed || !hasTimelineData ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <ShieldAlert className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Minute-by-Minute Net Worth Telemetry Unavailable
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Individual hero net worth time series requires a parsed Dota 2 replay file.
            Request a replay parse using the button at the top of the analyzer to generate this graph.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart Area (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Interactive SVG Chart */}
            <div
              ref={svgContainerRef}
              className="relative rounded-sm bg-black/50 border border-white/[0.08] p-2 overflow-hidden select-none"
            >
              {/* Live Time Badge */}
              <div className="absolute top-3 left-14 z-10 flex items-center gap-2 bg-zinc-950/90 border border-white/[0.1] px-2.5 py-1 rounded-sm text-xs font-mono">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-zinc-400">Scrubbed Time:</span>
                <strong className="text-white font-bold">{hoveredMinute}:00</strong>
              </div>

              {selectedHeroId && (
                <button
                  onClick={() => setSelectedHeroId(null)}
                  className="absolute top-3 right-4 z-10 text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-900/90 border border-white/[0.1] px-2 py-1 rounded-xs"
                >
                  Reset Isolation ✕
                </button>
              )}

              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto cursor-crosshair"
                onPointerMove={handlePointerMove}
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="nw-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect
                  x={padding.left}
                  y={padding.top}
                  width={plotWidth}
                  height={plotHeight}
                  fill="url(#nw-grid)"
                />

                {/* Horizontal Y-Axis Grid Lines & Labels */}
                {yTicks.map((val) => {
                  const y = scaleY(val);
                  return (
                    <g key={`y-${val}`}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={padding.left + plotWidth}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.06)"
                        strokeDasharray={val === 0 ? "" : "3 3"}
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-zinc-500 font-mono"
                      >
                        {val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : val}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical X-Axis Grid Lines & Labels */}
                {xTicks.map((min) => {
                  const x = scaleX(min);
                  return (
                    <g key={`x-${min}`}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + plotHeight}
                        stroke="rgba(255, 255, 255, 0.04)"
                      />
                      <text
                        x={x}
                        y={padding.top + plotHeight + 16}
                        textAnchor="middle"
                        className="text-[9px] fill-zinc-500 font-mono"
                      >
                        {min}:00
                      </text>
                    </g>
                  );
                })}

                {/* Hero Net Worth Lines */}
                {playerPaths.map(({ player, d, color }) => {
                  const isVisible =
                    teamFilter === "all" ||
                    (teamFilter === "radiant" && player.isRadiant) ||
                    (teamFilter === "dire" && !player.isRadiant);

                  if (!isVisible) return null;

                  const isSelected = selectedHeroId === player.heroId;
                  const isDimmed = selectedHeroId !== null && !isSelected;

                  return (
                    <path
                      key={player.playerSlot}
                      d={d}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth={isSelected ? 3.5 : isDimmed ? 1 : 2}
                      strokeOpacity={isDimmed ? 0.15 : isSelected ? 1 : 0.85}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-150 cursor-pointer"
                      onClick={() => setSelectedHeroId(isSelected ? null : player.heroId)}
                    />
                  );
                })}

                {/* Vertical Hover Cursor Guide Line */}
                {hoveredMinute <= totalMinutes && (
                  <g pointerEvents="none">
                    <line
                      x1={scaleX(hoveredMinute)}
                      y1={padding.top}
                      x2={scaleX(hoveredMinute)}
                      y2={padding.top + plotHeight}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />

                    {/* Circular markers for each visible hero at hovered minute */}
                    {rankedPlayersAtMinute.map(({ player, netWorth, color }) => {
                      const isVisible =
                        teamFilter === "all" ||
                        (teamFilter === "radiant" && player.isRadiant) ||
                        (teamFilter === "dire" && !player.isRadiant);
                      if (!isVisible) return null;

                      const cx = scaleX(hoveredMinute);
                      const cy = scaleY(netWorth);
                      const isSelected = selectedHeroId === player.heroId;

                      return (
                        <circle
                          key={`dot-${player.playerSlot}`}
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 5 : 3.5}
                          fill={color.stroke}
                          stroke="#000000"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            {/* Time Scrubber Slider Bar */}
            <div className="p-3 bg-black/40 rounded-sm border border-white/[0.06] flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">0:00</span>
              <input
                type="range"
                min={0}
                max={totalMinutes}
                value={hoveredMinute}
                onChange={(e) => setHoveredMinute(Number(e.target.value))}
                className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">{totalMinutes}:00</span>
            </div>

            {/* Hero Quick Click Badges to Isolate */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              {players.map((p, idx) => {
                const color = getPlayerColor(p.playerSlot, idx, p.isRadiant);
                const isSelected = selectedHeroId === p.heroId;

                return (
                  <button
                    key={p.playerSlot}
                    onClick={() => setSelectedHeroId(isSelected ? null : p.heroId)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-xs border text-[10px] font-mono transition-all ${
                      isSelected
                        ? "bg-zinc-800 border-white/30 text-white font-bold"
                        : "bg-zinc-950/60 border-white/[0.06] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color.stroke }}
                    />
                    <span>{p.heroLocalizedName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Panel at Current Hovered Time (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="p-4 rounded-sm bg-black/50 border border-white/[0.08] flex-1 flex flex-col">
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    FARM RANKINGS @ {hoveredMinute}:00
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Sorted by NW</span>
              </div>

              {/* Ranked Players List */}
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {rankedPlayersAtMinute.map(({ player, netWorth, lastHits, color }, rankIdx) => {
                  const isLeader = rankIdx === 0;
                  const isSelected = selectedHeroId === player.heroId;
                  const pctOfLeader =
                    topNetWorthAtMinute > 0
                      ? Math.min(100, Math.round((netWorth / topNetWorthAtMinute) * 100))
                      : 0;

                  return (
                    <div
                      key={player.playerSlot}
                      onClick={() => setSelectedHeroId(isSelected ? null : player.heroId)}
                      className={`p-2 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-zinc-900 border-amber-500/50 shadow-sm"
                          : "bg-zinc-950/70 border-white/[0.04] hover:border-white/[0.15]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Rank + Hero Avatar + Names */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-[10px] font-mono font-bold w-4 text-center shrink-0 ${
                              isLeader ? "text-amber-400" : "text-zinc-500"
                            }`}
                          >
                            #{rankIdx + 1}
                          </span>

                          <div className="relative w-8 h-5.5 rounded-xs overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
                            <Image
                              src={player.heroImg}
                              alt={player.heroLocalizedName}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs font-mono font-bold text-white truncate">
                                {player.heroLocalizedName}
                              </span>
                              <span
                                className={`text-[8px] font-mono px-1 py-0.2 rounded-2xs ${
                                  player.isRadiant
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-600/30"
                                    : "bg-rose-950 text-rose-400 border border-rose-600/30"
                                }`}
                              >
                                {player.isRadiant ? "RAD" : "DIRE"}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 truncate block">
                              {player.personaName}
                            </span>
                          </div>
                        </div>

                        {/* Economy metrics */}
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-amber-300">
                            {netWorth.toLocaleString()} g
                          </div>
                          <div className="text-[9px] font-mono text-zinc-500">
                            {lastHits} CS
                          </div>
                        </div>
                      </div>

                      {/* Comparative Progress Bar */}
                      <div className="mt-1.5 w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-150"
                          style={{
                            width: `${pctOfLeader}%`,
                            backgroundColor: color.stroke,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
