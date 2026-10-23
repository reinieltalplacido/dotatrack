"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Flame, ArrowUpDown } from "lucide-react";
import { EnrichedHeroStat } from "@/lib/opendota/types";

interface HeroesTabProps {
  heroes: EnrichedHeroStat[];
}

export function HeroesTab({ heroes }: HeroesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [attrFilter, setAttrFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"games" | "winRate" | "win">("games");

  const filteredHeroes = heroes
    .filter((h) => {
      const matchesSearch = h.heroLocalizedName
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const matchesAttr =
        attrFilter === "all" || h.primaryAttr.toLowerCase() === attrFilter.toLowerCase();
      return matchesSearch && matchesAttr;
    })
    .sort((a, b) => {
      if (sortBy === "winRate") {
        if (b.winRate === a.winRate) return b.games - a.games;
        return b.winRate - a.winRate;
      }
      if (sortBy === "win") {
        return b.win - a.win;
      }
      return b.games - a.games;
    });

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Attribute Filter, and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 tactical-panel p-3.5 rounded-sm border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by hero name..."
              className="w-full bg-[#0A0C12] border border-white/[0.1] rounded-sm pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Primary Attribute Pills */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setAttrFilter("all")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "all"
                  ? "bg-rose-600 text-white font-bold"
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
              onClick={() => setAttrFilter("all_attr")}
              className={`rounded-sm px-2.5 py-1 transition-colors ${
                attrFilter === "all_attr"
                  ? "bg-purple-700 text-white font-bold"
                  : "bg-zinc-900 text-purple-400 hover:text-white"
              }`}
            >
              UNI
            </button>
          </div>
        </div>

        {/* Sorting Dropdown/Buttons */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-zinc-500 uppercase text-[10px]">Sort by:</span>
          <button
            type="button"
            onClick={() => setSortBy("games")}
            className={`rounded-sm px-2 py-1 ${
              sortBy === "games"
                ? "bg-white/[0.1] text-white font-bold border border-white/[0.15]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Matches
          </button>
          <button
            type="button"
            onClick={() => setSortBy("winRate")}
            className={`rounded-sm px-2 py-1 ${
              sortBy === "winRate"
                ? "bg-white/[0.1] text-white font-bold border border-white/[0.15]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Win Rate
          </button>
          <button
            type="button"
            onClick={() => setSortBy("win")}
            className={`rounded-sm px-2 py-1 ${
              sortBy === "win"
                ? "bg-white/[0.1] text-white font-bold border border-white/[0.15]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Wins
          </button>
        </div>
      </div>

      {/* Heroes Grid */}
      {filteredHeroes.length === 0 ? (
        <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08]">
          <Flame className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-mono font-bold text-white mb-1">
            No matching hero statistics
          </h3>
          <p className="text-xs font-mono text-zinc-400">
            Try adjusting your search query or attribute filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredHeroes.map((hero) => (
            <div
              key={hero.heroId}
              className="tactical-panel p-3.5 rounded-sm border border-white/[0.06] hover:border-rose-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-11 w-18 overflow-hidden rounded bg-black shrink-0 border border-white/[0.1]">
                    <Image
                      src={hero.heroImageUrl}
                      alt={hero.heroLocalizedName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">
                      {hero.heroLocalizedName}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-0.5">
                      <span className="uppercase text-zinc-500 font-bold">
                        {hero.primaryAttr}
                      </span>
                      <span>•</span>
                      <span>Last: {hero.lastPlayedAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px]">GAMES PLAYED:</span>
                    <span className="font-bold text-zinc-200">
                      {hero.games.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px]">RECORD:</span>
                    <span>
                      <strong className="text-emerald-400">{hero.win}W</strong> -{" "}
                      <strong className="text-rose-400">{hero.loss}L</strong>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px]">WIN RATE:</span>
                    <span
                      className={`font-bold ${
                        hero.winRate >= 50 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {hero.winRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Win-rate progress bar (Green for Wins, Red for Losses) */}
              <div className="mt-3 pt-2 border-t border-white/[0.04]">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                  {hero.games > 0 ? (
                    <>
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, hero.winRate))}%` }}
                        title={`${hero.winRate}% Win`}
                      />
                      <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${Math.max(0, 100 - hero.winRate)}%` }}
                        title={`${(100 - hero.winRate).toFixed(1)}% Loss`}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full bg-zinc-800" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
