"use client";

import { useState, useMemo } from "react";
import NextImage from "next/image";
import {
  HeroCompendiumPayload,
  EnrichedHeroSummary,
} from "@/lib/opendota/hero-types";
import { HeroStatsOverview } from "./HeroStatsOverview";
import { HeroCard } from "./HeroCard";
import { HeroDetailDrawer } from "./HeroDetailDrawer";
import { HeroMatrixComparison } from "./HeroMatrixComparison";
import { getHeroLoreById } from "@/lib/opendota/hero-lore-names";
import {
  Search,
  X,
  LayoutGrid,
  Crosshair,
  Shield,
  Zap,
  Brain,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
  Plus,
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

  // View Mode: Classic Tavern Grid (default) vs Ranked Meta Cards vs Analytics Matrix
  const [viewMode, setViewMode] = useState<"classic" | "grid" | "matrix">("classic");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<AttrFilter>("any");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedAttackType, setSelectedAttackType] = useState<"all" | "Melee" | "Ranged">("all");
  const [selectedFaction, setSelectedFaction] = useState<"all" | "radiant" | "dire">("all");
  const [sortBy, setSortBy] = useState<SortOption>("winRate_desc");

  // Detailed Drawer & Selection State
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [comparedHeroIds, setComparedHeroIds] = useState<number[]>([]);
  const [hoveredHeroId, setHoveredHeroId] = useState<number | null>(null);

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
    setSelectedFaction("all");
    setSortBy("winRate_desc");
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedAttr !== "any" ||
    selectedRole !== "all" ||
    selectedAttackType !== "all" ||
    selectedFaction !== "all" ||
    sortBy !== "winRate_desc";

  // Filter & Sort Pipeline
  const filteredHeroes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return heroes
      .filter((hero) => {
        const lore = getHeroLoreById(hero.id);

        // Search matches localized name, real lore name, or shortName
        if (q) {
          const matchLocalized = hero.localized_name.toLowerCase().includes(q);
          const matchReal = lore?.realName.toLowerCase().includes(q) ?? false;
          const matchShort = hero.name.toLowerCase().includes(q);
          if (!matchLocalized && !matchReal && !matchShort) {
            return false;
          }
        }

        // Faction filter
        if (selectedFaction !== "all" && lore && lore.faction !== selectedFaction) {
          return false;
        }

        // Primary attribute
        if (selectedAttr !== "any") {
          // If classic tavern mode, also accept classicAttr mapping
          if (viewMode === "classic") {
            if (selectedAttr === "str" && lore?.classicAttr !== "str" && hero.primary_attr !== "str") return false;
            if (selectedAttr === "agi" && lore?.classicAttr !== "agi" && hero.primary_attr !== "agi") return false;
            if (selectedAttr === "int" && lore?.classicAttr !== "int" && hero.primary_attr !== "int") return false;
            if (selectedAttr === "all" && hero.primary_attr !== "all") return false;
          } else {
            if (hero.primary_attr !== selectedAttr) return false;
          }
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
  }, [heroes, searchQuery, selectedAttr, selectedRole, selectedAttackType, selectedFaction, sortBy, viewMode]);

  const selectedHero = useMemo(
    () => heroes.find((h) => h.id === selectedHeroId) || null,
    [heroes, selectedHeroId]
  );

  // Groupings for Classic Tavern View
  const strengthRadiant = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "str" || (!lore && h.primary_attr === "str")) && lore?.faction === "radiant";
    });
  }, [filteredHeroes]);

  const strengthDire = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "str" || (!lore && h.primary_attr === "str")) && lore?.faction === "dire";
    });
  }, [filteredHeroes]);

  const agilityRadiant = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "agi" || (!lore && h.primary_attr === "agi")) && lore?.faction === "radiant";
    });
  }, [filteredHeroes]);

  const agilityDire = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "agi" || (!lore && h.primary_attr === "agi")) && lore?.faction === "dire";
    });
  }, [filteredHeroes]);

  const intelligenceRadiant = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "int" || (!lore && h.primary_attr === "int")) && lore?.faction === "radiant";
    });
  }, [filteredHeroes]);

  const intelligenceDire = useMemo(() => {
    return filteredHeroes.filter((h) => {
      const lore = getHeroLoreById(h.id);
      return (lore?.classicAttr === "int" || (!lore && h.primary_attr === "int")) && lore?.faction === "dire";
    });
  }, [filteredHeroes]);

  const universalHeroes = useMemo(() => {
    return filteredHeroes.filter((h) => h.primary_attr === "all");
  }, [filteredHeroes]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Page Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>HERO DIRECTORY // LIVE STATS &amp; REAL NAMES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              Hero Compendium
            </h1>
            <p className="text-sm font-mono text-zinc-400 mt-1 max-w-2xl">
              Explore heroes, canonical DotA lore names, analyze performance, and discover the current meta.
            </p>
          </div>

          {/* Source Tag */}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Classic Tavern Grid (User's requested layout with real names) */}
          <button
            type="button"
            onClick={() => setViewMode("classic")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-sm transition-all ${
              viewMode === "classic"
                ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
                : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07]"
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Classic Tavern Grid &amp; Real Names</span>
          </button>

          {/* Ranked Meta Cards */}
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
            <span>Ranked Meta Cards</span>
          </button>

          {/* Comparison Matrix */}
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
        <div className="text-xs font-mono text-zinc-400">
          Showing <strong className="text-white">{filteredHeroes.length}</strong> of{" "}
          <strong className="text-white">{heroes.length}</strong> heroes
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Sorting */}
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] space-y-3.5 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Hero Input (supports localized name and real lore name) */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hero or real name (e.g. Magina, Furion, Traxex)..."
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

        {/* Filter Pills: Attribute, Role, Attack Type, Faction */}
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

          {/* Roles Selector & Attack Range */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
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

            {/* Faction Filter */}
            <select
              value={selectedFaction}
              onChange={(e) => setSelectedFaction(e.target.value as "all" | "radiant" | "dire")}
              className="rounded-sm bg-black/60 border border-white/[0.1] px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Both Factions</option>
              <option value="radiant">Radiant Only</option>
              <option value="dire">Dire Only</option>
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

      {/* ======================================================== */}
      {/* VIEW 1: CLASSIC TAVERN GRID WITH REAL NAMES (DEFAULT)    */}
      {/* ======================================================== */}
      {viewMode === "classic" && (
        <div className="space-y-12">
          {/* Empty Search State */}
          {filteredHeroes.length === 0 && (
            <div className="p-12 text-center rounded-sm border border-white/[0.08] bg-[#0E1019] space-y-3">
              <p className="text-sm font-mono text-zinc-400">
                No heroes match query &quot;{searchQuery}&quot;.
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
          )}

          {/* STRENGTH HEROES */}
          {(selectedAttr === "any" || selectedAttr === "str") &&
            (strengthRadiant.length > 0 || strengthDire.length > 0) && (
              <div>
                {/* Glowing Banner Header */}
                <div className="relative py-4 mb-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(217, 95, 24, 0.45) 0%, rgba(154, 52, 18, 0.22) 45%, rgba(9, 10, 15, 0) 80%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3.5">
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-amber-200 drop-shadow-[0_2px_12px_rgba(245,158,11,0.65)]">
                      STRENGTH
                    </span>
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 p-0.5 shadow-[0_0_15px_rgba(234,88,12,0.8)] border border-amber-300/60 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white fill-white/80" />
                    </div>
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-amber-200 drop-shadow-[0_2px_12px_rgba(245,158,11,0.65)]">
                      HEROES
                    </span>
                  </div>
                </div>

                {/* Side-by-Side: Radiant vs Dire */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                  {/* Radiant Strength */}
                  {(selectedFaction === "all" || selectedFaction === "radiant") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-emerald-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          The Radiant
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {strengthRadiant.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {strengthRadiant.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dire Strength */}
                  {(selectedFaction === "all" || selectedFaction === "dire") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-rose-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          The Dire
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {strengthDire.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {strengthDire.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* AGILITY HEROES */}
          {(selectedAttr === "any" || selectedAttr === "agi") &&
            (agilityRadiant.length > 0 || agilityDire.length > 0) && (
              <div>
                {/* Glowing Banner Header */}
                <div className="relative py-4 mb-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(34, 197, 94, 0.45) 0%, rgba(20, 120, 50, 0.22) 45%, rgba(9, 10, 15, 0) 80%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3.5">
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-emerald-200 drop-shadow-[0_2px_12px_rgba(34,197,94,0.65)]">
                      AGILITY
                    </span>
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-green-600 to-teal-800 p-0.5 shadow-[0_0_15px_rgba(34,197,94,0.8)] border border-emerald-300/60 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white fill-white/80" />
                    </div>
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-emerald-200 drop-shadow-[0_2px_12px_rgba(34,197,94,0.65)]">
                      HEROES
                    </span>
                  </div>
                </div>

                {/* Side-by-Side: Radiant vs Dire */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                  {/* Radiant Agility */}
                  {(selectedFaction === "all" || selectedFaction === "radiant") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-emerald-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          The Radiant
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {agilityRadiant.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {agilityRadiant.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dire Agility */}
                  {(selectedFaction === "all" || selectedFaction === "dire") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-rose-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          The Dire
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {agilityDire.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {agilityDire.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* INTELLIGENCE HEROES */}
          {(selectedAttr === "any" || selectedAttr === "int") &&
            (intelligenceRadiant.length > 0 || intelligenceDire.length > 0) && (
              <div>
                {/* Glowing Banner Header */}
                <div className="relative py-4 mb-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(14, 116, 144, 0.22) 45%, rgba(9, 10, 15, 0) 80%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3.5">
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-sky-200 drop-shadow-[0_2px_12px_rgba(56,189,248,0.65)]">
                      INTELLIGENCE
                    </span>
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-800 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.8)] border border-sky-300/60 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white fill-white/80" />
                    </div>
                    <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-sky-200 drop-shadow-[0_2px_12px_rgba(56,189,248,0.65)]">
                      HEROES
                    </span>
                  </div>
                </div>

                {/* Side-by-Side: Radiant vs Dire */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                  {/* Radiant Intelligence */}
                  {(selectedFaction === "all" || selectedFaction === "radiant") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-emerald-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          The Radiant
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {intelligenceRadiant.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {intelligenceRadiant.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dire Intelligence */}
                  {(selectedFaction === "all" || selectedFaction === "dire") && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-rose-900/30 pb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          The Dire
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {intelligenceDire.length} Heroes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
                        {intelligenceDire.map((hero) => (
                          <ClassicHeroTile
                            key={hero.id}
                            hero={hero}
                            isSelected={selectedHeroId === hero.id}
                            isCompared={comparedHeroIds.includes(hero.id)}
                            isHovered={hoveredHeroId === hero.id}
                            onSelect={() => setSelectedHeroId(hero.id)}
                            onToggleCompare={() => handleToggleCompare(hero.id)}
                            onHover={() => setHoveredHeroId(hero.id)}
                            onLeave={() => setHoveredHeroId(null)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* UNIVERSAL HEROES (Patch 7.33+) */}
          {selectedAttr === "all" && (
            <div>
              <div className="relative py-4 mb-6 flex items-center justify-center">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(168, 85, 247, 0.45) 0%, rgba(107, 33, 168, 0.22) 45%, rgba(9, 10, 15, 0) 80%)",
                  }}
                />
                <div className="relative z-10 flex items-center gap-3.5">
                  <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-purple-200 drop-shadow-[0_2px_12px_rgba(168,85,247,0.65)]">
                    UNIVERSAL
                  </span>
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-violet-600 to-indigo-800 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.8)] border border-purple-300/60 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white fill-white/80" />
                  </div>
                  <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] uppercase font-bold text-purple-200 drop-shadow-[0_2px_12px_rgba(168,85,247,0.65)]">
                    HEROES
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {universalHeroes.map((hero) => (
                  <ClassicHeroTile
                    key={hero.id}
                    hero={hero}
                    isSelected={selectedHeroId === hero.id}
                    isCompared={comparedHeroIds.includes(hero.id)}
                    isHovered={hoveredHeroId === hero.id}
                    onSelect={() => setSelectedHeroId(hero.id)}
                    onToggleCompare={() => handleToggleCompare(hero.id)}
                    onHover={() => setHoveredHeroId(hero.id)}
                    onLeave={() => setHoveredHeroId(null)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: RANKED META CARDS                                */}
      {/* ======================================================== */}
      {viewMode === "grid" && (
        <div className="space-y-6">
          {filteredHeroes.length === 0 ? (
            <div className="p-12 text-center rounded-sm border border-white/[0.08] bg-[#0E1019] space-y-3">
              <p className="text-sm font-mono text-zinc-400">
                No heroes match the selected filter criteria.
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
      )}

      {/* ======================================================== */}
      {/* VIEW 3: HERO MATRIX ANALYTICS                           */}
      {/* ======================================================== */}
      {viewMode === "matrix" && (
        <HeroMatrixComparison
          heroes={heroes}
          comparedIds={comparedHeroIds}
          onToggleCompare={handleToggleCompare}
          onClearCompare={handleClearCompare}
          onSelectHero={(id) => setSelectedHeroId(id)}
        />
      )}

      {/* Floating Compare Action Bar (appears when 1+ heroes are selected for comparison) */}
      {comparedHeroIds.length > 0 && viewMode !== "matrix" && (
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
              className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Hero Detail Slide-Out Drawer */}
      <HeroDetailDrawer
        hero={selectedHero}
        onClose={() => setSelectedHeroId(null)}
        onSelectHero={(id) => setSelectedHeroId(id)}
        onToggleCompare={(id) => handleToggleCompare(id)}
        isCompared={selectedHeroId !== null && comparedHeroIds.includes(selectedHeroId)}
      />
    </div>
  );
}

// ========================================================
// Classic Hero Tile for the Tavern Grid View
// ========================================================
interface ClassicHeroTileProps {
  hero: EnrichedHeroSummary;
  isSelected: boolean;
  isCompared: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onToggleCompare: () => void;
  onHover: () => void;
  onLeave: () => void;
}

function ClassicHeroTile({
  hero,
  isSelected,
  isCompared,
  isHovered,
  onSelect,
  onToggleCompare,
  onHover,
  onLeave,
}: ClassicHeroTileProps) {
  const [imgError, setImgError] = useState(false);
  const lore = getHeroLoreById(hero.id);

  const heroImgUrl = imgError
    ? "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png"
    : hero.img;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative block rounded overflow-hidden bg-[#10121A] border transition-all duration-200 select-none cursor-pointer text-left ${
        isSelected
          ? "border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.6)] ring-1 ring-rose-500 scale-[1.04] z-30"
          : isHovered
          ? "border-amber-400/90 shadow-[0_0_14px_rgba(251,191,36,0.4)] scale-[1.04] z-30 ring-1 ring-amber-400/50"
          : "border-white/[0.12] hover:border-white/30"
      }`}
    >
      {/* Hero Portrait Container */}
      <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImgUrl}
          alt={hero.localized_name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />

        {/* Faction color accent bar at very top */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] opacity-75 ${
            lore?.faction === "radiant"
              ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent"
              : "bg-gradient-to-r from-rose-500 via-red-600 to-transparent"
          }`}
        />

        {/* Compare quick toggle badge */}
        <button
          type="button"
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare();
          }}
          className={`absolute top-1 right-1 z-20 h-5 w-5 rounded flex items-center justify-center transition-all ${
            isCompared
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/60"
              : "bg-black/60 text-zinc-400 hover:text-white hover:bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isCompared ? <Check className="h-3 w-3 stroke-[2.5]" /> : <Plus className="h-3 w-3" />}
        </button>

        {/* Hero Name Badge Overlay (Styled matching classic Dota UI) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-3 pb-1 px-1.5 flex flex-col justify-end text-center pointer-events-none">
          {/* Main Hero Name */}
          <span className="text-[11px] sm:text-[11.5px] font-sans font-bold text-[#86d9ff] tracking-tight leading-tight truncate drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)] group-hover:text-white transition-colors">
            {hero.localized_name}
          </span>
          {/* Real Lore Name */}
          <span className="text-[9px] sm:text-[9.5px] font-serif text-[#fbbf24] font-medium tracking-normal leading-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,1)] opacity-95">
            {lore?.realName || hero.localized_name}
          </span>
        </div>
      </div>

      {/* Floating Hover Card on Hover with Extra Telemetry */}
      {isHovered && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none px-2.5 py-1 rounded bg-[#0A0B10]/95 border border-amber-400/60 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
            <span className="font-bold text-white">{hero.localized_name}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-300 italic font-serif">&quot;{lore?.realName || ""}&quot;</span>
            <span className="text-zinc-500">•</span>
            <span className="text-[9px] text-emerald-400">{hero.winRate.toFixed(1)}% WR</span>
          </div>
        </div>
      )}
    </div>
  );
}
