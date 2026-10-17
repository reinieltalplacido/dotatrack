"use client";

import { useState } from "react";
import Image from "next/image";
import { EnrichedHeroSummary, PrimaryAttrType } from "@/lib/opendota/hero-types";
import { Check, Plus } from "lucide-react";

interface HeroCardProps {
  hero: EnrichedHeroSummary;
  isSelected: boolean;
  isCompared: boolean;
  onSelect: (heroId: number) => void;
  onToggleCompare: (heroId: number) => void;
}

const ATTR_BADGES: Record<
  PrimaryAttrType,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  str: {
    label: "STR",
    textClass: "text-red-400",
    bgClass: "bg-red-950/70",
    borderClass: "border-red-800/60",
  },
  agi: {
    label: "AGI",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-950/70",
    borderClass: "border-emerald-800/60",
  },
  int: {
    label: "INT",
    textClass: "text-sky-400",
    bgClass: "bg-sky-950/70",
    borderClass: "border-sky-800/60",
  },
  all: {
    label: "UNI",
    textClass: "text-amber-400",
    bgClass: "bg-amber-950/70",
    borderClass: "border-amber-800/60",
  },
};

export function HeroCard({
  hero,
  isSelected,
  isCompared,
  onSelect,
  onToggleCompare,
}: HeroCardProps) {
  const [imgSrc, setImgSrc] = useState(hero.img);
  const attrInfo = ATTR_BADGES[hero.primary_attr] || ATTR_BADGES.str;
  const isPositiveWinRate = hero.winRate >= 50;

  const formatMatches = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}k`;
    return count.toString();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${hero.localized_name}. Win rate ${hero.winRate.toFixed(1)}%, Pick rate ${hero.pickRate.toFixed(1)}%`}
      aria-pressed={isSelected}
      onClick={() => onSelect(hero.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(hero.id);
        }
      }}
      className={`group relative flex flex-col rounded-sm border bg-[#0D0F18] overflow-hidden transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
        isSelected
          ? "border-rose-500 shadow-[0_0_20px_-3px_rgba(225,29,72,0.4)] ring-1 ring-rose-500/50"
          : "border-white/[0.08] hover:border-white/[0.22] hover:bg-[#121420]"
      }`}
    >
      {/* Hero Portrait Container with 16:9 ratio */}
      <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
        <Image
          src={imgSrc}
          alt={`Portrait of ${hero.localized_name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={() => {
            setImgSrc("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png");
          }}
        />

        {/* Top Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F18] via-transparent to-black/40 pointer-events-none" />

        {/* Primary Attribute Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-wider border ${attrInfo.bgClass} ${attrInfo.textClass} ${attrInfo.borderClass}`}
          >
            {attrInfo.label}
          </span>
        </div>

        {/* Compare Toggle Button */}
        <button
          type="button"
          title={isCompared ? "Remove from comparison matrix" : "Add to comparison matrix"}
          aria-label={isCompared ? `Remove ${hero.localized_name} from comparison` : `Compare ${hero.localized_name}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(hero.id);
          }}
          className={`absolute top-2 right-2 z-10 h-6 w-6 rounded flex items-center justify-center transition-all ${
            isCompared
              ? "bg-rose-600 text-white border border-rose-400 shadow-sm"
              : "bg-black/60 text-zinc-400 hover:text-white hover:bg-black/90 border border-white/10"
          }`}
        >
          {isCompared ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : <Plus className="h-3.5 w-3.5" />}
        </button>

        {/* Attack Type & Complexity Indicator at bottom of image */}
        <div className="absolute bottom-1.5 right-2 z-10 text-[9px] font-mono uppercase text-zinc-400 bg-black/60 px-1 rounded border border-white/[0.05]">
          {hero.attack_type}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Name and Roles */}
        <div>
          <h3 className="font-mono text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">
            {hero.localized_name}
          </h3>
          <p className="text-[10px] font-mono text-zinc-400 truncate mb-2.5">
            {hero.roles.slice(0, 2).join(" • ") || "Hero"}
          </p>
        </div>

        {/* Stats: Win Rate & Pick Rate */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
          {/* Win Rate Progress & Metric */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">Win Rate</span>
            <span
              className={`font-bold ${
                isPositiveWinRate ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {hero.winRate.toFixed(1)}%
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-1 w-full bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isPositiveWinRate ? "bg-emerald-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, (hero.winRate - 35) * 3.3))}%` }}
            />
          </div>

          {/* Pick Rate and Matches */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
            <span>Pick: <strong className="text-zinc-200">{hero.pickRate.toFixed(1)}%</strong></span>
            <span>{formatMatches(hero.pub_pick)} picks</span>
          </div>
        </div>
      </div>

      {/* Selected Indicator Bar */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#E11D48]" />
      )}
    </div>
  );
}
