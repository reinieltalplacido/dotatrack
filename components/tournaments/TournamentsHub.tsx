"use client";

import { useState, useMemo } from "react";
import {
  TournamentSummary,
  TournamentsCatalogPayload,
  TournamentStatus,
  TournamentTier,
} from "@/lib/opendota/tournaments-types";
import { FeaturedTournamentBanner } from "./FeaturedTournamentBanner";
import { LiveProMatchesStrip } from "./LiveProMatchesStrip";
import { TournamentCard } from "./TournamentCard";
import {
  Search,
  X,
  Trophy,
  Radio,
  Clock,
  Swords,
  Layers,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

interface TournamentsHubProps {
  initialData: TournamentsCatalogPayload;
}

type SortOption = "date_desc" | "prize_desc" | "teams_desc" | "name_asc";

export function TournamentsHub({ initialData }: TournamentsHubProps) {
  const { featured, tournaments, liveAndRecentMatches, metrics, source, fetchedAt, isCached } =
    initialData;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | "all">("all");
  const [tierFilter, setTierFilter] = useState<TournamentTier | "all">("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  const formattedFetchTime = useMemo(() => {
    try {
      const d = new Date(fetchedAt);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Live";
    }
  }, [fetchedAt]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTierFilter("all");
    setRegionFilter("all");
    setSortBy("date_desc");
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    tierFilter !== "all" ||
    regionFilter !== "all" ||
    sortBy !== "date_desc";

  // Unique regions
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    tournaments.forEach((t) => {
      if (t.region) set.add(t.region);
    });
    return Array.from(set);
  }, [tournaments]);

  // Filter & Sort Pipeline
  const filteredTournaments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return tournaments
      .filter((t) => {
        // Search
        if (q && !t.name.toLowerCase().includes(q) && !t.organizer.toLowerCase().includes(q)) {
          return false;
        }
        // Status
        if (statusFilter !== "all" && t.status !== statusFilter) {
          return false;
        }
        // Tier
        if (tierFilter !== "all" && t.tier !== tierFilter) {
          return false;
        }
        // Region
        if (regionFilter !== "all" && t.region !== regionFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date_desc":
            return (b.id || 0) - (a.id || 0);
          case "prize_desc":
            return (b.numericPrizePool || 0) - (a.numericPrizePool || 0);
          case "teams_desc":
            return (b.teamsCount || 0) - (a.teamsCount || 0);
          case "name_asc":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [tournaments, searchQuery, statusFilter, tierFilter, regionFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Page Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>ESPORTS CIRCUIT // GLOBAL CHAMPIONSHIPS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              Tournaments
            </h1>
            <p className="text-sm font-mono text-zinc-400 mt-1 max-w-2xl">
              Live esports brackets, premier championships, and competitive match telemetry.
            </p>
          </div>

          {/* Telemetry Status */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm self-start md:self-auto">
            <span>
              Feed: <strong className="text-zinc-200">{source}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Updated: <strong className="text-zinc-200">{formattedFetchTime}</strong>
            </span>
            {isCached && (
              <span className="rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 px-1.5 py-0.2 text-[9px] uppercase">
                Offline Snapshot
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              CIRCUIT_EVENTS
            </span>
            <Layers className="h-4 w-4 text-zinc-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white">
            {metrics.totalTournaments}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">
            Tracked competitive leagues
          </span>
        </div>

        <div className="tactical-panel p-4 rounded-sm border border-rose-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
              LIVE_TOURNAMENTS
            </span>
            <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
            {metrics.liveTournamentsCount}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">
            Currently active on circuit
          </span>
        </div>

        <div className="tactical-panel p-4 rounded-sm border border-amber-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              UPCOMING_EVENTS
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white">
            {metrics.upcomingCount}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">
            Scheduled on tournament calendar
          </span>
        </div>

        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              LIVE_SERIES
            </span>
            <Swords className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {metrics.liveMatchesCount}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">
            Pro matches playing now
          </span>
        </div>
      </div>

      {/* 3. Featured Championship Banner */}
      {featured && <FeaturedTournamentBanner tournament={featured} />}

      {/* 4. Live & Recent Pro Matches Strip */}
      <LiveProMatchesStrip matches={liveAndRecentMatches} />

      {/* 5. Search & Filters Bar */}
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] mb-6 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournament name or organizer (e.g. DreamLeague, Wallachia)..."
              className="w-full rounded-sm bg-black/60 border border-white/[0.1] pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-sm bg-black/60 border border-white/[0.1] px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="date_desc">Start Date (Recent / Active First)</option>
              <option value="prize_desc">Prize Pool (Highest First)</option>
              <option value="teams_desc">Most Participating Teams</option>
              <option value="name_asc">Tournament Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills: Status, Tier, Region */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.04]">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500 mr-1 text-[11px]">Status:</span>
            {(
              [
                { id: "all", label: "All Tournaments" },
                { id: "live", label: "Live", count: metrics.liveTournamentsCount },
                { id: "upcoming", label: "Upcoming", count: metrics.upcomingCount },
                { id: "completed", label: "Completed", count: metrics.completedCount },
              ] as const
            ).map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors ${
                    isActive
                      ? "bg-rose-950/80 text-rose-300 border border-rose-600/70 font-bold"
                      : "bg-black/40 text-zinc-400 hover:text-white border border-white/[0.04]"
                  }`}
                >
                  {tab.id === "live" && <Radio className="h-2 w-2 text-rose-400 animate-pulse" />}
                  <span>{tab.label}</span>
                  {"count" in tab && (
                    <span className="text-[10px] text-zinc-500 font-normal">({tab.count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tier & Region Dropdowns */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Tier */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as TournamentTier | "all")}
              className="rounded-sm bg-black/60 border border-white/[0.1] px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Tiers</option>
              <option value="premium">Premier Tier</option>
              <option value="professional">Professional Tier</option>
            </select>

            {/* Region */}
            {availableRegions.length > 0 && (
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-sm bg-black/60 border border-white/[0.1] px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500 max-w-[150px]"
              >
                <option value="all">All Regions</option>
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            )}

            {/* Reset Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/40 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. Results Count */}
      <div className="flex items-center justify-between mb-4 text-xs font-mono text-zinc-400">
        <span>
          Showing <strong className="text-white">{filteredTournaments.length}</strong> of{" "}
          <strong className="text-white">{tournaments.length}</strong> championships
        </span>
      </div>

      {/* 7. Tournament Cards Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="text-center py-16 px-4 rounded border border-dashed border-white/[0.1] bg-black/20">
          <SlidersHorizontal className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-mono font-bold text-white mb-1">
            No Tournaments Match Your Filters
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto mb-4">
            No competitive championships found matching &ldquo;{searchQuery}&rdquo; and active status filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-rose-500 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
