"use client";

import Link from "next/link";
import { TournamentSummary } from "@/lib/opendota/tournaments-types";
import { Trophy, MapPin, Users, Swords, ExternalLink, ArrowRight, Radio } from "lucide-react";

interface FeaturedTournamentBannerProps {
  tournament: TournamentSummary;
}

export function FeaturedTournamentBanner({ tournament }: FeaturedTournamentBannerProps) {
  const isLive = tournament.status === "live";

  const cleanTitle = tournament.name;
  const cleanDesc = tournament.description || `Official competitive circuit championship for ${cleanTitle}.`;

  return (
    <div className="relative rounded-sm border border-rose-500/30 bg-gradient-to-r from-[#140A10] via-[#0E1019] to-[#0A0B12] p-6 sm:p-8 overflow-hidden shadow-2xl mb-8">
      {/* Background Ambience & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_40%,rgba(225,29,72,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-full bg-[radial-gradient(ellipse_50%_50%_at_80%_30%,rgba(245,158,11,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-rose-950/80 border border-rose-600/50 px-2.5 py-0.5 text-[10px] font-mono text-rose-300 uppercase tracking-widest font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>FEATURED CHAMPIONSHIP</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                isLive
                  ? "bg-rose-950 text-rose-400 border-rose-600/60"
                  : tournament.status === "upcoming"
                  ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                  : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
              }`}
            >
              {isLive && <Radio className="h-2.5 w-2.5 animate-pulse" />}
              <span>{tournament.status.toUpperCase()}</span>
            </span>

            <span className="rounded-sm bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
              {tournament.tier.toUpperCase()} TIER
            </span>
          </div>

          {/* Tournament Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white tracking-tight">
            {cleanTitle}
          </h2>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-2xl">
            {cleanDesc}
          </p>

          {/* Key Facts Pill Grid */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-300">
            {tournament.prizePool && (
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-zinc-400">Prize:</span>
                <strong className="text-white font-bold">{tournament.prizePool}</strong>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-zinc-400">Region:</span>
              <strong className="text-white">{tournament.region}</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
              <Users className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-zinc-400">Teams:</span>
              <strong className="text-white">{tournament.teamsCount}</strong>
            </div>

            {tournament.matchesCount > 0 && (
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                <Swords className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-400">Matches:</span>
                <strong className="text-white">{tournament.matchesCount}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 flex-shrink-0">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-b from-rose-600 to-rose-700 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_20px_-3px_rgba(225,29,72,0.5)] transition-all hover:from-rose-500 hover:to-rose-600 active:scale-[0.98]"
          >
            <span>View Tournament Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {tournament.officialWebsite && (
            <a
              href={tournament.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/[0.1] bg-black/50 px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/[0.25] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Official Event Hub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
