"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MechanicsCompendium } from "./MechanicsCompendium";
import { AttributesGuide } from "./AttributesGuide";
import { ItemCounterMatrix } from "./ItemCounterMatrix";
import { DispelsGuide } from "./DispelsGuide";
import { GameTimingsGuide } from "./GameTimingsGuide";
import { BookOpen, Sparkles, Shield, Clock, Swords } from "lucide-react";
import { AnimatedTabs, TabOption } from "@/components/ui/AnimatedTabs";

type LearnTabId = "mechanics" | "attributes" | "items" | "dispels" | "timings";

const LEARN_TABS: TabOption<LearnTabId>[] = [
  { id: "mechanics", label: "Game Mechanics", icon: BookOpen },
  { id: "attributes", label: "Attributes Guide", icon: Sparkles },
  { id: "items", label: "Item Counters Matrix", icon: Swords },
  { id: "dispels", label: "Dispels & Disables", icon: Shield },
  { id: "timings", label: "Clock Timings & Objectives", icon: Clock },
];

export function LearnDashboard() {
  const [activeTab, setActiveTab] = useState<LearnTabId>("mechanics");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dota 2 Mechanics & Tactical Learn Hub
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Master the deepest competitive mechanics in esports. Explore attribute formulas, counter-itemization strategies, dispel hierarchies, and match clock objectives.
          </p>
        </div>

        {/* Global Quick Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.04] p-2.5 rounded-sm border border-white/[0.06] flex-shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Patch 7.37e Reference</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="pb-2 border-b border-white/[0.06] overflow-x-auto no-scrollbar">
        <AnimatedTabs<LearnTabId>
          tabs={LEARN_TABS}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          layoutId="learnMainActiveTabPill"
          variant="segmented"
          size="md"
        />
      </div>

      {/* Tab Panels with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {activeTab === "mechanics" && <MechanicsCompendium />}
          {activeTab === "attributes" && <AttributesGuide />}
          {activeTab === "items" && <ItemCounterMatrix />}
          {activeTab === "dispels" && <DispelsGuide />}
          {activeTab === "timings" && <GameTimingsGuide />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

