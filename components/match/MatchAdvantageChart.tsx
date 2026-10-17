"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Coins, Sparkles, AlertCircle } from "lucide-react";

interface MatchAdvantageChartProps {
  goldTimeline: { minute: number; advantage: number }[];
  xpTimeline: { minute: number; advantage: number }[];
  isParsed: boolean;
}

export function MatchAdvantageChart({
  goldTimeline,
  xpTimeline,
  isParsed,
}: MatchAdvantageChartProps) {
  const [metric, setMetric] = useState<"gold" | "xp">("gold");
  const [hoveredPoint, setHoveredPoint] = useState<{ minute: number; advantage: number; x: number; y: number } | null>(null);

  const activeTimeline = metric === "gold" ? goldTimeline : xpTimeline;

  // Chart boundaries
  const { maxAbsAdvantage, totalMinutes } = useMemo(() => {
    if (activeTimeline.length === 0) return { maxAbsAdvantage: 10000, totalMinutes: 30 };
    const maxVal = Math.max(...activeTimeline.map((p) => Math.abs(p.advantage)));
    const roundedMax = Math.max(5000, Math.ceil(maxVal / 2500) * 2500);
    return {
      maxAbsAdvantage: roundedMax,
      totalMinutes: Math.max(10, activeTimeline.length - 1),
    };
  }, [activeTimeline]);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;
  const zeroY = padding.top + plotHeight / 2;

  const scaleX = (min: number) => {
    return padding.left + (min / totalMinutes) * plotWidth;
  };

  const scaleY = (adv: number) => {
    // adv positive = above zero (Radiant), adv negative = below zero (Dire)
    return zeroY - (adv / maxAbsAdvantage) * (plotHeight / 2);
  };

  // Build SVG path
  const pathD = useMemo(() => {
    if (activeTimeline.length === 0) return "";
    return activeTimeline.reduce((acc, pt, idx) => {
      const x = scaleX(pt.minute);
      const y = scaleY(pt.advantage);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [activeTimeline, totalMinutes, maxAbsAdvantage]);

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              GOLD &amp; EXPERIENCE ADVANTAGE TIMELINE
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Net team swing minute-by-minute throughout the match duration.
          </p>
        </div>

        {/* Metric Selector */}
        {isParsed && (
          <div className="inline-flex rounded-sm bg-zinc-900 border border-white/[0.08] p-0.5">
            <button
              onClick={() => {
                setMetric("gold");
                setHoveredPoint(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                metric === "gold" ? "bg-amber-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Coins className="h-3 w-3" />
              <span>Gold Advantage</span>
            </button>
            <button
              onClick={() => {
                setMetric("xp");
                setHoveredPoint(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                metric === "xp" ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>XP Advantage</span>
            </button>
          </div>
        )}
      </div>

      {!isParsed || activeTimeline.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Advantage Graphs Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Minute-by-minute gold and XP advantage curves require recorded replay telemetry.
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden bg-black/40 border border-white/[0.06] rounded-sm p-2 sm:p-4">
          {/* Watermark Labels */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none select-none text-[10px] font-mono opacity-25">
            <div className="text-emerald-400 font-bold uppercase tracking-wider">
              ▲ THE RADIANT ADVANTAGE
            </div>
            <div className="text-rose-400 font-bold uppercase tracking-wider">
              ▼ THE DIRE ADVANTAGE
            </div>
          </div>

          {/* SVG Graph */}
          <div className="relative w-full aspect-[2/1] min-h-[280px] max-h-[420px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="radGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="direGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Zero-line */}
              <line
                x1={padding.left}
                y1={zeroY}
                x2={padding.left + plotWidth}
                y2={zeroY}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />

              {/* Y Axis Guide Lines & Labels */}
              {[-maxAbsAdvantage, -maxAbsAdvantage / 2, 0, maxAbsAdvantage / 2, maxAbsAdvantage].map(
                (adv) => {
                  const y = scaleY(adv);
                  return (
                    <g key={`y-${adv}`}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={padding.left + plotWidth}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        fill={adv > 0 ? "#10B981" : adv < 0 ? "#F43F5E" : "#71717A"}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {adv > 0 ? `+${adv.toLocaleString()}` : adv.toLocaleString()}
                      </text>
                    </g>
                  );
                }
              )}

              {/* X Axis Minute Markers */}
              {Array.from({ length: Math.ceil(totalMinutes / 5) + 1 }).map((_, i) => {
                const minute = i * 5;
                if (minute > totalMinutes) return null;
                const x = scaleX(minute);
                return (
                  <g key={`x-${minute}`}>
                    <line
                      x1={x}
                      y1={padding.top + plotHeight}
                      x2={x}
                      y2={padding.top + plotHeight + 5}
                      stroke="rgba(255, 255, 255, 0.2)"
                    />
                    <text
                      x={x}
                      y={padding.top + plotHeight + 16}
                      fill="#71717A"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {minute}m
                    </text>
                  </g>
                );
              })}

              {/* Main Line */}
              <path
                d={pathD}
                fill="none"
                stroke={metric === "gold" ? "#F59E0B" : "#3B82F6"}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Trigger Slices */}
              {activeTimeline.map((pt) => {
                const cx = scaleX(pt.minute);
                const cy = scaleY(pt.advantage);
                return (
                  <circle
                    key={`dot-${pt.minute}`}
                    cx={cx}
                    cy={cy}
                    r={hoveredPoint?.minute === pt.minute ? 5 : 2.5}
                    fill={pt.advantage >= 0 ? "#10B981" : "#F43F5E"}
                    stroke="#FFFFFF"
                    strokeWidth={hoveredPoint?.minute === pt.minute ? 2 : 0}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ minute: pt.minute, advantage: pt.advantage, x: cx, y: cy })
                    }
                  />
                );
              })}
            </svg>

            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-zinc-950/95 border border-white/[0.15] p-2.5 rounded-sm shadow-xl backdrop-blur-md text-xs font-mono"
                style={{
                  left: `${Math.min(75, Math.max(15, (hoveredPoint.minute / totalMinutes) * 100))}%`,
                  top: "10%",
                }}
              >
                <div className="text-zinc-400 text-[10px] uppercase mb-0.5">
                  TIME: {hoveredPoint.minute}:00
                </div>
                <div
                  className={`font-black ${
                    hoveredPoint.advantage >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {hoveredPoint.advantage >= 0
                    ? `Radiant +${hoveredPoint.advantage.toLocaleString()} ${metric.toUpperCase()}`
                    : `Dire +${Math.abs(hoveredPoint.advantage).toLocaleString()} ${metric.toUpperCase()}`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
