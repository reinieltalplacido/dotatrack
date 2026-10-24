"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTabs, TabOption } from "@/components/ui/AnimatedTabs";
import {
  Table,
  Swords,
  ShoppingCart,
  TrendingUp,
  Skull,
  Coins,
  Trophy,
  BarChart3,
  AlertCircle,
  Eye,
} from "lucide-react";
import { NormalizedMatchData } from "@/lib/opendota/match-types";
import { MatchSearchHeader } from "./MatchSearchHeader";
import { MatchOverviewBanner } from "./MatchOverviewBanner";
import { MatchScoreboard } from "./MatchScoreboard";
import { MatchLaneAnalysis } from "./MatchLaneAnalysis";
import { MatchItemTimeline } from "./MatchItemTimeline";
import { MatchAdvantageChart } from "./MatchAdvantageChart";
import { MatchCombatTimeline } from "./MatchCombatTimeline";
import { MatchHeroNetWorthChart } from "./MatchHeroNetWorthChart";
import { MatchObjectivesTimeline } from "./MatchObjectivesTimeline";
import { MatchAdvancedStats } from "./MatchAdvancedStats";
import { MatchWardMap } from "./MatchWardMap";
import { MatchSkeleton } from "./MatchSkeleton";

interface MatchAnalyzerDashboardProps {
  initialId?: string;
  initialMatch?: NormalizedMatchData | null;
  initialError?: string | null;
}

type AnalysisTab =
  | "scoreboard"
  | "lanes"
  | "items"
  | "graphs"
  | "combat"
  | "networth"
  | "objectives"
  | "vision"
  | "advanced";

export function MatchAnalyzerDashboard({ initialId, initialMatch, initialError }: MatchAnalyzerDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams?.get("id")?.trim() || initialId || "";

  const [match, setMatch] = useState<NormalizedMatchData | null>(initialMatch || null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("scoreboard");
  const [isLoading, setIsLoading] = useState<boolean>(!initialMatch && Boolean(urlId));
  const [error, setError] = useState<string | null>(initialError || null);

  const handleSearch = useCallback(async (matchId: string) => {
    const cleanId = matchId.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/matches/${cleanId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to fetch match ${cleanId}`);
      }

      setMatch(data);
      // Update browser URL query param without full reload
      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.get("id") !== cleanId) {
          currentUrl.searchParams.set("id", cleanId);
          window.history.pushState(null, "", currentUrl.toString());
        }
      }
    } catch (err) {
      console.error("[MatchAnalyzer] Fetch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load match details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync initialMatch if updated from server or props
  useEffect(() => {
    if (initialMatch) {
      setMatch(initialMatch);
      setIsLoading(false);
      setError(null);
    }
  }, [initialMatch]);

  // Sync initialError
  useEffect(() => {
    if (initialError && !match) {
      setError(initialError);
      setIsLoading(false);
    }
  }, [initialError, match]);

  // Automatically fetch match data if an ID is present in URL or props and not yet loaded
  useEffect(() => {
    if (!urlId) return;

    // Already loaded
    if (match?.matchId === urlId) {
      setIsLoading(false);
      return;
    }

    // Server-provided initial match matches
    if (initialMatch?.matchId === urlId) {
      setMatch(initialMatch);
      setIsLoading(false);
      return;
    }

    // Trigger auto-fetch
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/matches/${urlId}`)
      .then(async (res) => {
        const data = await res.json();
        if (isCancelled) return;
        if (!res.ok) {
          throw new Error(data.error || `Failed to fetch match ${urlId}`);
        }
        setMatch(data);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error("[MatchAnalyzer] Auto-load failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load match details");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [urlId, match?.matchId, initialMatch]);

  return (
    <div className="max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Match Search Input */}
      <MatchSearchHeader
        currentMatchId={match?.matchId || urlId}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="mb-8 p-4 rounded-sm bg-rose-950/80 border border-rose-700/60 flex items-center justify-between gap-4 text-xs font-mono text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-[11px] underline hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <MatchSkeleton />
      ) : match ? (
        <>
          {/* Match Overview Banner */}
          <MatchOverviewBanner
            match={match}
            onRefresh={() => handleSearch(match.matchId)}
            onMatchUpdated={(updated) => setMatch(updated)}
          />

          {/* Analysis Navigation Tabs */}
          <div className="mb-8 border-b border-white/[0.08] pb-3 overflow-x-auto no-scrollbar">
            <AnimatedTabs<AnalysisTab>
              tabs={[
                { id: "scoreboard", label: "Scoreboard", icon: Table },
                { id: "lanes", label: "Lane Analysis", icon: Swords },
                { id: "items", label: "Item Timings", icon: ShoppingCart },
                { id: "graphs", label: "Gold & XP Graphs", icon: TrendingUp },
                { id: "combat", label: "Combat Log", icon: Skull },
                { id: "networth", label: "Hero Net Worth", icon: Coins },
                { id: "objectives", label: "Objectives", icon: Trophy },
                { id: "vision", label: "Vision & Wards", icon: Eye },
                { id: "advanced", label: "Advanced Metrics", icon: BarChart3 },
              ]}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId)}
              layoutId="matchAnalyzerActiveTabPill"
              variant="segmented"
              size="md"
            />
          </div>

          {/* Active Tab View with Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "scoreboard" && (
                <MatchScoreboard
                  radiantPlayers={match.radiantPlayers}
                  direPlayers={match.direPlayers}
                  radiantScore={match.radiantScore}
                  direScore={match.direScore}
                  radiantWin={match.radiantWin}
                />
              )}

              {activeTab === "lanes" && (
                <MatchLaneAnalysis
                  lanePairings={match.lanePairings}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "items" && (
                <MatchItemTimeline
                  players={match.allPlayers}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "graphs" && (
                <MatchAdvantageChart
                  goldTimeline={match.goldAdvantageTimeline}
                  xpTimeline={match.xpAdvantageTimeline}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "combat" && (
                <MatchCombatTimeline
                  killEvents={match.killEvents}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "networth" && (
                <MatchHeroNetWorthChart
                  players={match.allPlayers}
                  durationSeconds={match.durationSeconds}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "objectives" && (
                <MatchObjectivesTimeline
                  objectives={match.objectives}
                  isParsed={match.isParsed}
                />
              )}

              {activeTab === "vision" && (
                <MatchWardMap
                  wards={match.wards || []}
                  durationSeconds={match.durationSeconds}
                  isParsed={match.isParsed}
                  objectives={match.objectives}
                />
              )}

              {activeTab === "advanced" && (
                <MatchAdvancedStats players={match.allPlayers} />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}
