"use client";

import { useState, useMemo } from "react";
import NextImage from "next/image";
import {
  HeroCompendiumPayload,
} from "@/lib/opendota/hero-types";
import { HeroStatsOverview } from "./HeroStatsOverview";
import { HeroCard } from "./HeroCard";
import { HeroDetailDrawer } from "./HeroDetailDrawer";
import { HeroMatrixComparison } from "./HeroMatrixComparison";
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  Crosshair,
  Shield,
  Zap,
  Brain,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

type AttrFilter = "any" | "str" | "agi" | "int" | "all";

interface HeroCompendiumProps {
  initialData: HeroCompendiumPayload;
}

type SortOption =
  | "winRate_desc"
  | "winRate_asc"
  | "pickRate_desc"
  | "matches_desc"
  | "name_asc"
  | "name_desc"
  | "proWinRate_desc";

const ROLES_LIST = [
  "Carry",
  "Support",
  "Nuker",
  "Disabler",
  "Initiator",
  "Durable",
  "Escape",
  "Pusher",
];

export function HeroCompendium({ initialData }: HeroCompendiumProps) {
  const { heroes, metrics, isCached, fetchedAt } = initialData;

  // View Mode: Grid Explorer vs Analytics Matrix
  const [viewMode, setViewMode] = useState<"grid" | "matrix">("grid");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<AttrFilter>("any");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedAttackType, setSelectedAttackType] = useState<"all" | "Melee" | "Ranged">("all");
  const [sortBy, setSortBy] = useState<SortOption>("winRate_desc");

  // Detailed Drawer & Selection State
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [comparedHeroIds, setComparedHeroIds] = useState<number[]>([]);

  // Format relative time of fetch
  const formattedFetchTime = useMemo(() => {
    try {
      const date = new Date(fetchedAt);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  }, [fetchedAt]);

  // Toggle hero in comparison list (max 4)
  const handleToggleCompare = (heroId: number) => {
    setComparedHeroIds((prev) => {
      if (prev.includes(heroId)) {
        return prev.filter((id) => id !== heroId);
      }
      if (prev.length >= 4) {
        // Replace oldest or keep max 4
        return [...prev.slice(1), heroId];
      }
      return [...prev, heroId];
    });
  };

  const handleClearCompare = () => {
    setComparedHeroIds([]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedAttr("any");
    setSelectedRole("all");
    setSelectedAttackType("all");
    setSortBy("winRate_desc");
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedAttr !== "any" ||
    selectedRole !== "all" ||
    selectedAttackType !== "all" ||
    sortBy !== "winRate_desc";

  // Filter & Sort Pipeline
  const filteredHeroes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return heroes
      .filter((hero) => {
        // Name search
        if (q && !hero.localized_name.toLowerCase().includes(q)) {
          return false;
        }
        // Primary attribute
        if (selectedAttr !== "any" && hero.primary_attr !== selectedAttr) {
          return false;
        }
        // Role
        if (selectedRole !== "all" && !hero.roles.includes(selectedRole)) {
          return false;
        }
        // Attack type
        if (selectedAttackType !== "all" && hero.attack_type !== selectedAttackType) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "winRate_desc":
            return b.winRate - a.winRate;
          case "winRate_asc":
            return a.winRate - b.winRate;
          case "pickRate_desc":
            return b.pickRate - a.pickRate;
          case "matches_desc":
            return b.pub_pick - a.pub_pick;
          case "name_asc":
            return a.localized_name.localeCompare(b.localized_name);
          case "name_desc":
            return b.localized_name.localeCompare(a.localized_name);
          case "proWinRate_desc":
            return b.proWinRate - a.proWinRate;
          default:
            return b.winRate - a.winRate;
        }
      });
  }, [heroes, searchQuery, selectedAttr, selectedRole, selectedAttackType, sortBy]);

  const selectedHero = useMemo(
    () => heroes.find((h) => h.id === selectedHeroId) || null,
    [heroes, selectedHeroId]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Page Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>HERO DIRECTORY // LIVE STATS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              Hero Compendium
            </h1>
            <p className="text-sm font-mono text-zinc-400 mt-1 max-w-2xl">
              Explore heroes, analyze performance, and discover the current meta.
            </p>
          </div>

          {/* Telemetry Source Tag */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm self-start md:self-auto">
            <span>
              Source: <strong className="text-zinc-200">{metrics.source}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Updated: <strong className="text-zinc-200">{formattedFetchTime}</strong>
            </span>
            {isCached && (
              <span className="rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 px-1.5 py-0.2 text-[9px] uppercase">
                Offline Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Statistics Overview Summary Cards */}
      <HeroStatsOverview
        metrics={metrics}
        onSelectHero={(id) => {
          setSelectedHeroId(id);
        }}
      />

      {/* 3. Navigation View Mode Switcher */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-sm transition-all ${
              viewMode === "grid"
                ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
                : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07]"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Hero Explorer Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("matrix")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-sm transition-all ${
              viewMode === "matrix"
                ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
                : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07]"
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>Matrix &amp; Comparison ({comparedHeroIds.length})</span>
          </button>
        </div>

        {/* Selected Counter */}
        <div className="hidden sm:block text-xs font-mono text-zinc-400">
          Showing <strong className="text-white">{filteredHeroes.length}</strong> of{" "}
          <strong className="text-white">{heroes.length}</strong> heroes
        </div>
      </div>

      {/* VIEW 1: HERO EXPLORER GRID */}
      {viewMode === "grid" ? (
        <div className="space-y-6">
          {/* Controls Bar: Search, Filters, Sorting */}
          <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] space-y-3.5">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Hero Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by hero name (e.g. Pudge, Anti-Mage)..."
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

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-sm bg-black/60 border border-white/[0.1] px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="winRate_desc">Highest Win Rate (Meta Peak)</option>
                  <option value="winRate_asc">Lowest Win Rate</option>
                  <option value="pickRate_desc">Highest Pick Rate</option>
                  <option value="matches_desc">Most Matches Played</option>
                  <option value="proWinRate_desc">Highest Pro Win Rate</option>
                  <option value="name_asc">Hero Name (A - Z)</option>
                  <option value="name_desc">Hero Name (Z - A)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills: Attribute, Role, Attack Type */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.04]">
              {/* Primary Attributes */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-zinc-500 mr-1 text-[11px]">Attribute:</span>
                {[
                  { id: "any" as const, label: "All", icon: null, color: "" },
                  { id: "str" as const, label: "STR", icon: Shield, color: "text-red-400" },
                  { id: "agi" as const, label: "AGI", icon: Zap, color: "text-emerald-400" },
                  { id: "int" as const, label: "INT", icon: Brain, color: "text-sky-400" },
                  { id: "all" as const, label: "UNI", icon: Sparkles, color: "text-amber-400" },
                ].map((attr) => {
                  const Icon = attr.icon;
                  const isCurrent = selectedAttr === attr.id;
                  return (
                    <button
                      key={attr.label}
                      type="button"
                      onClick={() => setSelectedAttr(attr.id)}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${
                        isCurrent
                          ? "bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold"
                          : "bg-black/40 text-zinc-400 hover:text-white border border-white/[0.04]"
                      }`}
                    >
                      {Icon && <Icon className={`h-3 w-3 ${attr.color}`} />}
                      <span>{attr.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Roles Selector */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-sm bg-black/60 border border-white/[0.1] px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Roles</option>
                  {ROLES_LIST.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                {/* Attack Type */}
                <select
                  value={selectedAttackType}
                  onChange={(e) =>
                    setSelectedAttackType(e.target.value as "all" | "Melee" | "Ranged")
                  }
                  className="rounded-sm bg-black/60 border border-white/[0.1] px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Ranges</option>
                  <option value="Melee">Melee</option>
                  <option value="Ranged">Ranged</option>
                </select>

                {/* Clear Filter Action */}
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

          {/* Heroes Grid */}
          {filteredHeroes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded border border-dashed border-white/[0.1] bg-black/20">
              <SlidersHorizontal className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-mono font-bold text-white mb-1">
                No Heroes Match Filters
              </h3>
              <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto mb-4">
                No heroes found matching your search term &ldquo;{searchQuery}&rdquo; and active attribute filters.
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredHeroes.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  isSelected={selectedHeroId === hero.id}
                  isCompared={comparedHeroIds.includes(hero.id)}
                  onSelect={(id) => setSelectedHeroId(id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: HERO MATRIX ANALYTICS */
        <HeroMatrixComparison
          heroes={heroes}
          comparedIds={comparedHeroIds}
          onToggleCompare={handleToggleCompare}
          onClearCompare={handleClearCompare}
          onSelectHero={(id) => setSelectedHeroId(id)}
        />
      )}

      {/* Floating Compare Action Bar (appears when 1+ heroes are selected for comparison) */}
      {comparedHeroIds.length > 0 && viewMode === "grid" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0E1019]/95 backdrop-blur-md border border-rose-500/50 rounded-sm p-3 shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-300 font-semibold">
              Comparing ({comparedHeroIds.length} / 4):
            </span>
            <div className="flex items-center -space-x-2">
              {comparedHeroIds.map((id) => {
                const h = heroes.find((hero) => hero.id === id);
                if (!h) return null;
                return (
                  <div
                    key={id}
                    title={h.localized_name}
                    className="relative h-8 w-11 rounded-sm overflow-hidden border-2 border-black bg-zinc-900"
                  >
                    <NextImage
                      src={h.img}
                      alt={h.localized_name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3.5 py-1.5 text-xs font-mono font-bold text-white hover:bg-rose-500 shadow-md transition-colors"
            >
              <span>View Head-to-Head &rarr;</span>
            </button>

            <button
              type="button"
              onClick={handleClearCompare}
              className="p-1.5 text-zinc-400 hover:text-white"
              title="Clear comparison list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Detail Inspector Slide-Out Drawer */}
      {selectedHero && (
        <HeroDetailDrawer
          hero={selectedHero}
          onClose={() => setSelectedHeroId(null)}
          onSelectHero={(id) => setSelectedHeroId(id)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedHeroIds.includes(selectedHero.id)}
        />
      )}
    </div>
  );
}
