import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Flame, Construction } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Heroes — DotaTrack",
  description: "Dota 2 hero matrix, win rates, and talent telemetry.",
};

export default function HeroesPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="tactical-panel max-w-xl w-full p-8 text-center rounded-sm border border-white/[0.08] shadow-2xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 mb-5">
            <Flame className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-sm bg-rose-950/80 border border-rose-800/60 px-2.5 py-0.5 text-[11px] font-mono text-rose-300 uppercase tracking-wider mb-3">
            <Construction className="h-3 w-3" />
            <span>MODULE INITIALIZING</span>
          </div>

          <h1 className="text-2xl font-mono font-black text-white mb-2">
            Hero Compendium &amp; Matrix
          </h1>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
            Detailed Dota 2 hero meta statistics, talent win rate trees, facet picks, and item synergies will be available here.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-white/[0.1] bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white hover:border-rose-500/50 transition-colors"
          >
            <span>&larr; BACK TO OVERVIEW</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
