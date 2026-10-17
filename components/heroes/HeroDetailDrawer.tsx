"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Shield,
  Zap,
  Brain,
  Sparkles,
  Swords,
  Footprints,
  Activity,
  Layers,
  ChevronRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  EnrichedHeroSummary,
  HeroDetailDeepDive,
  PrimaryAttrType,
} from "@/lib/opendota/hero-types";

interface HeroDetailDrawerProps {
  hero: EnrichedHeroSummary | null;
  onClose: () => void;
  onSelectHero: (heroId: number) => void;
  onToggleCompare: (heroId: number) => void;
  isCompared: boolean;
}

const ATTR_MAP: Record<
  PrimaryAttrType,
  { name: string; icon: typeof Shield; color: string; badge: string }
> = {
  str: {
    name: "Strength",
    icon: Shield,
    color: "text-red-400",
    badge: "bg-red-950/80 text-red-300 border-red-800/60",
  },
  agi: {
    name: "Agility",
    icon: Zap,
    color: "text-emerald-400",
    badge: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
  },
  int: {
    name: "Intelligence",
    icon: Brain,
    color: "text-sky-400",
    badge: "bg-sky-950/80 text-sky-300 border-sky-800/60",
  },
  all: {
    name: "Universal",
    icon: Sparkles,
    color: "text-amber-400",
    badge: "bg-amber-950/80 text-amber-300 border-amber-800/60",
  },
};

export function HeroDetailDrawer({
  hero,
  onClose,
  onSelectHero,
  onToggleCompare,
  isCompared,
}: HeroDetailDrawerProps) {
  const [deepDive, setDeepDive] = useState<HeroDetailDeepDive | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);
  const [activeItemTab, setActiveItemTab] = useState<"startGame" | "earlyGame" | "midGame" | "lateGame">("midGame");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch secondary matchups & items
  useEffect(() => {
    if (!hero) {
      setDeepDive(null);
      return;
    }

    let isMounted = true;
    setLoadingDeepDive(true);

    fetch(`/api/heroes/${hero.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load hero details");
        return res.json();
      })
      .then((data: HeroDetailDeepDive) => {
        if (isMounted) {
          setDeepDive(data);
          setLoadingDeepDive(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch detailed matchups:", err);
        if (isMounted) {
          setLoadingDeepDive(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hero]);

  if (!hero) return null;

  const attrMeta = ATTR_MAP[hero.primary_attr] || ATTR_MAP.str;
  const AttrIcon = attrMeta.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-drawer-title"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#090A10]/95 backdrop-blur-xl border-l border-white/[0.12] shadow-2xl flex flex-col transition-all duration-300"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#0D0F18]/80">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold">
            HERO_DOSSIER // #{hero.id}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400">
            {hero.attack_type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleCompare(hero.id)}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono font-semibold transition-all ${
              isCompared
                ? "bg-rose-600 text-white border border-rose-500"
                : "bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1] border border-white/[0.08]"
            }`}
          >
            <span>{isCompared ? "Compared" : "+ Compare"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close hero details panel"
            className="rounded p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Hero Banner Header */}
        <div className="relative rounded-sm border border-white/[0.1] overflow-hidden bg-gradient-to-b from-[#141724] to-[#0A0C14] p-5">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* High-res Hero Artwork */}
            <div className="relative h-24 w-36 sm:h-28 sm:w-44 rounded-sm overflow-hidden border border-white/[0.15] shadow-lg flex-shrink-0 bg-black">
              <NextImage
                src={hero.img}
                alt={hero.localized_name}
                fill
                priority
                sizes="176px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-1 left-1.5">
                <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${attrMeta.badge}`}>
                  <AttrIcon className="h-2.5 w-2.5" />
                  <span>{attrMeta.name}</span>
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1">
              <h2 id="hero-drawer-title" className="text-2xl font-mono font-black text-white tracking-tight">
                {hero.localized_name}
              </h2>
              <div className="text-xs font-mono text-zinc-400 mt-0.5 mb-3">
                {hero.name}
              </div>

              {/* Roles Chips */}
              <div className="flex flex-wrap gap-1.5">
                {hero.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Pub & Pro Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="tactical-panel p-3 rounded-sm border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
              Pub Win Rate
            </span>
            <span
              className={`text-xl font-mono font-black ${
                hero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {hero.winRate.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              {hero.pub_win.toLocaleString()} wins
            </span>
          </div>

          <div className="tactical-panel p-3 rounded-sm border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
              Pub Pick Rate
            </span>
            <span className="text-xl font-mono font-black text-white">
              {hero.pickRate.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              {hero.pub_pick.toLocaleString()} matches
            </span>
          </div>

          <div className="tactical-panel p-3 rounded-sm border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
              Pro Win Rate
            </span>
            <span
              className={`text-xl font-mono font-black ${
                hero.proWinRate >= 50 ? "text-emerald-400" : "text-zinc-300"
              }`}
            >
              {hero.pro_pick > 0 ? `${hero.proWinRate.toFixed(1)}%` : "N/A"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              {hero.pro_pick > 0 ? `${hero.pro_pick} pro games` : "No pro sample"}
            </span>
          </div>

          <div className="tactical-panel p-3 rounded-sm border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
              Pro Bans
            </span>
            <span className="text-xl font-mono font-black text-rose-400">
              {hero.pro_ban.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
              Competitive bans
            </span>
          </div>
        </div>

        {/* Combat Base Stats & Attribute Growth */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
            <Activity className="h-4 w-4 text-rose-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Combat Attributes &amp; Stat Scaling
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            {/* Primary Attributes */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-red-400">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> STR
                </span>
                <span className="font-bold">{hero.base_str} +{hero.str_gain}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" /> AGI
                </span>
                <span className="font-bold">{hero.base_agi} +{hero.agi_gain}</span>
              </div>
              <div className="flex justify-between items-center text-sky-400">
                <span className="flex items-center gap-1">
                  <Brain className="h-3 w-3" /> INT
                </span>
                <span className="font-bold">{hero.base_int} +{hero.int_gain}</span>
              </div>
            </div>

            {/* Health & Mana */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Base HP:</span>
                <span className="text-white font-bold">{hero.base_health} (+{hero.base_health_regen})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Base Mana:</span>
                <span className="text-white font-bold">{hero.base_mana} (+{hero.base_mana_regen})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Magic Resist:</span>
                <span className="text-white font-bold">{hero.base_mr}%</span>
              </div>
            </div>

            {/* Attack & Armor */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Damage:</span>
                <span className="text-white font-bold">{hero.base_attack_min} - {hero.base_attack_max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Armor:</span>
                <span className="text-white font-bold">{hero.base_armor.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bat:</span>
                <span className="text-white font-bold">{hero.attack_rate}s</span>
              </div>
            </div>

            {/* Mobility & Range */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Move Speed:</span>
                <span className="text-white font-bold">{hero.move_speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Range:</span>
                <span className="text-white font-bold">{hero.attack_range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Projectile:</span>
                <span className="text-white font-bold">{hero.projectile_speed || "Instant"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rank Bracket Performance Matrix */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Win Rate by Competitive Rank Bracket
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Herald &rarr; Divine</span>
          </div>

          <div className="space-y-2.5">
            {hero.brackets
              .filter((b) => b.picks > 0)
              .map((bracket) => {
                const isGood = bracket.winRate >= 50;
                return (
                  <div key={bracket.bracketId} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300 font-medium">{bracket.bracketName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px]">
                          {bracket.picks.toLocaleString()} picks
                        </span>
                        <span className={`font-bold ${isGood ? "text-emerald-400" : "text-rose-400"}`}>
                          {bracket.winRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isGood ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (bracket.winRate - 30) * 2.5))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Matchup Telemetry (Best against vs Counters) */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Matchup Telemetry &amp; Counters
              </h3>
            </div>
            {loadingDeepDive && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <Loader2 className="h-3 w-3 animate-spin text-rose-500" />
                <span>Loading matchups...</span>
              </div>
            )}
          </div>

          {loadingDeepDive ? (
            <div className="py-6 text-center text-xs font-mono text-zinc-500">
              Querying OpenDota live matchup matrix...
            </div>
          ) : deepDive && deepDive.bestMatchups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Best Matchups */}
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-2">
                  Advantageous Matchups (High Win Rate)
                </span>
                <div className="space-y-1.5">
                  {deepDive.bestMatchups.map((m) => (
                    <div
                      key={m.hero_id}
                      onClick={() => onSelectHero(m.hero_id)}
                      className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/[0.04] hover:border-emerald-500/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-9 rounded overflow-hidden flex-shrink-0 bg-zinc-900">
                          <NextImage
                            src={m.opponentHero.img}
                            alt={m.opponentHero.localized_name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-200">
                          {m.opponentHero.localized_name}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-emerald-400">{m.winRate}%</span>
                        <span className="text-[9px] text-zinc-400 block">{m.games_played} g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counters / Worst Matchups */}
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-2">
                  Tough Counters (Low Win Rate)
                </span>
                <div className="space-y-1.5">
                  {deepDive.worstMatchups.map((m) => (
                    <div
                      key={m.hero_id}
                      onClick={() => onSelectHero(m.hero_id)}
                      className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/[0.04] hover:border-rose-500/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-9 rounded overflow-hidden flex-shrink-0 bg-zinc-900">
                          <NextImage
                            src={m.opponentHero.img}
                            alt={m.opponentHero.localized_name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-200">
                          {m.opponentHero.localized_name}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-rose-400">{m.winRate}%</span>
                        <span className="text-[9px] text-zinc-400 block">{m.games_played} g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs font-mono text-zinc-500">
              Matchup statistics currently unavailable from upstream for this hero.
            </div>
          )}
        </div>

        {/* Popular Item Builds */}
        <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Item Build Popularity by Game Phase
              </h3>
            </div>
            {/* Phase Selector Tabs */}
            <div className="flex items-center gap-1">
              {(["startGame", "earlyGame", "midGame", "lateGame"] as const).map((phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => setActiveItemTab(phase)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    activeItemTab === phase
                      ? "bg-rose-950/80 text-rose-300 border border-rose-700/60 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {phase === "startGame"
                    ? "Start"
                    : phase === "earlyGame"
                    ? "Early"
                    : phase === "midGame"
                    ? "Mid"
                    : "Late"}
                </button>
              ))}
            </div>
          </div>

          {loadingDeepDive ? (
            <div className="py-6 text-center text-xs font-mono text-zinc-500">
              Querying OpenDota item popularity telemetry...
            </div>
          ) : deepDive?.itemPopularity && deepDive.itemPopularity[activeItemTab]?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {deepDive.itemPopularity[activeItemTab].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded bg-black/40 border border-white/[0.04]"
                >
                  <div className="relative h-7 w-9 rounded overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10">
                    <NextImage
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-mono text-zinc-200 truncate font-semibold">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {item.count.toLocaleString()} buys
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs font-mono text-zinc-500">
              Item build telemetry currently unavailable from upstream for this phase.
            </div>
          )}
        </div>

        {/* Links to Related DotaTrack Meta Trends */}
        <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-zinc-300">View patch 7.37e balance changes &amp; tier shifts</span>
          </div>
          <Link
            href="/meta-trends"
            className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold transition-colors"
          >
            <span>Meta Trends</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
