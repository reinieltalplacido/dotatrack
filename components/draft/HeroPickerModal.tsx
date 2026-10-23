"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, X, Shield, Swords, Sparkles, Filter, Check } from "lucide-react";
import { EnrichedHeroSummary, PrimaryAttrType } from "@/lib/opendota/hero-types";
import { DraftRole } from "@/lib/draft/draft-engine";

interface HeroPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHero: (hero: EnrichedHeroSummary) => void;
  allHeroes: EnrichedHeroSummary[];
  pickedHeroIds: Set<number>;
  targetTeam: "radiant" | "dire";
  targetRole: DraftRole;
}

export function HeroPickerModal({
  isOpen,
  onClose,
  onSelectHero,
  allHeroes,
  pickedHeroIds,
  targetTeam,
  targetRole,
}: HeroPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [attrFilter, setAttrFilter] = useState<"all" | PrimaryAttrType>("all");

  const filteredHeroes = useMemo(() => {
    return allHeroes
      .filter((h) => {
        if (attrFilter !== "all" && h.primary_attr !== attrFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = h.localized_name.toLowerCase().includes(q);
          const matchSlug = h.name.toLowerCase().includes(q);
          if (!matchName && !matchSlug) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Available heroes first, picked heroes at bottom
        const aPicked = pickedHeroIds.has(a.id);
        const bPicked = pickedHeroIds.has(b.id);
        if (aPicked && !bPicked) return 1;
        if (!aPicked && bPicked) return -1;
        return a.localized_name.localeCompare(b.localized_name);
      });
  }, [allHeroes, attrFilter, searchQuery, pickedHeroIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-sm border border-white/[0.12] bg-[#0A0C14] shadow-2xl overflow-hidden"
        style={{
          boxShadow: targetTeam === "radiant" ? "0 0 50px rgba(16,185,129,0.15)" : "0 0 50px rgba(225,29,72,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0E1019]">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                targetTeam === "radiant"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "bg-rose-950 text-rose-300 border border-rose-800"
              }`}
            >
              Slot: {targetTeam.toUpperCase()} {targetRole}
            </span>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Select Hero
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Attribute Toolbar */}
        <div className="p-3.5 border-b border-white/[0.06] bg-[#07090F] flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search hero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#0A0C14] border border-white/[0.1] rounded-sm pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Primary Attribute Pills */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setAttrFilter("all")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "all"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setAttrFilter("str")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "str"
                  ? "bg-red-700 text-white font-bold"
                  : "bg-zinc-900 text-red-400 hover:text-white"
              }`}
            >
              STR
            </button>
            <button
              type="button"
              onClick={() => setAttrFilter("agi")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "agi"
                  ? "bg-emerald-700 text-white font-bold"
                  : "bg-zinc-900 text-emerald-400 hover:text-white"
              }`}
            >
              AGI
            </button>
            <button
              type="button"
              onClick={() => setAttrFilter("int")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "int"
                  ? "bg-blue-700 text-white font-bold"
                  : "bg-zinc-900 text-blue-400 hover:text-white"
              }`}
            >
              INT
            </button>
            <button
              type="button"
              onClick={() => setAttrFilter("all")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "all"
                  ? "bg-purple-700 text-white font-bold"
                  : "bg-zinc-900 text-purple-400 hover:text-white"
              }`}
            >
              UNI
            </button>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh] no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
            {filteredHeroes.map((hero) => {
              const isAlreadyPicked = pickedHeroIds.has(hero.id);

              return (
                <button
                  key={hero.id}
                  type="button"
                  disabled={isAlreadyPicked}
                  onClick={() => {
                    onSelectHero(hero);
                    onClose();
                  }}
                  className={`group relative flex flex-col items-center rounded-sm border p-2 text-left transition-all cursor-pointer ${
                    isAlreadyPicked
                      ? "opacity-30 border-white/[0.04] bg-zinc-950 cursor-not-allowed"
                      : "bg-[#0C0F18] border-white/[0.08] hover:border-amber-400 hover:bg-zinc-900/80 hover:scale-105"
                  }`}
                >
                  <div className="relative h-12 w-20 overflow-hidden rounded bg-black shrink-0 border border-white/[0.1] mb-1.5 shadow">
                    <Image
                      src={hero.img}
                      alt={hero.localized_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {isAlreadyPicked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Check className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-white truncate w-full text-center group-hover:text-amber-300">
                    {hero.localized_name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">
                    {hero.winRate.toFixed(1)}% WR
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
