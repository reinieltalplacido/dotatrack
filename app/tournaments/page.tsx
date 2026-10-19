import { Metadata } from "next";
import { connection } from "next/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TournamentsHub } from "@/components/tournaments/TournamentsHub";
import { fetchTournamentsList } from "@/lib/opendota/tournaments";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tournaments & Competitive Esports Hub — DotaTrack",
  description:
    "Explore premier Dota 2 championships, live pro matches, schedules, team standings, and prize pools.",
};

export default async function TournamentsPage() {
  await connection();

  try {
    const data = await fetchTournamentsList();

    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 esports-grid">
          <TournamentsHub initialData={data} />
        </main>
        <Footer />
      </div>
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load tournament data";

    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="tactical-panel max-w-lg w-full p-8 text-center rounded-sm border border-red-800/60 shadow-2xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 border border-red-600/40 text-red-400 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="inline-block rounded-sm bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 text-[11px] font-mono text-red-300 uppercase tracking-wider mb-2">
              [TOURNAMENTS_OFFLINE]
            </div>

            <h1 className="text-xl font-mono font-bold text-white mb-2">
              Tournaments Unavailable
            </h1>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">{message}</p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tournaments"
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
                <span>BACK TO OVERVIEW</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
