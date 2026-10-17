"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { MatchSkeleton } from "./MatchSkeleton";

interface MatchAnalyzerDashboardProps {
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
  | "advanced";

export function MatchAnalyzerDashboard({ initialMatch, initialError }: MatchAnalyzerDashboardProps) {
  const router = useRouter();
  const [match, setMatch] = useState<NormalizedMatchData | null>(initialMatch || null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("scoreboard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const handleSearch = useCallback(async (matchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/matches/${matchId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to fetch match ${matchId}`);
      }

      setMatch(data);
      // Update browser URL query param without full reload
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `/match-data?id=${matchId}`);
      }
    } catch (err) {
      console.error("[MatchAnalyzer] Fetch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load match telemetry");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Match Search Input */}
      <MatchSearchHeader
        currentMatchId={match?.matchId}
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
          <div className="flex flex-wrap items-center gap-1.5 mb-8 border-b border-white/[0.08] pb-3 text-xs font-mono">
            <TabButton
              active={activeTab === "scoreboard"}
              onClick={() => setActiveTab("scoreboard")}
              icon={<Table className="h-3.5 w-3.5" />}
              label="Scoreboard"
            />
            <TabButton
              active={activeTab === "lanes"}
              onClick={() => setActiveTab("lanes")}
              icon={<Swords className="h-3.5 w-3.5" />}
              label="Lane Analysis"
            />
            <TabButton
              active={activeTab === "items"}
              onClick={() => setActiveTab("items")}
              icon={<ShoppingCart className="h-3.5 w-3.5" />}
              label="Item Timings"
            />
            <TabButton
              active={activeTab === "graphs"}
              onClick={() => setActiveTab("graphs")}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Gold &amp; XP Graphs"
            />
            <TabButton
              active={activeTab === "combat"}
              onClick={() => setActiveTab("combat")}
              icon={<Skull className="h-3.5 w-3.5" />}
              label="Combat Log"
            />
            <TabButton
              active={activeTab === "networth"}
              onClick={() => setActiveTab("networth")}
              icon={<Coins className="h-3.5 w-3.5" />}
              label="Hero Net Worth"
            />
            <TabButton
              active={activeTab === "objectives"}
              onClick={() => setActiveTab("objectives")}
              icon={<Trophy className="h-3.5 w-3.5" />}
              label="Objectives"
            />
            <TabButton
              active={activeTab === "advanced"}
              onClick={() => setActiveTab("advanced")}
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              label="Advanced Metrics"
            />
          </div>

          {/* Active Tab View */}
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

          {activeTab === "advanced" && (
            <MatchAdvancedStats players={match.allPlayers} />
          )}
        </>
      ) : null}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
        active
          ? "bg-rose-600 text-white font-bold border-rose-500 shadow-md shadow-rose-950/50"
          : "bg-zinc-950/80 text-zinc-400 hover:text-white border-white/[0.06] hover:border-white/[0.15]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
