"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Sparkles, Shield, Zap, Brain, ArrowRight, BookOpen } from "lucide-react";
import { HERO_LORE_DATABASE, HeroLoreEntry } from "@/lib/opendota/hero-lore-names";

type AttributeFilter = "all" | "str" | "agi" | "int" | "uni";

export function HeroesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<AttributeFilter>("all");
  const [hoveredHeroId, setHoveredHeroId] = useState<number | null>(null);

  // Filtered heroes based on search and attribute filter
  const filteredHeroes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HERO_LORE_DATABASE.filter((hero) => {
      // Search matches name, realName, or shortName
      if (q) {
        const matchesQuery =
          hero.name.toLowerCase().includes(q) ||
          hero.realName.toLowerCase().includes(q) ||
          hero.shortName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Attribute filter
      if (selectedAttr === "str" && hero.classicAttr !== "str") return false;
      if (selectedAttr === "agi" && hero.classicAttr !== "agi") return false;
      if (selectedAttr === "int" && hero.classicAttr !== "int") return false;
      if (selectedAttr === "uni" && hero.modernAttr !== "all") return false;

      return true;
    });
  }, [searchQuery, selectedAttr]);

  // Group heroes directly by attribute (Unified Roster without Radiant/Dire split)
  const strengthHeroes = useMemo(
    () => filteredHeroes.filter((h) => h.classicAttr === "str"),
    [filteredHeroes]
  );
  const agilityHeroes = useMemo(
    () => filteredHeroes.filter((h) => h.classicAttr === "agi"),
    [filteredHeroes]
  );
  const intelligenceHeroes = useMemo(
    () => filteredHeroes.filter((h) => h.classicAttr === "int"),
    [filteredHeroes]
  );
  const universalHeroes = useMemo(
    () => filteredHeroes.filter((h) => h.modernAttr === "all"),
    [filteredHeroes]
  );

  return (
    <section id="heroes" className="relative py-14 sm:py-20 bg-[#090A0F] text-[#F1F3F7] border-t border-white/[0.08] scroll-mt-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-900/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CANONICAL HERO ROSTER & REAL LORE NAMES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              The Heroes of the Ancients
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Complete Dota 2 hero matrix categorized into classic taverns and attributes. Every hero includes their official localized name alongside their legendary DotA Allstars lore name.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hero or real name (e.g. Magina, Furion, Traxex)..."
                className="w-full bg-[#11131B] border border-white/10 rounded-md pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Link to Compendium */}
            <Link
              href="/heroes"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-medium text-zinc-200 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Full Compendium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-[#0E1017]/80 backdrop-blur border border-white/[0.06] p-2.5 rounded-lg">
          {/* Attribute Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-zinc-500 mr-1.5 hidden sm:inline">Attribute:</span>
            <button
              onClick={() => setSelectedAttr("all")}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedAttr === "all"
                  ? "bg-white text-black font-semibold shadow"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              All ({HERO_LORE_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedAttr("str")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedAttr === "str"
                  ? "bg-amber-600 text-white font-semibold shadow-lg shadow-amber-600/30"
                  : "bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 border border-amber-900/30"
              }`}
            >
              <Shield className="w-3 h-3 text-amber-400" />
              Strength (42)
            </button>
            <button
              onClick={() => setSelectedAttr("agi")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedAttr === "agi"
                  ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30"
                  : "bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 border border-emerald-900/30"
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              Agility (39)
            </button>
            <button
              onClick={() => setSelectedAttr("int")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedAttr === "int"
                  ? "bg-sky-600 text-white font-semibold shadow-lg shadow-sky-600/30"
                  : "bg-sky-950/20 text-sky-300 hover:bg-sky-950/40 border border-sky-900/30"
              }`}
            >
              <Brain className="w-3 h-3 text-sky-400" />
              Intelligence (45)
            </button>
            <button
              onClick={() => setSelectedAttr("uni")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedAttr === "uni"
                  ? "bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/30"
                  : "bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 border border-purple-900/30"
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              Universal (22)
            </button>
          </div>

          {/* Quick Stats count */}
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Showing <strong className="text-white">{filteredHeroes.length}</strong> Heroes</span>
          </div>
        </div>

        {/* Results Count Banner if searching */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between px-4 py-2.5 rounded bg-white/[0.04] border border-white/10 text-xs font-mono">
            <span className="text-zinc-300">
              Found <strong className="text-white">{filteredHeroes.length}</strong> hero
              {filteredHeroes.length === 1 ? "" : "es"} matching query &quot;
              <span className="text-rose-400">{searchQuery}</span>&quot;
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. STRENGTH HEROES SECTION                              */}
        {/* ======================================================== */}
        {(selectedAttr === "all" || selectedAttr === "str") && strengthHeroes.length > 0 && (
          <div className="mb-14">
            <AttributeSectionBanner type="str" count={strengthHeroes.length} />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-2.5">
              {strengthHeroes.map((hero) => (
                <HeroCardTile
                  key={hero.id}
                  hero={hero}
                  isHovered={hoveredHeroId === hero.id}
                  onHover={() => setHoveredHeroId(hero.id)}
                  onLeave={() => setHoveredHeroId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. AGILITY HEROES SECTION                               */}
        {/* ======================================================== */}
        {(selectedAttr === "all" || selectedAttr === "agi") && agilityHeroes.length > 0 && (
          <div className="mb-14">
            <AttributeSectionBanner type="agi" count={agilityHeroes.length} />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-2.5">
              {agilityHeroes.map((hero) => (
                <HeroCardTile
                  key={hero.id}
                  hero={hero}
                  isHovered={hoveredHeroId === hero.id}
                  onHover={() => setHoveredHeroId(hero.id)}
                  onLeave={() => setHoveredHeroId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. INTELLIGENCE HEROES SECTION                          */}
        {/* ======================================================== */}
        {(selectedAttr === "all" || selectedAttr === "int") && intelligenceHeroes.length > 0 && (
          <div className="mb-14">
            <AttributeSectionBanner type="int" count={intelligenceHeroes.length} />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-2.5">
              {intelligenceHeroes.map((hero) => (
                <HeroCardTile
                  key={hero.id}
                  hero={hero}
                  isHovered={hoveredHeroId === hero.id}
                  onHover={() => setHoveredHeroId(hero.id)}
                  onLeave={() => setHoveredHeroId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. UNIVERSAL HEROES SECTION (Modern Patch 7.33+)        */}
        {/* ======================================================== */}
        {(selectedAttr === "all" || selectedAttr === "uni") && universalHeroes.length > 0 && (
          <div className="mb-14">
            <AttributeSectionBanner type="all" count={universalHeroes.length} />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-2.5">
              {universalHeroes.map((hero) => (
                <HeroCardTile
                  key={hero.id}
                  hero={hero}
                  isHovered={hoveredHeroId === hero.id}
                  onHover={() => setHoveredHeroId(hero.id)}
                  onLeave={() => setHoveredHeroId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {filteredHeroes.length === 0 && (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
            <p className="text-sm font-mono text-zinc-400">
              No heroes found matching &quot;{searchQuery}&quot;.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Try searching by either localized name (e.g. &quot;Anti-Mage&quot;) or real name (e.g. &quot;Magina&quot;).
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedAttr("all");
              }}
              className="mt-4 px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-medium transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>126 Heroes Indexed</span>
            <span className="text-zinc-600">|</span>
            <span className="text-amber-400/90 font-medium">Real Names from DotA Allstars &amp; Valve Lore</span>
          </div>
          <Link
            href="/heroes"
            className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold group transition-all"
          >
            <span>Explore In-Depth Hero Analytics &amp; Matchups</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ========================================================
// Individual Hero Tile Card Component
// ========================================================
interface HeroCardTileProps {
  hero: HeroLoreEntry;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

// ========================================================
// Sleek Attribute Section Banner with Laser Wings & Medal
// ========================================================
const ATTR_BANNER_CONFIG = {
  str: {
    title: "STRENGTH",
    subtitle: "HEROES",
    gradientText: "from-[#FFF6E5] via-[#FBBF24] to-[#D97706]",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    lineGradientLeft: "from-transparent to-amber-500/60",
    lineGradientRight: "from-amber-500/60 to-transparent",
    diamondColor: "bg-amber-400 border-amber-200/70 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
    medallionBorder: "from-amber-200 via-amber-500 to-amber-800 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
    medallionBg: "from-amber-500 via-orange-600 to-red-700",
    icon: Shield,
    flareBg: "radial-gradient(ellipse 40% 70% at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.05) 50%, transparent 80%)",
  },
  agi: {
    title: "AGILITY",
    subtitle: "HEROES",
    gradientText: "from-[#ECFDF5] via-[#34D399] to-[#059669]",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    lineGradientLeft: "from-transparent to-emerald-500/60",
    lineGradientRight: "from-emerald-500/60 to-transparent",
    diamondColor: "bg-emerald-400 border-emerald-200/70 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
    medallionBorder: "from-emerald-200 via-emerald-500 to-emerald-800 shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    medallionBg: "from-emerald-400 via-green-600 to-teal-800",
    icon: Zap,
    flareBg: "radial-gradient(ellipse 40% 70% at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 80%)",
  },
  int: {
    title: "INTELLIGENCE",
    subtitle: "HEROES",
    gradientText: "from-[#F0F9FF] via-[#38BDF8] to-[#0284C7]",
    borderColor: "border-sky-500/40",
    glowColor: "shadow-[0_0_20px_rgba(56,189,248,0.25)]",
    lineGradientLeft: "from-transparent to-sky-500/60",
    lineGradientRight: "from-sky-500/60 to-transparent",
    diamondColor: "bg-sky-400 border-sky-200/70 shadow-[0_0_8px_rgba(56,189,248,0.9)]",
    medallionBorder: "from-sky-200 via-sky-500 to-sky-800 shadow-[0_0_12px_rgba(56,189,248,0.6)]",
    medallionBg: "from-sky-400 via-blue-600 to-indigo-800",
    icon: Brain,
    flareBg: "radial-gradient(ellipse 40% 70% at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 80%)",
  },
  all: {
    title: "UNIVERSAL",
    subtitle: "HEROES",
    gradientText: "from-[#FAF5FF] via-[#C084FC] to-[#7C3AED]",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    lineGradientLeft: "from-transparent to-purple-500/60",
    lineGradientRight: "from-purple-500/60 to-transparent",
    diamondColor: "bg-purple-400 border-purple-200/70 shadow-[0_0_8px_rgba(192,132,252,0.9)]",
    medallionBorder: "from-purple-200 via-purple-500 to-purple-800 shadow-[0_0_12px_rgba(168,85,247,0.6)]",
    medallionBg: "from-purple-400 via-violet-600 to-indigo-800",
    icon: Sparkles,
    flareBg: "radial-gradient(ellipse 40% 70% at 50% 50%, rgba(168, 85, 247, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 80%)",
  },
};

function AttributeSectionBanner({
  type,
  count,
}: {
  type: "str" | "agi" | "int" | "all";
  count?: number;
}) {
  const cfg = ATTR_BANNER_CONFIG[type];
  const Icon = cfg.icon;

  return (
    <div className="relative py-4 mb-6 flex items-center justify-center w-full overflow-hidden select-none">
      {/* Soft Center Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: cfg.flareBg }}
      />

      {/* Left Laser Wing */}
      <div className="flex-1 flex items-center justify-end">
        <div className={`h-[1px] w-full max-w-[260px] bg-gradient-to-r ${cfg.lineGradientLeft}`} />
        <div className={`w-1.5 h-1.5 rotate-45 border ${cfg.diamondColor} -mr-0.5`} />
      </div>

      {/* Sculpted Center Badge */}
      <div
        className={`relative z-10 mx-3 sm:mx-5 px-5 sm:px-8 py-2 rounded-full bg-[#0A0C14]/90 backdrop-blur-md border ${cfg.borderColor} ${cfg.glowColor} flex items-center gap-3.5`}
      >
        <span
          className={`text-sm sm:text-base font-serif tracking-[0.24em] uppercase font-black bg-gradient-to-b ${cfg.gradientText} bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          {cfg.title}
        </span>

        {/* Central Attribute Crest Medallion */}
        <div
          className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b ${cfg.medallionBorder} p-[1.5px] flex items-center justify-center`}
        >
          <div
            className={`w-full h-full rounded-full bg-gradient-to-b ${cfg.medallionBg} flex items-center justify-center shadow-inner`}
          >
            <Icon className="w-3.5 h-3.5 text-white fill-white/90 drop-shadow" />
          </div>
        </div>

        <span
          className={`text-sm sm:text-base font-serif tracking-[0.24em] uppercase font-black bg-gradient-to-b ${cfg.gradientText} bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          {cfg.subtitle}
        </span>

        {typeof count === "number" && count > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-200 border border-white/15 tracking-normal font-semibold shadow-inner">
            <span className="text-white font-bold">{count}</span>
            <span className="text-zinc-400 text-[10px]">Heroes</span>
          </span>
        )}
      </div>

      {/* Right Laser Wing */}
      <div className="flex-1 flex items-center justify-start">
        <div className={`w-1.5 h-1.5 rotate-45 border ${cfg.diamondColor} -ml-0.5`} />
        <div className={`h-[1px] w-full max-w-[260px] bg-gradient-to-l ${cfg.lineGradientLeft}`} />
      </div>
    </div>
  );
}

function HeroCardTile({ hero, isHovered, onHover, onLeave }: HeroCardTileProps) {
  const [imgError, setImgError] = useState(false);
  const isRadiant = hero.faction === "radiant";

  const heroImgUrl = imgError
    ? "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png"
    : `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.shortName}.png`;

  return (
    <Link
      href={`/heroes?search=${encodeURIComponent(hero.name)}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      title={`${hero.name} ("${hero.realName}")`}
      className={`group relative flex flex-col rounded-sm overflow-hidden bg-[#0C0E17] border transition-all duration-200 select-none ${
        isHovered
          ? isRadiant
            ? "border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.45)] -translate-y-1 scale-[1.04] z-30 ring-1 ring-emerald-400/60"
            : "border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.45)] -translate-y-1 scale-[1.04] z-30 ring-1 ring-rose-400/60"
          : isRadiant
          ? "border-emerald-950/60 hover:border-emerald-500/50"
          : "border-rose-950/60 hover:border-rose-500/50"
      }`}
    >
      {/* Hero Portrait Container (Unobscured Artwork) */}
      <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImgUrl}
          alt={hero.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-108"
        />

        {/* Faction color accent bar at very top */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isRadiant
              ? "bg-gradient-to-r from-emerald-500 via-teal-300 to-transparent"
              : "bg-gradient-to-r from-rose-500 via-red-400 to-transparent"
          }`}
        />

        {/* Attack Type Indicator */}
        <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[8.5px] font-mono uppercase px-1 py-0.2 rounded bg-black/80 text-zinc-300 border border-white/10">
            {hero.attackType === "Melee" ? "MEL" : "RNG"}
          </span>
        </div>
      </div>

      {/* Dedicated Tactical Nameplate Footer (Clean, readable, centered) */}
      <div className="px-1 py-1.5 bg-gradient-to-b from-[#10131F] to-[#090A10] border-t border-white/[0.08] flex flex-col items-center justify-center text-center">
        {/* Hero Localized Title */}
        <span className="w-full text-[11px] sm:text-[11.5px] font-sans font-bold text-[#7fd3ff] tracking-tight leading-snug truncate drop-shadow-[0_1px_2px_rgba(0,0,0,1)] group-hover:text-white transition-colors">
          {hero.name}
        </span>
        {/* Canonical Real Lore Name */}
        <span className="w-full text-[9px] sm:text-[9.5px] font-serif italic text-[#fbbf24] font-medium tracking-normal leading-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,1)] opacity-95 group-hover:text-amber-200 transition-colors">
          {hero.realName}
        </span>
      </div>

      {/* Floating Hover Card on Hover with Extra Details */}
      {isHovered && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none px-3 py-1 rounded bg-[#0A0B10]/95 border border-amber-400/60 shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
            <span className="font-bold text-white">{hero.name}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-300 italic font-serif">&quot;{hero.realName}&quot;</span>
            <span className="text-zinc-500">•</span>
            <span className="text-[9px] text-zinc-400 uppercase">{hero.attackType}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
