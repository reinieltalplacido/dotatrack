"use client";

import { useState, useMemo } from "react";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { MECHANICS_DATA, MECHANICS_CATEGORIES, MechanicItem } from "@/lib/learn/mechanics-data";
import {
  BookOpen,
  Search,
  Zap,
  Target,
  Swords,
  Shield,
  Coins,
  MapPin,
  Layers,
  ChevronRight,
  Flame,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from "lucide-react";

export function MechanicsCompendium() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("turn-rate");

  const filteredMechanics = useMemo(() => {
    return MECHANICS_DATA.filter((item) => {
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesSub = item.subcategory.toLowerCase().includes(q);
      const matchesDesc = item.shortDesc.toLowerCase().includes(q);
      const matchesInDepth = item.inDepthExplanation.toLowerCase().includes(q);
      const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && (matchesTitle || matchesSub || matchesDesc || matchesInDepth || matchesTags);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-[#0E1018] via-[#151824] to-[#0E1018]">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dota 2 Mechanics & Rules Engine
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Dota 2&apos;s competitive depth is governed by precise mechanical systems. Master turn rates, damage type mitigations, orb walking aggro rules, map objectives, and economic buyback calculations.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="tactical-panel p-5 sm:p-6 rounded-sm border border-white/[0.08] bg-[#0E1018] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="overflow-x-auto no-scrollbar">
            <AnimatedTabs
              tabs={MECHANICS_CATEGORIES.map((cat) => ({ id: cat.id, label: cat.label }))}
              activeTab={selectedCategory}
              onChange={(id) => setSelectedCategory(id)}
              layoutId="mechanicsCategoryPill"
              size="sm"
              variant="segmented"
            />
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mechanics, e.g. 'turn rate', 'orb'..."
              className="w-full rounded-sm border border-white/[0.1] bg-black/40 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Counts */}
        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <span>
            Showing <strong className="text-white">{filteredMechanics.length}</strong> core mechanics
          </span>
          <span className="text-zinc-500">Patch 7.37e Matchmaking Standards</span>
        </div>
      </div>

      {/* Mechanics Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMechanics.length === 0 ? (
          <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] bg-[#0E1018]">
            <HelpCircle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">No Mechanics Found</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Try searching for terms like &ldquo;turn rate&rdquo;, &ldquo;cleave&rdquo;, &ldquo;buyback&rdquo;, or &ldquo;aggro&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-3 py-1.5 rounded-sm bg-white/[0.08] text-xs font-mono text-white hover:bg-white/[0.12] transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredMechanics.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`tactical-panel rounded-sm border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "border-rose-500/40 bg-[#0F111A] shadow-xl"
                    : "border-white/[0.08] bg-[#0E1018] hover:border-white/20"
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                        {item.subcategory}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{item.shortDesc}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400">
                      {isExpanded ? "Collapse" : "Explore Rule"}
                    </span>
                    <div
                      className={`p-1.5 rounded bg-white/[0.04] text-zinc-300 transition-transform duration-200 ${
                        isExpanded ? "rotate-90 text-rose-400" : ""
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-black/20 space-y-5">
                    {/* In-depth explanation */}
                    <div className="p-4 rounded-sm bg-[#12141F] border border-white/[0.06] space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-rose-400" />
                        How This Mechanic Operates
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                        {item.inDepthExplanation}
                      </p>
                    </div>

                    {/* Formula or Rule Callout */}
                    {item.formulaOrRule && (
                      <div className="p-3.5 rounded-sm bg-black/50 border border-white/[0.1] font-mono text-xs space-y-1">
                        <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">
                          Formula / Mechanical Rule
                        </div>
                        <div className="text-amber-300 font-bold">{item.formulaOrRule}</div>
                      </div>
                    )}

                    {/* Pro Execution Tip */}
                    <div className="p-4 rounded-sm bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold mb-1">
                          Competitive Pro Execution
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {item.proExecutionTip}
                        </p>
                      </div>
                    </div>

                    {/* Key Examples / Heroes / Items */}
                    {item.keyExamples && item.keyExamples.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                          Key Examples & Synergies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.keyExamples.map((ex, i) => (
                            <span
                              key={i}
                              className="text-xs font-mono bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded text-zinc-200"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
