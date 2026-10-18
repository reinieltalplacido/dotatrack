import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TournamentDetailView } from "@/components/tournaments/TournamentDetailView";
import { fetchTournamentDetail, TournamentTelemetryError } from "@/lib/opendota/tournaments";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return {
      title: "Tournament Details — DotaTrack",
      description: "Dota 2 competitive esports tournament details and match results.",
    };
  }

  try {
    const detail = await fetchTournamentDetail(numericId);
    return {
      title: `${detail.tournament.name} — DotaTrack Esports`,
      description: `Analyze ${detail.tournament.name}: ${detail.teams.length} teams, ${detail.matches.length} matches, standings, and competitive match results.`,
    };
  } catch {
    return {
      title: `Tournament #${id} — DotaTrack Esports`,
      description: `Dota 2 competitive tournament telemetry for event #${id}.`,
    };
  }
}

export default async function TournamentDetailPage({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    notFound();
  }

  try {
    const detail = await fetchTournamentDetail(numericId);

    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 esports-grid">
          <TournamentDetailView detail={detail} />
        </main>
        <Footer />
      </div>
    );
  } catch (error: unknown) {
    if (error instanceof TournamentTelemetryError && error.statusCode === 404) {
      notFound();
    }

    const message =
      error instanceof Error ? error.message : "Failed to load tournament details";

    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="tactical-panel max-w-lg w-full p-8 text-center rounded-sm border border-red-800/60 shadow-2xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 border border-red-600/40 text-red-400 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="inline-block rounded-sm bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 text-[11px] font-mono text-red-300 uppercase tracking-wider mb-2">
              [DETAILS_UNAVAILABLE]
            </div>

            <h1 className="text-xl font-mono font-bold text-white mb-2">
              Tournament Details Telemetry Error
            </h1>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">{message}</p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/tournaments/${id}`}
                className="inline-flex items-center gap-2 rounded-sm bg-rose-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-rose-500 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>RETRY QUERY</span>
              </Link>

              <Link
                href="/tournaments"
                className="inline-flex items-center gap-2 rounded-sm border border-white/[0.1] bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>BACK TO TOURNAMENTS</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
