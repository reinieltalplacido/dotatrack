"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Swords,
  Search,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Trophy,
  Skull,
  Loader2,
  RefreshCw,
  Info,
} from "lucide-react";
import { PlayerDashboardData, PlayerHeroMatchup } from "@/lib/opendota/types";

interface MatchupsTabProps {
  data: PlayerDashboardData;
}

type MatchupMode = "allies" | "enemies";
type AttributeFilter = "all" | "str" | "agi" | "int" | "all_attr";

export function MatchupsTab({ data }: MatchupsTabProps) {
  const [mode, setMode] = useState<MatchupMode>("allies");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<AttributeFilter>("all");
  const [minGames, setMinGames] = useState<number>(3);
  const [sortBy, setSortBy] = useState<string>("synergy");

  // Client-side fallback fetch in case matchups weren't present in props (e.g. cached payload)
  const [clientMatchups, setClientMatchups] = useState<{
    allies: PlayerHeroMatchup[];
    enemies: PlayerHeroMatchup[];
  } | null>(data.matchups || null);
  const [isLoadingFallback, setIsLoadingFallback] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  useEffect(() => {
    if (data.matchups && (data.matchups.allies.length > 0 || data.matchups.enemies.length > 0)) {
      setClientMatchups(data.matchups);
      return;
    }

    // Fetch on-demand from dedicated route
    let isCancelled = false;
    setIsLoadingFallback(true);
    setFallbackError(null);

    fetch(`/api/players/${data.accountId}/matchups`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load matchups");
        return res.json();
      })
      .then((json) => {
        if (!isCancelled) {
          setClientMatchups({
            allies: json.allies || [],
            enemies: json.enemies || [],
          });
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setFallbackError(err?.message || "Failed to load matchups");
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingFallback(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [data.accountId, data.matchups]);

  const lifetimeWinRate = data.lifetime?.winRate ?? 50.0;

  // Active list based on selected mode
  const activeList: PlayerHeroMatchup[] = useMemo(() => {
    if (!clientMatchups) return [];
    return mode === "allies" ? clientMatchups.allies : clientMatchups.enemies;
  }, [clientMatchups, mode]);

  // Filtered & Sorted Matchups
  const filteredMatchups = useMemo(() => {
    return activeList
      .filter((hero) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = hero.heroLocalizedName.toLowerCase().includes(q);
          const matchSlug = hero.heroName.toLowerCase().includes(q);
          if (!matchName && !matchSlug) return false;
        }

        // Attribute filter
        if (selectedAttr !== "all") {
          const attr = hero.primaryAttr.toLowerCase();
          if (selectedAttr === "str" && attr !== "str") return false;
          if (selectedAttr === "agi" && attr !== "agi") return false;
          if (selectedAttr === "int" && attr !== "int") return false;
          if (selectedAttr === "all_attr" && attr !== "all") return false;
        }

        // Min games filter
        const games = mode === "allies" ? hero.withGames : hero.againstGames;
        if (games < minGames) return false;

        return true;
      })
      .sort((a, b) => {
        if (mode === "allies") {
          if (sortBy === "synergy") return b.synergyAdvantage - a.synergyAdvantage;
          if (sortBy === "winRate") return b.withWinRate - a.withWinRate;
          if (sortBy === "games") return b.withGames - a.withGames;
          if (sortBy === "lowestSynergy") return a.synergyAdvantage - b.synergyAdvantage;
        } else {
          if (sortBy === "synergy" || sortBy === "nemesis") return b.nemesisIndex - a.nemesisIndex;
          if (sortBy === "winRate") return a.againstWinRate - b.againstWinRate; // Lowest win rate = deadliest enemy
          if (sortBy === "easiest") return b.againstWinRate - a.againstWinRate; // Highest win rate = easiest enemy
          if (sortBy === "games") return b.againstGames - a.againstGames;
        }
        return 0;
      });
  }, [activeList, searchQuery, selectedAttr, minGames, sortBy, mode]);

  // Key Highlights (Top Ally, Nemesis, Victim)
  const highlights = useMemo(() => {
    if (!clientMatchups) return { topAlly: null, worstNemesis: null, bestVictim: null };

    // Minimum 3 games required for meaningful highlight
    const qualifiedAllies = clientMatchups.allies.filter((h) => h.withGames >= 3);
    const qualifiedEnemies = clientMatchups.enemies.filter((h) => h.againstGames >= 3);

    const sortedAllies = [...qualifiedAllies].sort((a, b) => b.synergyAdvantage - a.synergyAdvantage);
    const sortedEnemiesNemesis = [...qualifiedEnemies].sort((a, b) => b.nemesisIndex - a.nemesisIndex);
    const sortedEnemiesVictim = [...qualifiedEnemies].sort((a, b) => b.againstWinRate - a.againstWinRate);

    return {
      topAlly: sortedAllies[0] || null,
      worstNemesis: sortedEnemiesNemesis[0] || null,
      bestVictim: sortedEnemiesVictim[0] || null,
    };
  }, [clientMatchups]);

  if (isLoadingFallback) {
    return (
      <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin mb-3" />
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Loading Hero Matchups...
        </span>
        <span className="text-[11px] font-mono text-zinc-400 mt-1">
          Finding your best hero partners and counters...
        </span>
      </div>
    );
  }

  if (fallbackError) {
    return (
      <div className="tactical-panel p-8 text-center rounded-sm border border-red-800/60 bg-red-950/20">
        <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
          Matchups Unavailable
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-4">{fallbackError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-sm text-xs font-mono font-bold uppercase transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Tactical Header & Analytical Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Banner Info (Span 5) */}
        <div className="lg:col-span-5 tactical-panel p-5 rounded-sm border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                HERO MATCHUPS
              </span>
            </div>
            <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight">
              Hero Matchups &amp; Synergy
            </h2>
            <p className="text-xs font-sans text-zinc-300 mt-1.5 leading-relaxed">
              Win rates when playing with specific allied heroes or against enemy counters across all public matches.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Baseline Win Rate:</span>
            <span className="font-bold text-white">{lifetimeWinRate}%</span>
          </div>
        </div>

        {/* 3 Strategic Benchmark Cards (Span 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Top Ally Pick */}
          <div className="tactical-panel p-4 rounded-sm border border-emerald-900/40 bg-[#0C1210] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold mb-2">
                <span className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  <span>TOP ALLY</span>
                </span>
                <span>+{highlights.topAlly?.synergyAdvantage}%</span>
              </div>
              {highlights.topAlly ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 shrink-0 rounded-xs overflow-hidden border border-emerald-800/60">
                    <Image
                      src={highlights.topAlly.heroImageUrl}
                      alt={highlights.topAlly.heroLocalizedName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {highlights.topAlly.heroLocalizedName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">
                      {highlights.topAlly.withWinRate}% ({highlights.topAlly.withWin}W - {highlights.topAlly.withLoss}L)
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs font-mono text-zinc-500">Insufficient records</span>
              )}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 mt-2 block">
              Highest win correlation as teammate
            </span>
          </div>

          {/* Deadliest Nemesis */}
          <div className="tactical-panel p-4 rounded-sm border border-rose-900/40 bg-[#140A0F] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold mb-2">
                <span className="flex items-center gap-1">
                  <Skull className="h-3 w-3" />
                  <span>NEMESIS</span>
                </span>
                <span>{highlights.worstNemesis?.defeatRate}% LOSS</span>
              </div>
              {highlights.worstNemesis ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 shrink-0 rounded-xs overflow-hidden border border-rose-800/60">
                    <Image
                      src={highlights.worstNemesis.heroImageUrl}
                      alt={highlights.worstNemesis.heroLocalizedName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {highlights.worstNemesis.heroLocalizedName}
                    </span>
                    <span className="text-[10px] font-mono text-rose-300">
                      {highlights.worstNemesis.againstWinRate}% Win ({highlights.worstNemesis.againstGames} games)
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs font-mono text-zinc-500">Insufficient records</span>
              )}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 mt-2 block">
              Lowest win rate when opponent
            </span>
          </div>

          {/* Favorite Victim / Easiest Matchup */}
          <div className="tactical-panel p-4 rounded-sm border border-amber-900/40 bg-[#14110A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-2">
                <span className="flex items-center gap-1">
                  <Swords className="h-3 w-3" />
                  <span>FAVORITE FOE</span>
                </span>
                <span>{highlights.bestVictim?.againstWinRate}% WIN</span>
              </div>
              {highlights.bestVictim ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 shrink-0 rounded-xs overflow-hidden border border-amber-800/60">
                    <Image
                      src={highlights.bestVictim.heroImageUrl}
                      alt={highlights.bestVictim.heroLocalizedName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {highlights.bestVictim.heroLocalizedName}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      {highlights.bestVictim.againstWin}W - {highlights.bestVictim.againstLoss}L against
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs font-mono text-zinc-500">Insufficient records</span>
              )}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 mt-2 block">
              Highest win rate when facing enemy
            </span>
          </div>
        </div>
      </div>

      {/* 2. Mode Selector Bar (Allies vs Enemies) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-sm bg-[#0A0C14] border border-white/[0.08]">
        {/* Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-sm bg-black/40 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              setMode("allies");
              setSortBy("synergy");
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs text-xs font-mono font-bold uppercase transition-all ${
              mode === "allies"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>ALLY SYNERGY RADAR</span>
            <span className="text-[10px] px-1 rounded bg-black/30 font-normal">
              {clientMatchups?.allies.length ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("enemies");
              setSortBy("nemesis");
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs text-xs font-mono font-bold uppercase transition-all ${
              mode === "enemies"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>NEMESIS COUNTER MATRIX</span>
            <span className="text-[10px] px-1 rounded bg-black/30 font-normal">
              {clientMatchups?.enemies.length ?? 0}
            </span>
          </button>
        </div>

        {/* Tactical Info Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 pr-2">
          <Info className="h-3.5 w-3.5 text-zinc-500" />
          <span>
            {mode === "allies"
              ? "Positive synergy indicates higher win rate when paired with this hero"
              : "High nemesis rating indicates high defeat frequency against this enemy"}
          </span>
        </div>
      </div>

      {/* 3. Interactive Filtering & Sorting Toolbar */}
      <div className="p-4 rounded-sm bg-[#0E1018] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hero name..."
            className="w-full bg-[#08090C] border border-white/[0.1] rounded-sm pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Attribute Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-zinc-500 mr-1 hidden sm:inline">Attr:</span>
          {(
            [
              { key: "all", label: "ALL", color: "" },
              { key: "str", label: "STR", color: "text-red-400" },
              { key: "agi", label: "AGI", color: "text-emerald-400" },
              { key: "int", label: "INT", color: "text-sky-400" },
              { key: "all_attr", label: "UNI", color: "text-amber-400" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedAttr(item.key)}
              className={`px-2 py-1 rounded-xs uppercase font-bold transition-colors ${
                selectedAttr === item.key
                  ? "bg-white/[0.1] text-white border border-white/[0.2]"
                  : "text-zinc-400 hover:text-white bg-transparent border border-transparent"
              }`}
            >
              <span className={item.color || ""}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Min Games Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <span className="text-zinc-500 hidden sm:inline">Min Games:</span>
          <select
            value={minGames}
            onChange={(e) => setMinGames(Number(e.target.value))}
            className="bg-[#08090C] border border-white/[0.1] rounded-sm px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
          >
            <option value={1}>1+ Games</option>
            <option value={3}>3+ Games (Standard)</option>
            <option value={5}>5+ Games</option>
            <option value={10}>10+ Games (High Sample)</option>
            <option value={20}>20+ Games (Veteran)</option>
          </select>
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <span className="text-zinc-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#08090C] border border-white/[0.1] rounded-sm px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
          >
            {mode === "allies" ? (
              <>
                <option value="synergy">Highest Synergy (+Win%)</option>
                <option value="winRate">Highest Win Rate</option>
                <option value="games">Most Games Together</option>
                <option value="lowestSynergy">Lowest Synergy (-Win%)</option>
              </>
            ) : (
              <>
                <option value="nemesis">Deadliest Nemesis (High Loss%)</option>
                <option value="easiest">Easiest Matchup (High Win%)</option>
                <option value="games">Most Games Faced</option>
                <option value="winRate">Lowest Win Rate Against</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* 4. Active Results Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredMatchups.length}</strong> {mode === "allies" ? "allied synergy heroes" : "enemy counter matchups"}
        </span>
        <span className="text-[11px] text-zinc-500">
          Min Sample: {minGames} games | Sorted by {sortBy}
        </span>
      </div>

      {/* 5. Matchups Grid */}
      {filteredMatchups.length === 0 ? (
        <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08]">
          <ShieldAlert className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
            No Matchups Found
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            No heroes match your search or filter threshold ({minGames}+ games). Try lowering the minimum games filter or clearing the search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedAttr("all");
              setMinGames(1);
            }}
            className="mt-4 px-3 py-1.5 rounded-sm bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono font-bold text-zinc-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredMatchups.map((hero) => {
              const isAllyMode = mode === "allies";
              const games = isAllyMode ? hero.withGames : hero.againstGames;
              const wins = isAllyMode ? hero.withWin : hero.againstWin;
              const losses = isAllyMode ? hero.withLoss : hero.againstLoss;
              const winRate = isAllyMode ? hero.withWinRate : hero.againstWinRate;
              const delta = isAllyMode ? hero.synergyAdvantage : -hero.nemesisIndex;

              const isPositive = delta >= 0;
              const deltaFormatted = `${isPositive ? "+" : ""}${delta}%`;

              return (
                <motion.div
                  key={hero.heroId}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Avatar, Name, Attr, Delta */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-11 w-11 shrink-0 rounded-xs overflow-hidden border border-white/[0.1] bg-black">
                          <Image
                            src={hero.heroImageUrl}
                            alt={hero.heroLocalizedName}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white font-sans truncate">
                            {hero.heroLocalizedName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
                            <span
                              className={`uppercase font-bold ${
                                hero.primaryAttr === "str"
                                  ? "text-red-400"
                                  : hero.primaryAttr === "agi"
                                  ? "text-emerald-400"
                                  : hero.primaryAttr === "int"
                                  ? "text-sky-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {hero.primaryAttr}
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">{games} matches</span>
                          </div>
                        </div>
                      </div>

                      {/* Synergy / Nemesis Delta Badge */}
                      <div
                        className={`px-2 py-0.5 rounded-xs text-[11px] font-mono font-bold flex items-center gap-1 shrink-0 ${
                          isAllyMode
                            ? isPositive
                              ? "bg-emerald-950/70 border border-emerald-800/60 text-emerald-300"
                              : "bg-rose-950/70 border border-rose-800/60 text-rose-300"
                            : hero.againstWinRate < lifetimeWinRate
                            ? "bg-rose-950/70 border border-rose-800/60 text-rose-300"
                            : "bg-emerald-950/70 border border-emerald-800/60 text-emerald-300"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{deltaFormatted}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Win-Loss Tally */}
                    <div className="space-y-1.5 my-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-zinc-400">
                          {isAllyMode ? "Win Rate Together:" : "Win Rate Against:"}
                        </span>
                        <span className="font-bold text-white">{winRate}%</span>
                      </div>

                      {/* Segmented Win/Loss Bar */}
                      <div className="h-2 w-full bg-zinc-900 rounded-xs overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${winRate}%` }}
                        />
                        <div
                          className="h-full bg-rose-600"
                          style={{ width: `${Math.max(0, 100 - winRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats: Wins, Losses, and Context Note */}
                  <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="text-emerald-400 font-semibold">{wins}W</span>
                    <span className="text-zinc-500">/</span>
                    <span className="text-rose-400 font-semibold">{losses}L</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">
                      {isAllyMode
                        ? isPositive
                          ? "Synergy amplification"
                          : "Sub-par win pairing"
                        : hero.againstWinRate < lifetimeWinRate
                        ? "Dangerous matchup"
                        : "High victory matchup"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
