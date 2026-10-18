"use client";

import Link from "next/link";
import { TournamentSummary } from "@/lib/opendota/tournaments-types";
import { Trophy, MapPin, Users, Swords, ArrowRight, Radio } from "lucide-react";

interface TournamentCardProps {
  tournament: TournamentSummary;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isLive = tournament.status === "live";
  const isUpcoming = tournament.status === "upcoming";
  const cleanTitle = tournament.name;

  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      aria-label={`View tournament ${cleanTitle}`}
      className="group relative flex flex-col justify-between rounded-sm border border-white/[0.08] bg-[#0D0F18] p-5 transition-all duration-200 hover:border-rose-500/50 hover:bg-[#121422] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                isLive
                  ? "bg-rose-950 text-rose-300 border-rose-600/70 shadow-sm"
                  : isUpcoming
                  ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                  : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
              }`}
            >
              {isLive && <Radio className="h-2 w-2 animate-pulse text-rose-400" />}
              <span>{tournament.status.toUpperCase()}</span>
            </span>

            <span className="rounded-sm bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400 uppercase">
              {tournament.tier}
            </span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            #{tournament.id}
          </span>
        </div>

        {/* Tournament Name */}
        <h3 className="font-mono text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 mb-2">
          {cleanTitle}
        </h3>

        {/* Organizer & Region */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-4">
          <MapPin className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
          <span className="truncate">{tournament.region}</span>
          <span className="text-zinc-600">•</span>
          <span className="truncate text-zinc-500">{tournament.organizer}</span>
        </div>
      </div>

      {/* Stats Grid & Action Link */}
      <div className="pt-3 border-t border-white/[0.04] space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* Prize Pool */}
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/[0.04] px-2.5 py-1.5 rounded">
            <Trophy className="h-3 w-3 text-amber-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[9px] text-zinc-500 block uppercase">Prize Pool</span>
              <span className="text-xs font-bold text-white truncate block">
                {tournament.prizePool || "Official Circuit"}
              </span>
            </div>
          </div>

          {/* Teams Count */}
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/[0.04] px-2.5 py-1.5 rounded">
            <Users className="h-3 w-3 text-sky-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[9px] text-zinc-500 block uppercase">Teams</span>
              <span className="text-xs font-bold text-white truncate block">
                {tournament.teamsCount} Teams
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="flex items-center justify-between text-xs font-mono pt-1 text-zinc-400 group-hover:text-white">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Swords className="h-3 w-3 text-zinc-400" />
            <span>{tournament.matchesCount} matches</span>
          </div>

          <span className="inline-flex items-center gap-1 font-bold text-rose-400 group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
