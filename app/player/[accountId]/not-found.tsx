import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SteamIdSearch } from "@/components/SteamIdSearch";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="tactical-panel max-w-xl w-full p-8 text-center rounded-sm border border-white/[0.08] shadow-2xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 mb-5">
            <UserX className="h-8 w-8" />
          </div>

          <div className="inline-block rounded-sm bg-rose-950/80 border border-rose-800/60 px-2.5 py-0.5 text-[11px] font-mono text-rose-300 uppercase tracking-wider mb-3">
            [404 — PROFILE NOT FOUND]
          </div>

          <h1 className="text-2xl font-mono font-black text-white mb-2">
            No Match Telemetry Found
          </h1>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
            The requested Steam account either does not exist, has never played Dota 2, or has &quot;Expose Public Match Data&quot; disabled in Dota 2 account settings.
          </p>

          <div className="mb-6 pt-4 border-t border-white/[0.06]">
            <SteamIdSearch />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white hover:border-rose-500/50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-rose-500" />
            <span>BACK TO HOME</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
