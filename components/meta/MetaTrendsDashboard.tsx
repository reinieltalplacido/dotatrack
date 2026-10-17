"use client";

import { useState, useCallback } from "react";
import { MetaTrendsPayload, MetaRankBracket } from "@/lib/opendota/meta-types";
import { MetaOverviewHeader } from "./MetaOverviewHeader";
import { MetaStatCards } from "./MetaStatCards";
import { MetaScatterChart } from "./MetaScatterChart";
import { HeroMetaTierList } from "./HeroMetaTierList";
import { MetaShiftsTracker } from "./MetaShiftsTracker";
import { AlertCircle, RefreshCw } from "lucide-react";

interface MetaTrendsDashboardProps {
  initialData: MetaTrendsPayload;
}

export function MetaTrendsDashboard({ initialData }: MetaTrendsDashboardProps) {
  const [data, setData] = useState<MetaTrendsPayload>(initialData);
  const [selectedBracket, setSelectedBracket] = useState<MetaRankBracket>(
    initialData.overview.selectedBracketId || "all"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch telemetry for selected bracket or manual refresh
  const loadBracketData = useCallback(async (bracket: MetaRankBracket) => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`/api/meta-trends?bracket=${bracket}`);
      if (!res.ok) {
        throw new Error(`Upstream telemetry service returned status ${res.status}`);
      }
      const json: MetaTrendsPayload = await res.json();
      setData(json);
      setSelectedBracket(bracket);
    } catch (err) {
      console.error("[MetaTrends] Failed to switch bracket:", err);
      setFetchError(
        err instanceof Error ? err.message : "Failed to update meta data for selected bracket"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectBracket = (bracket: MetaRankBracket) => {
    if (bracket === selectedBracket && !isLoading) return;
    loadBracketData(bracket);
  };

  const handleRefresh = () => {
    loadBracketData(selectedBracket);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Error notification banner if bracket fetch failed */}
      {fetchError && (
        <div className="mb-6 p-4 rounded-sm bg-red-950/80 border border-red-700/60 flex items-center justify-between gap-4 text-xs font-mono text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>
              Could not refresh bracket data: {fetchError}. Preserving previous telemetry cache.
            </span>
          </div>
          <button
            onClick={() => setFetchError(null)}
            className="text-[11px] underline hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header with rank tabs, patch badge, and refresh */}
      <MetaOverviewHeader
        currentPatch={data.currentPatch}
        selectedBracket={selectedBracket}
        onSelectBracket={handleSelectBracket}
        availableBrackets={data.availableBrackets}
        lastUpdated={data.overview.lastUpdated}
        source={data.overview.source}
        isCached={data.isCached}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      {/* 4 Primary Stat Cards */}
      <MetaStatCards overview={data.overview} />

      {/* Performance Matrix Scatter Plot & Leaders */}
      <MetaScatterChart
        heroes={data.heroes}
        totalMatches={data.overview.totalMatches}
      />

      {/* Actual Win Rate Shifts & Historical Trends */}
      <MetaShiftsTracker
        heroes={data.heroes}
        deltaPeriodLabel={data.deltaPeriodLabel}
        snapshotCollectionStartedAt={data.snapshotCollectionStartedAt}
        historicalSnapshotsCount={data.historicalSnapshotsCount}
        isSnapshotDeltaAvailable={data.isSnapshotDeltaAvailable}
        currentPatchName={data.currentPatch.name}
      />

      {/* Hero Meta Tier List */}
      <HeroMetaTierList
        heroes={data.heroes}
        selectedBracketName={data.overview.selectedBracketName}
      />
    </div>
  );
}
