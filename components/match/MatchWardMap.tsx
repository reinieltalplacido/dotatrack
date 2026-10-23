"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Eye,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Clock,
  Layers,
  Flame,
  CheckCircle2,
  Crosshair,
} from "lucide-react";
import { MatchWardEvent } from "@/lib/opendota/match-types";

interface MatchWardMapProps {
  wards: MatchWardEvent[];
  durationSeconds: number;
  isParsed: boolean;
}

type ViewMode = "pins" | "heatmap" | "all";
type TeamFilter = "all" | "radiant" | "dire";
type TypeFilter = "all" | "observer" | "sentry";

export function MatchWardMap({ wards, durationSeconds, isParsed }: MatchWardMapProps) {
  // Scrubber time in seconds
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(2);
  const [viewMode, setViewMode] = useState<ViewMode>("pins");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [hoveredWard, setHoveredWard] = useState<MatchWardEvent | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSec * playbackSpeed * 10;
        if (nextTime >= durationSeconds) {
          setIsPlaying(false);
          return durationSeconds;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, durationSeconds]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const isNeg = secs < 0;
    const abs = Math.abs(Math.floor(secs));
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    return `${isNeg ? "-" : ""}${m}:${s.toString().padStart(2, "0")}`;
  };

  // Filtered wards according to team & type filters
  const filteredWards = useMemo(() => {
    return wards.filter((w) => {
      if (teamFilter === "radiant" && !w.isRadiant) return false;
      if (teamFilter === "dire" && w.isRadiant) return false;
      if (typeFilter !== "all" && w.type !== typeFilter) return false;
      return true;
    });
  }, [wards, teamFilter, typeFilter]);

  // Wards active at the current scrubber time
  const activeWards = useMemo(() => {
    return filteredWards.filter((w) => {
      if (viewMode === "all") return true;
      return currentTime >= w.time && currentTime <= w.leftTime;
    });
  }, [filteredWards, currentTime, viewMode]);

  // Stats computation
  const stats = useMemo(() => {
    const radObs = wards.filter((w) => w.isRadiant && w.type === "observer");
    const direObs = wards.filter((w) => !w.isRadiant && w.type === "observer");
    const radSen = wards.filter((w) => w.isRadiant && w.type === "sentry");
    const direSen = wards.filter((w) => !w.isRadiant && w.type === "sentry");

    const radDewards = radObs.filter((w) => w.isDewarded).length;
    const direDewards = direObs.filter((w) => w.isDewarded).length;

    const currentRadActive = activeWards.filter((w) => w.isRadiant && w.type === "observer").length;
    const currentDireActive = activeWards.filter((w) => !w.isRadiant && w.type === "observer").length;
    const totalActiveObs = currentRadActive + currentDireActive;

    const radControlPercent =
      totalActiveObs > 0 ? Math.round((currentRadActive / totalActiveObs) * 100) : 50;

    return {
      radObsCount: radObs.length,
      direObsCount: direObs.length,
      radSenCount: radSen.length,
      direSenCount: direSen.length,
      radDewards,
      direDewards,
      currentRadActive,
      currentDireActive,
      radControlPercent,
      direControlPercent: 100 - radControlPercent,
    };
  }, [wards, activeWards]);

  if (!isParsed || wards.length === 0) {
    return (
      <div className="tactical-panel p-10 text-center rounded-sm border border-white/[0.08] bg-[#0A0C14]">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/40 border border-rose-500/20 text-rose-400 mb-3">
          <Eye className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
          Ward &amp; Vision Data Unavailable
        </h3>
        <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
          Detailed observer and sentry coordinates require a parsed replay file from OpenDota. This match was either not parsed or vision logs were withheld.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner: Vision Control Balance & Summary Stats */}
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#0A0C14]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Tactical Vision &amp; Ward Minimap
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Interactive timeline replay of observer and sentry placements, vision coverage, and deward spots.
            </p>
          </div>

          {/* Active Observer Ratio Meter */}
          <div className="flex flex-col gap-1.5 min-w-[240px] bg-black/40 p-2.5 rounded-sm border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                Radiant: {stats.currentRadActive} Obs ({stats.radControlPercent}%)
              </span>
              <span className="text-rose-400 font-bold">
                Dire: {stats.currentDireActive} Obs ({stats.direControlPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-xs overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${stats.radControlPercent}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${stats.direControlPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{stats.radObsCount} Obs / {stats.radSenCount} Sen Total</span>
              <span>{stats.direObsCount} Obs / {stats.direSenCount} Sen Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace: Minimap Canvas & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Minimap (8 cols) */}
        <div className="lg:col-span-8 tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#07090E] flex flex-col items-center justify-center">
          {/* Controls Bar Above Map */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 text-xs font-mono">
            {/* View Mode */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/[0.06]">
              <span className="text-zinc-500 px-1 text-[11px] hidden sm:inline">Mode:</span>
              <button
                type="button"
                onClick={() => setViewMode("pins")}
                className={`px-2.5 py-1 rounded-xs uppercase font-bold transition-all ${
                  viewMode === "pins"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Pin View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("heatmap")}
                className={`px-2.5 py-1 rounded-xs uppercase font-bold transition-all ${
                  viewMode === "heatmap"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Heatmap
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-2.5 py-1 rounded-xs uppercase font-bold transition-all ${
                  viewMode === "all"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All Match
              </button>
            </div>

            {/* Team Filter */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTeamFilter("all")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  teamFilter === "all"
                    ? "bg-white/[0.15] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Both Teams
              </button>
              <button
                type="button"
                onClick={() => setTeamFilter("radiant")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  teamFilter === "radiant"
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-500 hover:text-white"
                }`}
              >
                Radiant
              </button>
              <button
                type="button"
                onClick={() => setTeamFilter("dire")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  teamFilter === "dire"
                    ? "bg-rose-700 text-white"
                    : "text-rose-500 hover:text-white"
                }`}
              >
                Dire
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  typeFilter === "all"
                    ? "bg-white/[0.15] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                All Wards
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("observer")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  typeFilter === "observer"
                    ? "bg-amber-600 text-white"
                    : "text-amber-400 hover:text-white"
                }`}
              >
                Observers ({wards.filter((w) => w.type === "observer").length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("sentry")}
                className={`px-2 py-1 rounded-xs uppercase font-bold transition-all ${
                  typeFilter === "sentry"
                    ? "bg-sky-600 text-white"
                    : "text-sky-400 hover:text-white"
                }`}
              >
                Sentries ({wards.filter((w) => w.type === "sentry").length})
              </button>
            </div>
          </div>

          {/* Minimap Tactical Canvas Container */}
          <div className="relative w-full aspect-square max-w-[560px] rounded-sm overflow-hidden border border-white/[0.15] shadow-2xl bg-[#080B10]">
            {/* Authentic Dota 2 Minimap Terrain */}
            <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
              <source srcSet="/images/map/dota_map.webp" type="image/webp" />
              <img
                src="/images/map/dota_map.jpg"
                alt="Dota 2 Minimap Terrain"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </picture>

            {/* Tactical Map Vignette & Ambient Glow for high contrast */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_28px_rgba(0,0,0,0.65)] ring-1 ring-inset ring-white/[0.08]" />

            {/* SVG Overlay: Vision Heatmap & True Sight Fields */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
            >
              <defs>
                {/* Radiant Observer Vision Gradient */}
                <radialGradient id="obsRadVision" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>

                {/* Dire Observer Vision Gradient */}
                <radialGradient id="obsDireVision" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                </radialGradient>

                {/* Sentry True Sight Radial Gradient */}
                <radialGradient id="senVision" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
                  <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* VIEW: Vision Heatmap Circles */}
              {viewMode === "heatmap" && (
                <g>
                  {activeWards.map((ward) => {
                    const isObs = ward.type === "observer";
                    const radius = isObs ? 13.5 : 8.5;
                    const fillGrad =
                      ward.type === "sentry"
                        ? "url(#senVision)"
                        : ward.isRadiant
                        ? "url(#obsRadVision)"
                        : "url(#obsDireVision)";

                    return (
                      <circle
                        key={`heat-${ward.id}`}
                        cx={ward.x}
                        cy={ward.y}
                        r={radius}
                        fill={fillGrad}
                        className="animate-pulse"
                      />
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Ward Pin Markers Layer */}
            <div className="absolute inset-0 z-20">
              {activeWards.map((ward) => {
                const isHovered = hoveredWard?.id === ward.id;
                const isObs = ward.type === "observer";

                return (
                  <div
                    key={ward.id}
                    style={{ left: `${ward.x}%`, top: `${ward.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform duration-150 hover:scale-130 drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]"
                    onMouseEnter={() => setHoveredWard(ward)}
                    onMouseLeave={() => setHoveredWard(null)}
                  >
                    {/* Pulsing vision ring for active observer */}
                    {isObs && viewMode === "pins" && (
                      <div
                        className={`absolute inset-0 rounded-full animate-ping opacity-35 ${
                          ward.isRadiant ? "bg-emerald-400" : "bg-rose-500"
                        }`}
                        style={{ width: "24px", height: "24px", left: "-6px", top: "-6px" }}
                      />
                    )}

                    {/* Ward Badge */}
                    <div
                      className={`relative flex items-center justify-center rounded-full border shadow-xl transition-all ${
                        isObs
                          ? ward.isRadiant
                            ? "h-4.5 w-4.5 bg-emerald-950 border-emerald-400 text-emerald-300 ring-1 ring-black/80"
                            : "h-4.5 w-4.5 bg-rose-950 border-rose-400 text-rose-300 ring-1 ring-black/80"
                          : "h-4 w-4 bg-sky-950 border-sky-400 text-sky-200 ring-1 ring-black/80"
                      } ${isHovered ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-125 z-30" : ""}`}
                    >
                      {isObs ? (
                        <Eye className="h-2.5 w-2.5" />
                      ) : (
                        <Shield className="h-2 w-2" />
                      )}

                      {/* Dewarded Badge if destroyed */}
                      {ward.isDewarded && (
                        <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-600 border border-black flex items-center justify-center">
                          <span className="text-[7px] text-white font-black leading-none">×</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hover Tooltip Overlay on Map */}
            {hoveredWard && (
              <div
                className="absolute z-30 pointer-events-none bg-[#090C14]/95 border border-white/[0.2] p-2.5 rounded-sm shadow-2xl backdrop-blur-md text-xs font-mono max-w-[210px] animate-in fade-in zoom-in-95 duration-100"
                style={{
                  left: `${Math.min(75, Math.max(10, hoveredWard.x))}%`,
                  top: `${Math.min(75, Math.max(10, hoveredWard.y))}%`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5 border-b border-white/[0.08] pb-1.5">
                  <div className="relative h-6 w-9 rounded-xs overflow-hidden border border-white/[0.1] bg-black shrink-0">
                    <Image
                      src={hoveredWard.heroImg}
                      alt={hoveredWard.heroLocalizedName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-white block truncate">
                      {hoveredWard.heroLocalizedName}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        hoveredWard.isRadiant ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {hoveredWard.isRadiant ? "Radiant" : "Dire"}{" "}
                      {hoveredWard.type === "observer" ? "Observer" : "Sentry"}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 text-[10px] text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Placed:</span>
                    <span className="text-white font-bold">{hoveredWard.timeFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Expired:</span>
                    <span className="text-zinc-300">{hoveredWard.leftTimeFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Duration:</span>
                    <span className="text-amber-400 font-bold">{hoveredWard.duration}s</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/[0.04]">
                    <span className="text-zinc-500">Outcome:</span>
                    <span
                      className={
                        hoveredWard.isDewarded
                          ? "text-rose-400 font-bold uppercase"
                          : "text-emerald-400 font-bold uppercase"
                      }
                    >
                      {hoveredWard.isDewarded ? "Dewarded by Enemy" : "Natural Expiry"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrubber & Playback Controls Below Map */}
          <div className="w-full mt-4 bg-black/50 p-3 rounded-sm border border-white/[0.06] space-y-2.5">
            {/* Scrubber Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.1]">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    / {formatTime(durationSeconds)}
                  </span>
                </div>
                <span className="text-zinc-400 text-[11px]">
                  Active: <strong className="text-amber-400">{activeWards.length}</strong> wards
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={durationSeconds}
                step={1}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  if (isPlaying) setIsPlaying(false);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Playback Controls Strip */}
            <div className="flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-bold uppercase transition-all ${
                    isPlaying
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-amber-600 text-white hover:bg-amber-500"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>Play Replay</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 rounded-sm bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  title="Rewind to 00:00"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Playback Speed Toggles */}
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-white/[0.06]">
                <span className="text-zinc-500 px-1 text-[10px]">Speed:</span>
                {([1, 2, 5, 10] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      playbackSpeed === spd
                        ? "bg-amber-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vision Analytics & Ward Ledger (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Vision Control Assessment Card */}
          <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#0A0C14] space-y-3">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Vision Dominance Ratio
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-sm">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  Radiant Vision
                </span>
                <div className="text-lg font-black text-white">{stats.radControlPercent}%</div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {stats.radObsCount} Obs / {stats.radDewards} Dewarded
                </div>
              </div>

              <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-sm">
                <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                  Dire Vision
                </span>
                <div className="text-lg font-black text-white">{stats.direControlPercent}%</div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {stats.direObsCount} Obs / {stats.direDewards} Dewarded
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-2">
              {stats.radControlPercent >= 55
                ? "Radiant maintained dominant map vision coverage, granting superior gank safety and Roshan awareness."
                : stats.direControlPercent >= 55
                ? "Dire vision control strangled Radiant map movements, forcing blind highground or jungle smoke plays."
                : "Vision contested evenly across both team river thresholds."}
            </p>
          </div>

          {/* Active Wards Feed at Current Scrubber Time */}
          <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#0A0C14]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Active Wards ({activeWards.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">at {formatTime(currentTime)}</span>
            </div>

            {activeWards.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">
                No active wards planted at this game time.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {activeWards.map((w) => (
                  <div
                    key={w.id}
                    onMouseEnter={() => setHoveredWard(w)}
                    onMouseLeave={() => setHoveredWard(null)}
                    className={`flex items-center justify-between gap-2.5 p-2 rounded-sm border transition-all cursor-pointer ${
                      w.isRadiant
                        ? "bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-500/60"
                        : "bg-rose-950/20 border-rose-900/40 hover:border-rose-500/60"
                    } ${hoveredWard?.id === w.id ? "ring-1 ring-white" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-6 w-9 rounded-xs overflow-hidden border border-white/[0.1] bg-black shrink-0">
                        <Image
                          src={w.heroImg}
                          alt={w.heroLocalizedName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {w.heroLocalizedName}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {w.type === "observer" ? "Observer Ward" : "Sentry Ward"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-[10px] font-mono">
                      <div className="text-amber-400 font-bold">{w.timeFormatted}</div>
                      <div className="text-zinc-500">{w.duration}s lifetime</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
