"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { ITEM_THREATS_DATA, ThreatGuide } from "@/lib/learn/learn-data";
import { Search, ShieldAlert, Sparkles, Coins, Lightbulb, AlertCircle, ChevronDown, ChevronUp, Swords, HelpCircle } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Threats & Counters" },
  { id: "defense", label: "BKB & Saves" },
  { id: "evasion", label: "Evasion & Miss" },
  { id: "regen", label: "Health Regen & Lifesteal" },
  { id: "magic", label: "Magic Burst Nukes" },
  { id: "physical", label: "Physical Attack Carries" },
  { id: "illusions", label: "Illusion Armies" },
  { id: "cc", label: "Silences & Crowd Control" },
] as const;

export function ItemCounterMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedThreatId, setExpandedThreatId] = useState<string | null>("bkb-debuff-immunity");

  const filteredThreats = useMemo(() => {
    return ITEM_THREATS_DATA.filter((threat) => {
      const matchesCategory =
        selectedCategory === "all" || threat.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesTitle = threat.threatTitle.toLowerCase().includes(q);
      const matchesEnemyItem = threat.enemyItemOrThreat.name.toLowerCase().includes(q);
      const matchesWhy = threat.whyItIsDangerous.toLowerCase().includes(q);
      const matchesCounterItems = threat.counterItems.some((ci) =>
        ci.itemName.toLowerCase().includes(q) || ci.howToCounter.toLowerCase().includes(q)
      );
      const matchesHeroes = threat.counterHeroAbilities.some(
        (h) => h.hero.toLowerCase().includes(q) || h.ability.toLowerCase().includes(q)
      );

      return matchesCategory && (matchesTitle || matchesEnemyItem || matchesWhy || matchesCounterItems || matchesHeroes);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="tactical-panel p-5 sm:p-6 rounded-sm border border-white/[0.08] bg-[#0E1018] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Tactical Counter-Item Engine
            </h3>
            <p className="text-xs text-zinc-400">
              Identify what items and abilities counter enemy power spikes, defensive shields, and high-threat builds.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat or counter item (e.g. BKB, MKB)..."
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

        {/* Category Pills */}
        <div className="pt-2 border-t border-white/[0.06] overflow-x-auto no-scrollbar">
          <AnimatedTabs
            tabs={CATEGORIES.map((cat) => ({ id: cat.id, label: cat.label }))}
            activeTab={selectedCategory}
            onChange={(id) => setSelectedCategory(id)}
            layoutId="itemCounterCategoryPill"
            size="sm"
            variant="segmented"
          />
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {filteredThreats.length === 0 ? (
          <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] bg-[#0E1018]">
            <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">No Matching Threats Found</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Try searching for common items like &ldquo;BKB&rdquo;, &ldquo;Ghost Scepter&rdquo;, &ldquo;Butterfly&rdquo;, or &ldquo;Heart&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-3 py-1.5 rounded-sm bg-white/[0.08] text-xs font-mono text-white hover:bg-white/[0.12] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const isExpanded = expandedThreatId === threat.id;

            return (
              <div
                key={threat.id}
                className={`tactical-panel rounded-sm border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "border-rose-500/40 bg-[#0F111A] shadow-xl"
                    : "border-white/[0.08] bg-[#0E1018] hover:border-white/20"
                }`}
              >
                {/* Header Strip */}
                <button
                  onClick={() => setExpandedThreatId(isExpanded ? null : threat.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-12 w-16 overflow-hidden rounded-sm border border-white/20 flex-shrink-0 bg-black/60 shadow-md">
                      <Image
                        src={threat.enemyItemOrThreat.img}
                        alt={threat.enemyItemOrThreat.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm sm:text-base font-bold text-white truncate">
                          {threat.threatTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 text-zinc-300">
                          {threat.counterItems.length} Counters Available
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {threat.enemyItemOrThreat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400">
                      {isExpanded ? "Collapse" : "View Counters"}
                    </span>
                    <div className="p-1 rounded bg-white/[0.04] text-zinc-300">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-black/20 space-y-6">
                    {/* Why it's dangerous note */}
                    <div className="p-3.5 rounded-sm bg-rose-950/20 border border-rose-900/40 flex items-start gap-3">
                      <ShieldAlert className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-bold mb-0.5">
                          Threat Analysis
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {threat.whyItIsDangerous}
                        </p>
                      </div>
                    </div>

                    {/* Counter Items Section */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                        <Swords className="h-3.5 w-3.5 text-emerald-400" />
                        Recommended Counter Items & Execution
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {threat.counterItems.map((counter, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-sm border border-white/[0.08] bg-[#12141F] space-y-3 hover:border-white/20 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-14 overflow-hidden rounded-sm border border-white/20 flex-shrink-0 bg-black/60 shadow">
                                  <Image
                                    src={counter.itemImg}
                                    alt={counter.itemName}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                </div>
                                <div>
                                  <div className="text-xs sm:text-sm font-bold text-white">
                                    {counter.itemName}
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
                                    <Coins className="h-3 w-3" />
                                    <span>{counter.cost.toLocaleString()} Gold</span>
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                                  counter.type === "Hard Counter"
                                    ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                                    : counter.type === "Pro Positioning"
                                    ? "bg-purple-950/70 border-purple-800 text-purple-300"
                                    : "bg-sky-950/70 border-sky-800 text-sky-300"
                                }`}
                              >
                                {counter.type}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-2.5 rounded border border-white/[0.04]">
                              {counter.howToCounter}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Counter Heroes & Abilities */}
                    {threat.counterHeroAbilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                          Hero Spells & Innate Counters
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {threat.counterHeroAbilities.map((h, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-sm border border-white/[0.06] bg-black/30"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-white">{h.hero}</span>
                                <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60">
                                  {h.ability}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">{h.tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pro Tip Callout */}
                    <div className="p-3.5 rounded-sm bg-amber-950/20 border border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-200/90 font-mono">
                      <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300 mr-1.5">PRO TIP:</span>
                        <span>{threat.proTip}</span>
                      </div>
                    </div>
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
