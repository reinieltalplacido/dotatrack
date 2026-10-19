"use client";

import { useState } from "react";
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

type TabType = "overview" | "matches" | "heroes" | "performance" | "matchups" | "teammates";

export function PlayerDashboard({ initialData }: PlayerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [teammatesCount, setTeammatesCount] = useState<number | undefined>(
    initialData.peers && initialData.peers.length > 0 ? initialData.peers.length : undefined
  );

  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
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

      {/* Navigation Tabs Bar */}
      <div className="sticky top-16 z-30 border-b border-white/[0.08] bg-[#0A0C13]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Player Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md shadow-rose-950/80"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                        isActive
                          ? "bg-black/30 text-rose-100"
                          : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab Content Viewport */}
      <main className="flex-1 mx-auto max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] w-full px-4 sm:px-6 lg:px-8 py-8">
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
