import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MatchAnalyzerDashboard } from "@/components/match/MatchAnalyzerDashboard";
import { MatchSkeleton } from "@/components/match/MatchSkeleton";
import { getMatchAnalysis } from "@/lib/opendota/match-service";
import { NormalizedMatchData } from "@/lib/opendota/match-types";

export const metadata: Metadata = {
  title: "Advanced Match Analyzer — DotaTrack",
  description:
    "Detailed Dota 2 match analysis: scoreboards, lane matchups, item timings, ability progressions, gold & XP advantage curves, and teamfight breakdowns.",
};

interface MatchDataPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function MatchDataPage({ searchParams }: MatchDataPageProps) {
  const { id } = await searchParams;
  const targetId = id?.trim();

  let initialMatch: NormalizedMatchData | null = null;
  let initialError: string | null = null;

  if (targetId) {
    try {
      initialMatch = await getMatchAnalysis(targetId);
    } catch (err) {
      console.warn(`[MatchDataPage] Failed to prefetch match ${targetId}:`, err);
      initialError = err instanceof Error ? err.message : "Failed to load match analysis";
    }
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid">
        <Suspense
          fallback={
            <div className="max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              <MatchSkeleton />
            </div>
          }
        >
          <MatchAnalyzerDashboard
            initialId={targetId}
            initialMatch={initialMatch}
            initialError={initialError}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
