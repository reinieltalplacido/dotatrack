import { Metadata } from "next";
import { connection } from "next/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MatchAnalyzerDashboard } from "@/components/match/MatchAnalyzerDashboard";
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

const DEFAULT_SAMPLE_MATCH_ID = "9049003291";

export default async function MatchDataPage({ searchParams }: MatchDataPageProps) {
  await connection();

  const { id } = await searchParams;
  const targetId = id?.trim() || DEFAULT_SAMPLE_MATCH_ID;

  let initialMatch: NormalizedMatchData | null = null;
  let initialError: string | null = null;

  try {
    initialMatch = await getMatchAnalysis(targetId);
  } catch (err) {
    console.warn(`[MatchDataPage] Failed to prefetch match ${targetId}:`, err);
    initialError = err instanceof Error ? err.message : "Failed to load match analysis";
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid">
        <MatchAnalyzerDashboard
          initialMatch={initialMatch}
          initialError={initialError}
        />
      </main>
      <Footer />
    </div>
  );
}
