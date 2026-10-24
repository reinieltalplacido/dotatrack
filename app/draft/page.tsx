import { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DraftSimulator } from "@/components/draft/DraftSimulator";
import { fetchHeroStatsData } from "@/lib/opendota/hero-stats";
import { HeroCompendiumPayload } from "@/lib/opendota/hero-types";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Draft Assistant & Counter Engine — DotaTrack",
  description:
    "Competitive 5v5 Dota 2 drafting assistant. Evaluate team synergy, diagnose composition voids, and receive live algorithmic counter-pick recommendations.",
};

function DraftSkeleton() {
  return (
    <div className="tactical-panel p-12 text-center rounded-sm border border-white/[0.08] bg-[#0A0C14]">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/40 border border-rose-500/20 text-rose-400 mb-3 animate-spin">
        <Loader2 className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
        Loading Draft Engine &amp; Hero Pool...
      </h3>
      <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
        Initializing 127 heroes, role models, and counter matrix...
      </p>
    </div>
  );
}

async function DraftContent() {
  await connection();

  let data: HeroCompendiumPayload | null = null;
  let errorMessage: string | null = null;

  try {
    data = await fetchHeroStatsData();
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Failed to load draft hero database";
  }

  if (errorMessage || !data) {
    return (
      <div className="tactical-panel max-w-lg mx-auto p-8 text-center rounded-sm border border-red-800/60 shadow-2xl">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 border border-red-600/40 text-red-400 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="inline-block rounded-sm bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 text-[11px] font-mono text-red-300 uppercase tracking-wider mb-2">
          [DRAFT_ENGINE_ERROR]
        </div>

        <h1 className="text-xl font-mono font-bold text-white mb-2">
          Draft Assistant Unavailable
        </h1>

        <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
          {errorMessage}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/draft"
            className="inline-flex items-center gap-2 rounded-sm bg-rose-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-rose-500 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>RETRY</span>
          </Link>
        </div>
      </div>
    );
  }

  return <DraftSimulator allHeroes={data.heroes} />;
}

export default function DraftPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1560px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<DraftSkeleton />}>
            <DraftContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
