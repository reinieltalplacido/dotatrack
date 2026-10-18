"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Brain,
  Sparkles,
  ExternalLink,
  Info,
} from "lucide-react";
import { MetaHeroEntry, PrimaryAttrType, HeroTierCategory } from "@/lib/opendota/meta-types";

interface HeroMetaTierListProps {
  heroes: MetaHeroEntry[];
  selectedBracketName: string;
}

type SortField = "metaScore_desc" | "winRate_desc" | "winRate_asc" | "pickRate_desc" | "picks_desc";

const TIER_COLORS: Record<HeroTierCategory, { badge: string; border: string; bg: string; title: string }> = {
  S: {
    badge: "bg-rose-950/90 text-rose-300 border-rose-600/60",
    border: "border-rose-600/30",
    bg: "bg-rose-950/10",
    title: "S-Tier • Meta Dominant",
  },
  A: {
    badge: "bg-amber-950/90 text-amber-300 border-amber-600/60",
    border: "border-amber-600/30",
    bg: "bg-amber-950/10",
    title: "A-Tier • High Impact",
  },
  B: {
    badge: "bg-emerald-950/90 text-emerald-300 border-emerald-600/60",
    border: "border-emerald-600/30",
    bg: "bg-emerald-950/10",
    title: "B-Tier • Solid & Balanced",
  },
  C: {
    badge: "bg-blue-950/90 text-blue-300 border-blue-600/60",
    border: "border-blue-600/30",
    bg: "bg-blue-950/10",
    title: "C-Tier • Situational Picks",
  },
  D: {
    badge: "bg-zinc-900 text-zinc-400 border-zinc-700/60",
    border: "border-zinc-800",
    bg: "bg-zinc-950/20",
    title: "D-Tier • Underperforming / Niche",
  },
};

export function HeroMetaTierList({ heroes, selectedBracketName }: HeroMetaTierListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<"all" | PrimaryAttrType>("all");
  const [selectedTierFilter, setSelectedTierFilter] = useState<"all" | HeroTierCategory>("all");
  const [sortBy, setSortBy] = useState<SortField>("metaScore_desc");
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Filter and sort heroes
  const filteredHeroes = useMemo(() => {
    let result = heroes.filter((hero) => {
      // Search by hero name
      if (
        searchQuery.trim() &&
        !hero.localized_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ) {
        return false;
      }
      // Attribute filter
      if (selectedAttr !== "all" && hero.primary_attr !== selectedAttr) {
        return false;
      }
      // Tier filter
      if (selectedTierFilter !== "all" && hero.tier !== selectedTierFilter) {
        return false;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "metaScore_desc":
          return b.metaScore - a.metaScore;
        case "winRate_desc":
          return b.winRate - a.winRate;
        case "winRate_asc":
          return a.winRate - b.winRate;
        case "pickRate_desc":
          return b.pickRate - a.pickRate;
        case "picks_desc":
          return b.picks - a.picks;
        default:
          return 0;
      }
    });

    return result;
  }, [heroes, searchQuery, selectedAttr, selectedTierFilter, sortBy]);

  // Group by Tier for categorized view if no specific tier is selected
  const tierGroups = useMemo(() => {
    const groups: Record<HeroTierCategory, MetaHeroEntry[]> = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
    };
    for (const hero of filteredHeroes) {
      if (groups[hero.tier]) {
        groups[hero.tier].push(hero);
      }
    }
    return groups;
  }, [filteredHeroes]);

  const renderAttributeIcon = (attr: PrimaryAttrType) => {
    switch (attr) {
      case "str":
        return (
          <span title="Strength" className="inline-flex items-center">
            <Shield className="h-3 w-3 text-red-400" />
          </span>
        );
      case "agi":
        return (
          <span title="Agility" className="inline-flex items-center">
            <Zap className="h-3 w-3 text-emerald-400" />
          </span>
        );
      case "int":
        return (
          <span title="Intelligence" className="inline-flex items-center">
            <Brain className="h-3 w-3 text-blue-400" />
          </span>
        );
      case "all":
        return (
          <span title="Universal" className="inline-flex items-center">
            <Sparkles className="h-3 w-3 text-purple-400" />
          </span>
        );
    }
  };

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Tier List Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              HERO META TIER LIST
            </h2>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded-sm">
              {selectedBracketName}
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Objectively categorized via Bayesian smoothed win rate and match pick rate.
          </p>
        </div>

        {/* Methodology disclosure toggle */}
        <button
          onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-rose-400 bg-zinc-900/80 border border-white/[0.08] hover:border-rose-500/40 px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-rose-400" />
          <span>Tier Methodology</span>
          {isMethodologyOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Methodology Expandable Panel */}
      {isMethodologyOpen && (
        <div className="mb-6 p-4 rounded-sm bg-black/50 border border-rose-500/30 text-xs font-mono text-zinc-300 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
            <Info className="h-3.5 w-3.5" />
            <span>Mathematical Tier Classification Rule</span>
          </div>

          <p className="leading-relaxed text-zinc-400">
            Tiers are calculated purely from actual match results without subjective opinion or manual assignment.
            To eliminate small-sample-size anomalies (where a hero with 5 games has an 80% win rate), we apply an
            <span className="text-white font-bold"> Empirical Bayes Smoothed Win Rate</span>:
          </p>

          <div className="bg-zinc-950 p-2.5 rounded-sm border border-white/[0.06] text-amber-300 font-mono text-[11px]">
            Bayesian Win Rate = (Wins + 50.0% × C) / (Picks + C)
            <br />
            Meta Score = Bayesian Win Rate + 0.35 × (Pick Rate - Average Pick Rate)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
            <div>
              • <strong className="text-rose-400">S-Tier (Score ≥ 53.5)</strong>: High win-rate staples with robust pick volume.
            </div>
            <div>
              • <strong className="text-amber-400">A-Tier (51.5 ≤ Score &lt; 53.5)</strong>: High impact contenders.
            </div>
            <div>
              • <strong className="text-emerald-400">B-Tier (49.5 ≤ Score &lt; 51.5)</strong>: Balanced, versatile picks.
            </div>
            <div>
              • <strong className="text-blue-400">C-Tier (47.5 ≤ Score &lt; 49.5)</strong>: Situational &amp; draft-dependent.
            </div>
            <div className="sm:col-span-2">
              • <strong className="text-zinc-400">D-Tier (&lt; 47.5 or &lt; 200 matches)</strong>: Low win rate or insufficient sample size.
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 italic pt-1 border-t border-white/[0.04]">
            * Not official Valve rankings. Calculated dynamically from OpenDota match data.
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hero by name..."
            className="w-full bg-zinc-950 border border-white/[0.1] rounded-sm pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Primary Attribute Filter */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-white/[0.1] p-1 rounded-sm">
          {(
            [
              { id: "all", label: "ALL" },
              { id: "str", label: "STR" },
              { id: "agi", label: "AGI" },
              { id: "int", label: "INT" },
              { id: "all", label: "UNI" },
            ] as const
          ).map((item, idx) => (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => setSelectedAttr(item.id as "all" | PrimaryAttrType)}
              className={`flex-1 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer text-center ${
                selectedAttr === item.id
                  ? "bg-rose-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-white/[0.1] p-1 rounded-sm">
          {(["all", "S", "A", "B", "C", "D"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTierFilter(t as "all" | HeroTierCategory)}
              className={`flex-1 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer text-center font-bold ${
                selectedTierFilter === t
                  ? "bg-zinc-800 text-white border border-white/[0.2]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "all" ? "TIERS" : t}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="w-full bg-zinc-950 border border-white/[0.1] rounded-sm px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
          >
            <option value="metaScore_desc">Sort: Highest Meta Score</option>
            <option value="winRate_desc">Sort: Highest Win Rate</option>
            <option value="winRate_asc">Sort: Lowest Win Rate</option>
            <option value="pickRate_desc">Sort: Highest Pick Rate</option>
            <option value="picks_desc">Sort: Most Matches</option>
          </select>
        </div>
      </div>

      {/* Hero Table / Tier Cards */}
      {filteredHeroes.length === 0 ? (
        <div className="text-center py-12 border border-white/[0.04] rounded-sm bg-black/20">
          <p className="text-xs font-mono text-zinc-500">
            No heroes match your selected filter criteria.
          </p>
        </div>
      ) : selectedTierFilter === "all" && sortBy === "metaScore_desc" && !searchQuery && selectedAttr === "all" ? (
        /* Grouped Tier Categorization View */
        <div className="space-y-6">
          {(["S", "A", "B", "C", "D"] as HeroTierCategory[]).map((tierKey) => {
            const heroesInTier = tierGroups[tierKey];
            if (heroesInTier.length === 0) return null;
            const style = TIER_COLORS[tierKey];

            return (
              <div key={tierKey} className="space-y-2">
                {/* Tier Title Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-mono font-black rounded-sm border ${style.badge}`}
                    >
                      {tierKey}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      {style.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {heroesInTier.length} Heroes
                  </span>
                </div>

                {/* Hero Cards Grid for this tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {heroesInTier.map((hero) => (
                    <HeroTierCard key={hero.id} hero={hero} renderAttributeIcon={renderAttributeIcon} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filtered List / Sorted View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredHeroes.map((hero) => (
            <HeroTierCard key={hero.id} hero={hero} renderAttributeIcon={renderAttributeIcon} />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroTierCard({
  hero,
  renderAttributeIcon,
}: {
  hero: MetaHeroEntry;
  renderAttributeIcon: (attr: PrimaryAttrType) => React.ReactNode;
}) {
  const isPositiveDelta = hero.winRateDelta !== null && hero.winRateDelta > 0;
  const isNegativeDelta = hero.winRateDelta !== null && hero.winRateDelta < 0;

  return (
    <div className="group p-3 rounded-sm bg-zinc-950/70 border border-white/[0.08] hover:border-rose-500/50 hover:bg-zinc-900/50 transition-all flex items-center justify-between gap-3">
      {/* Hero Avatar & Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative w-11 h-11 rounded-sm overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
          <Image
            src={hero.img}
            alt={hero.localized_name}
            fill
            sizes="44px"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-mono font-bold text-white truncate group-hover:text-rose-400 transition-colors">
              {hero.localized_name}
            </span>
            {renderAttributeIcon(hero.primary_attr)}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span>{hero.picks.toLocaleString()} picks</span>
            <span>•</span>
            <span>{hero.pickRate.toFixed(1)}% PR</span>
          </div>
        </div>
      </div>

      {/* Stats & Tier Badge */}
      <div className="text-right shrink-0">
        <div className="flex items-center justify-end gap-1.5 mb-0.5">
          <span
            className={`text-xs font-mono font-black ${
              hero.winRate >= 50.0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {hero.winRate.toFixed(1)}%
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs ${
              hero.tier === "S"
                ? "bg-rose-950 text-rose-300 border border-rose-700/60"
                : hero.tier === "A"
                ? "bg-amber-950 text-amber-300 border border-amber-700/60"
                : hero.tier === "B"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                : "bg-zinc-800 text-zinc-300 border border-zinc-700/60"
            }`}
          >
            {hero.tier}
          </span>
        </div>

        {/* Win Rate Delta if recorded */}
        <div className="text-[10px] font-mono">
          {hero.winRateDelta !== null ? (
            <span
              className={
                isPositiveDelta
                  ? "text-emerald-400"
                  : isNegativeDelta
                  ? "text-rose-400"
                  : "text-zinc-500"
              }
            >
              {isPositiveDelta ? `+${hero.winRateDelta.toFixed(1)}%` : `${hero.winRateDelta.toFixed(1)}%`}
            </span>
          ) : (
            <span className="text-zinc-600">Stable</span>
          )}
        </div>
      </div>
    </div>
  );
}
