"use client";

import NextImage from "next/image";
import { TournamentStanding, TournamentTeam } from "@/lib/opendota/tournaments-types";
import { Users, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface LiquipediaGroupStageProps {
  standings: TournamentStanding[];
  teams: TournamentTeam[];
}

export function LiquipediaGroupStage({ standings, teams }: LiquipediaGroupStageProps) {
  // Use standings or build from teams
  const displayStandings = standings.length > 0 ? standings : teams.map((team, idx) => ({
    rank: idx + 1,
    team,
    matchesPlayed: team.wins + team.losses,
    wins: team.wins,
    losses: team.losses,
    winRate: team.wins + team.losses > 0 ? Number(((team.wins / (team.wins + team.losses)) * 100).toFixed(1)) : 50,
  }));

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-white flex items-center gap-2">
            <span>Group Stage Standings</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-normal">[edit]</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Swiss-system group circuit • Top 8 teams advance directly to Upper Bracket
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">UB Advance (1-8)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-zinc-300">LB Advance (9-16)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-zinc-300">Eliminated (17+)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-white/[0.08] bg-[#0E1017]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-wider bg-black/40">
              <th className="py-2.5 px-3 w-14 text-center">#</th>
              <th className="py-2.5 px-4">Team</th>
              <th className="py-2.5 px-3 text-center">Series (W-L)</th>
              <th className="py-2.5 px-3 text-center">Diff</th>
              <th className="py-2.5 px-3 text-right">Win Rate</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayStandings.map((s, idx) => {
              const rank = idx + 1;
              const isUB = rank <= 8;
              const isLB = rank > 8 && rank <= 16;
              const isElim = rank > 16;
              const diff = s.wins - s.losses;

              return (
                <tr
                  key={`${s.team.team_id}-${idx}`}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isUB
                      ? "border-l-2 border-l-emerald-500 bg-emerald-950/[0.05]"
                      : isLB
                      ? "border-l-2 border-l-amber-500 bg-amber-950/[0.03]"
                      : "border-l-2 border-l-rose-500/50"
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-bold text-white">{rank}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-5 w-5 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        {s.team.logo_url ? (
                          <NextImage
                            src={s.team.logo_url}
                            alt={s.team.name}
                            fill
                            unoptimized
                            sizes="20px"
                            className="object-contain p-0.5"
                          />
                        ) : (
                          <Users className="h-3 w-3 text-zinc-500" />
                        )}
                      </div>
                      <span className="font-bold text-white">{s.team.name}</span>
                      {s.team.tag && (
                        <span className="text-[10px] text-zinc-500 uppercase">({s.team.tag})</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-zinc-200">
                    <span className="text-emerald-400">{s.wins}</span> -{" "}
                    <span className="text-rose-400">{s.losses}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    <span className={diff > 0 ? "text-emerald-400" : diff < 0 ? "text-rose-400" : "text-zinc-400"}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={s.winRate >= 50 ? "text-emerald-400 font-bold" : "text-zinc-300 font-bold"}>
                      {s.winRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold border ${
                        isUB
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                          : isLB
                          ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                          : "bg-rose-950/80 text-rose-300 border-rose-700/60"
                      }`}
                    >
                      {isUB ? (
                        <>
                          <CheckCircle className="h-2.5 w-2.5 text-emerald-400" />
                          <span>Upper Bracket</span>
                        </>
                      ) : isLB ? (
                        <>
                          <AlertCircle className="h-2.5 w-2.5 text-amber-400" />
                          <span>Lower Bracket</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-2.5 w-2.5 text-rose-400" />
                          <span>Eliminated</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
