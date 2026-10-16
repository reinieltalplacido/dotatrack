import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Swords, Construction } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Match Data — DotaTrack",
  description: "Global Dota 2 match explorer, high-MMR public telemetry, and replay archive.",
};

export default function MatchDataPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="tactical-panel max-w-xl w-full p-8 text-center rounded-sm border border-white/[0.08] shadow-2xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-400 mb-5">
            <Swords className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-sm bg-blue-950/80 border border-blue-800/60 px-2.5 py-0.5 text-[11px] font-mono text-blue-300 uppercase tracking-wider mb-3">
            <Construction className="h-3 w-3" />
            <span>MODULE INITIALIZING</span>
          </div>

          <h1 className="text-2xl font-mono font-black text-white mb-2">
            Global Match Data Explorer
          </h1>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
            Search individual match IDs, inspect teamfight item progression timelines, gold advantage graphs, and parsed combat telemetry.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-white/[0.1] bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white hover:border-blue-500/50 transition-colors"
          >
            <span>&larr; BACK TO OVERVIEW</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
