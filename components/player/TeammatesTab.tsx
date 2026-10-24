"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Trophy,
  Swords,
  Clock,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  Zap,
  Shield,
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PlayerDashboardData, EnrichedTeammate } from "@/lib/opendota/types";

interface TeammatesTabProps {
  data: PlayerDashboardData;
  onTeammatesLoaded?: (count: number) => void;
}

type MinGamesFilter = 1 | 3 | 5 | 10 | 25;
type SortOption = "matches" | "winRate" | "synergy" | "recent" | "rival";

export function TeammatesTab({ data, onTeammatesLoaded }: TeammatesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [minGames, setMinGames] = useState<MinGamesFilter>(1);
  const [sortBy, setSortBy] = useState<SortOption>("matches");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const hasPropPeers = Boolean(data.peers && data.peers.length > 0);

  // Client-side fallback fetch in case peers weren't in props (e.g. cached payload)
  const [fallbackPeers, setFallbackPeers] = useState<EnrichedTeammate[] | null>(null);
  const [isLoadingFallback, setIsLoadingFallback] = useState(!hasPropPeers);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  const peers = hasPropPeers ? (data.peers || null) : fallbackPeers;

  const [prevAccountId, setPrevAccountId] = useState(data.accountId);
  if (data.accountId !== prevAccountId) {
    setPrevAccountId(data.accountId);
    setIsLoadingFallback(!hasPropPeers);
    setFallbackError(null);
  }

  useEffect(() => {
    if (hasPropPeers) {
      if (data.peers) {
        onTeammatesLoaded?.(data.peers.length);
      }
      return;
    }

    let isCancelled = false;

    fetch(`/api/players/${data.accountId}/peers`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load teammate statistics");
        return res.json();
      })
      .then((json) => {
        if (!isCancelled) {
          const list: EnrichedTeammate[] = json.peers || [];
          setFallbackPeers(list);
          onTeammatesLoaded?.(list.length);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setFallbackError(err?.message || "Failed to load teammates");
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingFallback(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [data.accountId, hasPropPeers, data.peers, onTeammatesLoaded]);

  const lifetimeWinRate = data.lifetime?.winRate ?? 50.0;

  // Copy Account ID handler
  const handleCopyId = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Top KPI highlights
  const highlights = useMemo(() => {
    if (!peers || peers.length === 0) {
      return { topDuo: null, bestSynergy: null, topRival: null, totalTeammateGames: 0 };
    }

    // Top Duo: player with the most games played together
    const sortedByGames = [...peers].sort((a, b) => b.withGames - a.withGames);
    const topDuo = sortedByGames[0]?.withGames > 0 ? sortedByGames[0] : null;

    // Best Synergy: teammate with highest winrate advantage (minimum 5 games)
    const qualifiedSynergy = peers.filter((p) => p.withGames >= 5);
    const bestSynergy =
      qualifiedSynergy.length > 0
        ? [...qualifiedSynergy].sort((a, b) => b.synergyAdvantage - a.synergyAdvantage)[0]
        : null;

    // Top Rival: player encountered on opposing team most times
    const rivals = peers.filter((p) => p.againstGames > 0);
    const topRival =
      rivals.length > 0
        ? [...rivals].sort((a, b) => b.againstGames - a.againstGames)[0]
        : null;

    const totalTeammateGames = peers.reduce((acc, p) => acc + p.withGames, 0);

    return { topDuo, bestSynergy, topRival, totalTeammateGames };
  }, [peers]);

  // Filtered and Sorted list
  const filteredPeers = useMemo(() => {
    if (!peers) return [];

    return peers
      .filter((peer) => {
        // Minimum games filter
        if (peer.withGames < minGames) return false;

        // Search query filter (matches persona name or account ID)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = peer.personaName.toLowerCase().includes(q);
          const matchesId = peer.accountId.toString().includes(q);
          if (!matchesName && !matchesId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "winRate":
            return b.withWinRate - a.withWinRate || b.withGames - a.withGames;
          case "synergy":
            return b.synergyAdvantage - a.synergyAdvantage || b.withGames - a.withGames;
          case "recent":
            return (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0);
          case "rival":
            return b.againstGames - a.againstGames || b.withGames - a.withGames;
          case "matches":
          default:
            return b.withGames - a.withGames || b.withWinRate - a.withWinRate;
        }
      });
  }, [peers, minGames, searchQuery, sortBy]);

  // Loading State
  if (isLoadingFallback) {
    return (
      <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] bg-[#0A0C13]">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/40 border border-rose-500/20 text-rose-400 mb-4 animate-spin">
          <Loader2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider mb-2">
          Loading Teammates...
        </h3>
        <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
          Finding party members, duo stats, and teammate win rates...
        </p>
      </div>
    );
  }

  // Error State
  if (fallbackError && (!peers || peers.length === 0)) {
    return (
      <div className="tactical-panel p-8 text-center rounded-sm border border-red-900/40 bg-red-950/20">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-900/40 text-red-400 mb-3">
          <Shield className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-mono font-bold text-white uppercase mb-2">
          Unable to Load Teammates
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-4">{fallbackError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-mono font-bold uppercase transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Sync</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Spotlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Top Duo Partner */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              TOP DUO PARTNER
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">MOST GAMES</span>
          </div>

          {highlights.topDuo ? (
            <Link
              href={`/player/${highlights.topDuo.accountId}`}
              className="group flex items-center gap-3 pt-1"
            >
              <div className="relative h-11 w-11 rounded-sm overflow-hidden border border-white/[0.15] bg-zinc-900 shrink-0 group-hover:border-rose-500 transition-colors">
                <Image
                  src={highlights.topDuo.avatarUrl}
                  alt={highlights.topDuo.personaName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-mono font-bold text-white truncate group-hover:text-rose-400 transition-colors flex items-center gap-1">
                  <span className="truncate">{highlights.topDuo.personaName}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-rose-400 font-bold">
                    {highlights.topDuo.withGames} matches
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span
                    className={
                      highlights.topDuo.withWinRate >= 50
                        ? "text-emerald-400"
                        : "text-zinc-400"
                    }
                  >
                    {highlights.topDuo.withWinRate}% WR
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-xs font-mono text-zinc-500 py-3">No recorded teammates</div>
          )}
        </div>

        {/* Highest Synergy Partner */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              PEAK SYNERGY
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">MIN 5 MATCHES</span>
          </div>

          {highlights.bestSynergy ? (
            <Link
              href={`/player/${highlights.bestSynergy.accountId}`}
              className="group flex items-center gap-3 pt-1"
            >
              <div className="relative h-11 w-11 rounded-sm overflow-hidden border border-white/[0.15] bg-zinc-900 shrink-0 group-hover:border-emerald-500 transition-colors">
                <Image
                  src={highlights.bestSynergy.avatarUrl}
                  alt={highlights.bestSynergy.personaName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-mono font-bold text-white truncate group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span className="truncate">{highlights.bestSynergy.personaName}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-emerald-400 font-bold">
                    {highlights.bestSynergy.withWinRate}% WR
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-emerald-300">
                    +{highlights.bestSynergy.synergyAdvantage}% vs Solo
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-xs font-mono text-zinc-500 py-3">Need 5+ games with teammate</div>
          )}
        </div>

        {/* Top Rival (Opponent) */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Swords className="h-3.5 w-3.5 text-red-400" />
              FREQUENT RIVAL
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">OPPOSING TEAM</span>
          </div>

          {highlights.topRival ? (
            <Link
              href={`/player/${highlights.topRival.accountId}`}
              className="group flex items-center gap-3 pt-1"
            >
              <div className="relative h-11 w-11 rounded-sm overflow-hidden border border-white/[0.15] bg-zinc-900 shrink-0 group-hover:border-red-500 transition-colors">
                <Image
                  src={highlights.topRival.avatarUrl}
                  alt={highlights.topRival.personaName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-mono font-bold text-white truncate group-hover:text-red-400 transition-colors flex items-center gap-1">
                  <span className="truncate">{highlights.topRival.personaName}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-red-400 font-bold">
                    {highlights.topRival.againstGames} encounters
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300">
                    {highlights.topRival.againstWin}W - {highlights.topRival.againstLoss}L
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-xs font-mono text-zinc-500 py-3">No frequent rivals recorded</div>
          )}
        </div>

        {/* Stack Roster Count */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
              TRACKED PEERS
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">TOTAL ROSTER</span>
          </div>

          <div className="pt-1">
            <div className="text-2xl font-mono font-black text-white">
              {peers ? peers.length : 0}
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-0.5">
              Across recorded public matches
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#0A0C13]">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:max-w-md min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search teammate by name or Steam ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/[0.1] rounded-sm text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors min-h-[38px] sm:min-h-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Min Matches Filter */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-sm border border-white/[0.06] overflow-x-auto no-scrollbar max-w-full">
              <span className="text-[11px] font-mono text-zinc-400 px-2 shrink-0">Min Matches:</span>
              {([1, 3, 5, 10, 25] as MinGamesFilter[]).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMinGames(val)}
                  className={`px-2.5 py-1.5 sm:py-1 min-h-[34px] sm:min-h-0 text-[11px] font-mono font-bold rounded-sm transition-all shrink-0 ${
                    minGames === val
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {val === 1 ? "All" : `${val}+`}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-sm border border-white/[0.06]">
              <span className="text-[11px] font-mono text-zinc-400 px-2 shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-mono text-white border-0 focus:outline-none focus:ring-0 cursor-pointer pr-3 min-h-[34px] sm:min-h-0"
              >
                <option value="matches" className="bg-[#0E1017] text-white">
                  Most Matches Together
                </option>
                <option value="winRate" className="bg-[#0E1017] text-white">
                  Highest Win Rate
                </option>
                <option value="synergy" className="bg-[#0E1017] text-white">
                  Highest Synergy (+WR)
                </option>
                <option value="recent" className="bg-[#0E1017] text-white">
                  Recently Played
                </option>
                <option value="rival" className="bg-[#0E1017] text-white">
                  Most Matches Against
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>
          Showing <span className="text-white font-bold">{filteredPeers.length}</span>{" "}
          {filteredPeers.length === 1 ? "teammate" : "teammates"}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <span className="text-zinc-500">
          Lifetime Benchmark:{" "}
          <strong className="text-zinc-300">{lifetimeWinRate}%</strong>
        </span>
      </div>

      {/* Teammates Grid */}
      {filteredPeers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filteredPeers.map((teammate, idx) => {
              const isPositiveSynergy = teammate.synergyAdvantage > 0;
              const isNegativeSynergy = teammate.synergyAdvantage < 0;

              return (
                <motion.div
                  key={teammate.accountId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
                  className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/[0.2] bg-[#0A0C13] transition-all flex flex-col justify-between group"
                >
                  {/* Top Bar: Avatar, Name, ID */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Link
                        href={`/player/${teammate.accountId}`}
                        className="flex items-center gap-3 min-w-0 flex-1 group/player"
                      >
                        <div className="relative h-12 w-12 rounded-sm overflow-hidden border border-white/[0.12] bg-zinc-900 shrink-0 group-hover/player:border-rose-500 transition-colors">
                          <Image
                            src={teammate.avatarUrl}
                            alt={teammate.personaName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-mono font-bold text-white truncate group-hover/player:text-rose-400 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{teammate.personaName}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover/player:opacity-100 transition-opacity text-rose-400 shrink-0" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono text-zinc-400">
                              ID: {teammate.accountId}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyId(e, teammate.accountId)}
                              title="Copy Account ID"
                              className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
                            >
                              {copiedId === teammate.accountId ? (
                                <Check className="h-2.5 w-2.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-2.5 w-2.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </Link>

                      {/* Synergy Badge */}
                      <div className="shrink-0 text-right">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            isPositiveSynergy
                              ? "bg-emerald-950/80 border border-emerald-800/60 text-emerald-300"
                              : isNegativeSynergy
                              ? "bg-rose-950/80 border border-rose-800/60 text-rose-300"
                              : "bg-white/[0.05] border border-white/[0.1] text-zinc-400"
                          }`}
                          title={`Win rate with this teammate vs player's ${lifetimeWinRate}% lifetime win rate`}
                        >
                          {isPositiveSynergy && <TrendingUp className="h-3 w-3" />}
                          {isNegativeSynergy && <TrendingDown className="h-3 w-3" />}
                          <span>
                            {isPositiveSynergy ? "+" : ""}
                            {teammate.synergyAdvantage}%
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                          Synergy
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (Wins vs Losses as teammates) */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">
                          {teammate.withGames}{" "}
                          <span className="text-zinc-400 font-normal">
                            {teammate.withGames === 1 ? "match together" : "matches together"}
                          </span>
                        </span>
                        <span
                          className={`font-bold ${
                            teammate.withWinRate >= 50
                              ? "text-emerald-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {teammate.withWinRate}% WR
                        </span>
                      </div>

                      {/* Visual segmented bar */}
                      <div className="h-2 w-full rounded-sm bg-black/60 overflow-hidden flex border border-white/[0.05]">
                        <div
                          className="bg-emerald-500 h-full transition-all"
                          style={{ width: `${teammate.withWinRate}%` }}
                          title={`${teammate.withWin} Wins`}
                        />
                        <div
                          className="bg-rose-600 h-full transition-all"
                          style={{ width: `${100 - teammate.withWinRate}%` }}
                          title={`${teammate.withLoss} Losses`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                        <span className="text-emerald-400/90">
                          {teammate.withWin} WINS
                        </span>
                        <span className="text-rose-400/90">
                          {teammate.withLoss} LOSSES
                        </span>
                      </div>
                    </div>

                    {/* Stats Strip (Opponent records & Averages) */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono mb-3">
                      {/* Head-to-head as rivals */}
                      <div className="bg-black/30 p-2 rounded-sm border border-white/[0.04]">
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Swords className="h-3 w-3 text-zinc-400" />
                          <span>AGAINST (RIVAL)</span>
                        </div>
                        <div className="text-zinc-200 font-bold mt-0.5">
                          {teammate.againstGames > 0 ? (
                            <span>
                              {teammate.againstWin}W - {teammate.againstLoss}L{" "}
                              <span className="text-zinc-500 font-normal text-[10px]">
                                ({teammate.againstWinRate}%)
                              </span>
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-normal">None</span>
                          )}
                        </div>
                      </div>

                      {/* Average GPM / XPM if available */}
                      <div className="bg-black/30 p-2 rounded-sm border border-white/[0.04]">
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-400" />
                          <span>AVG GPM / XPM</span>
                        </div>
                        <div className="text-zinc-200 font-bold mt-0.5">
                          {teammate.withAvgGpm && teammate.withAvgXpm ? (
                            <span>
                              {teammate.withAvgGpm} / {teammate.withAvgXpm}
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-normal">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Last Played & Link Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>{teammate.lastPlayedFormatted}</span>
                    </div>

                    <Link
                      href={`/player/${teammate.accountId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <span>Track Player</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] bg-[#0A0C13]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-400 mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
            No Teammates Found
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No teammates match your filter "${searchQuery}". Try lowering the minimum matches requirement or searching by ID.`
              : "This player doesn't have any recorded teammates for these filters."}
          </p>
          {(searchQuery || minGames > 1) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setMinGames(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded text-xs font-mono uppercase transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
