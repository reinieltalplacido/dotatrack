import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { fetchOpenDotaPlayerData, OpenDotaError } from "@/lib/opendota/client";
import { PlayerDashboardData } from "@/lib/opendota/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlayerDashboard } from "@/components/player/PlayerDashboard";

interface PageProps {
  params: Promise<{ accountId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { accountId } = await params;

  if (!accountId || !/^\d+$/.test(accountId)) {
    return {
      title: "Player Profile — DotaTrack",
      description: "Dota 2 player stats and match analytics.",
    };
  }

  try {
    const data = await fetchOpenDotaPlayerData(accountId);
    const title = data.proName
      ? `${data.personaname} (${data.proName}) — DotaTrack Profile`
      : `${data.personaname} — DotaTrack Profile`;

    return {
      title,
      description: `Analyze ${data.personaname}'s Dota 2 statistics: ${data.lifetime.totalMatches.toLocaleString()} matches, ${data.lifetime.winRate}% win rate, and recent match performance.`,
    };
  } catch {
    return {
      title: `Player #${accountId} — DotaTrack Profile`,
      description: `Dota 2 player profile for account #${accountId}.`,
    };
  }
}

export default async function PlayerPage({ params }: PageProps) {
  await connection();
  const { accountId } = await params;

  // Validate format
  if (!accountId || !/^\d+$/.test(accountId)) {
    notFound();
  }

  let data: PlayerDashboardData | null = null;
  let fetchError: OpenDotaError | Error | null = null;

  try {
    data = await fetchOpenDotaPlayerData(accountId);
  } catch (err: unknown) {
    if (err instanceof OpenDotaError) {
      if (err.statusCode === 404) {
        notFound();
      }
      fetchError = err;
    } else {
      fetchError = err instanceof Error ? err : new Error("Unknown error");
    }
  }

  if (fetchError || !data) {
    const isRateLimited =
      fetchError instanceof OpenDotaError && fetchError.statusCode === 429;
    const errorMessage =
      fetchError?.message || "An error occurred while loading this player profile.";

    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="tactical-panel max-w-lg w-full p-8 text-center rounded-sm border border-red-800/60 shadow-2xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 border border-red-600/40 text-red-400 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="inline-block rounded-sm bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 text-[11px] font-mono text-red-300 uppercase tracking-wider mb-2">
              [{isRateLimited ? "RATE_LIMIT_EXCEEDED" : "SERVICE_UNAVAILABLE"}]
            </div>

            <h1 className="text-xl font-mono font-bold text-white mb-2">
              {isRateLimited
                ? "OpenDota Rate Limit Reached"
                : "Stats Service Unavailable"}
            </h1>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
              {errorMessage}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/player/${accountId}`}
                className="inline-flex items-center gap-2 rounded-sm bg-rose-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-rose-500 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>RETRY</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-sm border border-white/[0.1] bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>BACK TO HOME</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PlayerDashboard initialData={data} />
      </main>
      <Footer />
    </div>
  );
}
