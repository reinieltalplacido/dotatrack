"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Swords,
  Flame,
  Activity,
  Users,
  UserCheck,
  Search,
  X,
} from "lucide-react";
import { PlayerDashboardData } from "@/lib/opendota/types";
import { PlayerHeader } from "./PlayerHeader";
import { PlayerTabs, PlayerTabType, TabItem } from "./PlayerTabs";
import { OverviewTab } from "./OverviewTab";
import { MatchesTab } from "./MatchesTab";
import { HeroesTab } from "./HeroesTab";
import { PerformanceTab } from "./PerformanceTab";
import { MatchupsTab } from "./MatchupsTab";
import { TeammatesTab } from "./TeammatesTab";
import { SteamIdSearch } from "../SteamIdSearch";

interface PlayerDashboardProps {
  initialData: PlayerDashboardData;
}

export function PlayerDashboard({ initialData }: PlayerDashboardProps) {
  const [activeTab, setActiveTab] = useState<PlayerTabType>("overview");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [teammatesCount, setTeammatesCount] = useState<number | undefined>(
    initialData.peers && initialData.peers.length > 0 ? initialData.peers.length : undefined
  );

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "matches",
      label: "Matches",
      icon: Swords,
      count: initialData.recentMatches.length,
    },
    {
      id: "heroes",
      label: "Heroes",
      icon: Flame,
      count: initialData.allHeroes.length,
    },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "matchups", label: "Matchups", icon: Users },
    {
      id: "teammates",
      label: "Teammates",
      icon: UserCheck,
      count: teammatesCount,
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col">
      {/* Player Profile Header */}
      <PlayerHeader
        data={initialData}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Navigation Tabs Bar with Sliding Indicator */}
      <PlayerTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Main Tab Content Viewport with Motion */}
      <main className="flex-1 mx-auto max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === "overview" && (
              <OverviewTab
                data={initialData}
                onNavigateToMatches={() => setActiveTab("matches")}
                onNavigateToHeroes={() => setActiveTab("heroes")}
              />
            )}

            {activeTab === "matches" && (
              <MatchesTab matches={initialData.recentMatches} />
            )}

            {activeTab === "heroes" && (
              <HeroesTab heroes={initialData.allHeroes} />
            )}

            {activeTab === "performance" && (
              <PerformanceTab data={initialData} />
            )}

            {activeTab === "matchups" && (
              <MatchupsTab data={initialData} />
            )}

            {activeTab === "teammates" && (
              <TeammatesTab
                data={initialData}
                onTeammatesLoaded={(count) => setTeammatesCount(count)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quick Search Another Player Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl rounded-sm border border-white/[0.15] bg-[#0E1017] p-6 shadow-2xl relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Track Another Player
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <SteamIdSearch onSearchSubmit={() => setSearchModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
