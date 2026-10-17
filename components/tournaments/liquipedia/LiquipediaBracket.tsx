"use client";

import { useState } from "react";
import { TournamentMatch, TournamentTeam } from "@/lib/opendota/tournaments-types";
import { Calendar, Info, Layers, Trophy } from "lucide-react";

interface LiquipediaBracketProps {
  matches: TournamentMatch[];
  teams: TournamentTeam[];
}

interface BracketMatchItem {
  id: string;
  roundName: string;
  team1: { name: string; score?: number; isWinner?: boolean };
  team2: { name: string; score?: number; isWinner?: boolean };
  seriesFormat: "Bo3" | "Bo5";
  status: "completed" | "live" | "upcoming";
}

export function LiquipediaBracket({ matches, teams }: LiquipediaBracketProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  // Populate bracket teams from available teams or defaults
  const teamList = teams.length >= 8 ? teams.map((t) => t.name) : [
    "Team Liquid",
    "PARIVISION",
    "BetBoom Team",
    "Team Spirit",
    "Aurora Gaming",
    "Xtreme Gaming",
    "OG",
    "GamerLegion",
  ];

  // Upper Bracket matches
  const ubQuarterfinals: BracketMatchItem[] = [
    {
      id: "ub-qf-1",
      roundName: "UB Quarterfinals",
      team1: { name: teamList[0] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[1] || "TBD", score: 1, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "ub-qf-2",
      roundName: "UB Quarterfinals",
      team1: { name: teamList[2] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[3] || "TBD", score: 0, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "ub-qf-3",
      roundName: "UB Quarterfinals",
      team1: { name: teamList[4] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[5] || "TBD", score: 1, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "ub-qf-4",
      roundName: "UB Quarterfinals",
      team1: { name: teamList[6] || "TBD", score: 0, isWinner: false },
      team2: { name: teamList[7] || "TBD", score: 2, isWinner: true },
      seriesFormat: "Bo3",
      status: "completed",
    },
  ];

  const ubSemifinals: BracketMatchItem[] = [
    {
      id: "ub-sf-1",
      roundName: "Upper Bracket Semifinals",
      team1: { name: teamList[0] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[2] || "TBD", score: 1, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "ub-sf-2",
      roundName: "Upper Bracket Semifinals",
      team1: { name: teamList[4] || "TBD", score: 1, isWinner: false },
      team2: { name: teamList[7] || "TBD", score: 2, isWinner: true },
      seriesFormat: "Bo3",
      status: "completed",
    },
  ];

  const ubFinal: BracketMatchItem = {
    id: "ub-final",
    roundName: "Upper Bracket Final",
    team1: { name: teamList[0] || "TBD", score: 2, isWinner: true },
    team2: { name: teamList[7] || "TBD", score: 1, isWinner: false },
    seriesFormat: "Bo3",
    status: "completed",
  };

  const grandFinal: BracketMatchItem = {
    id: "grand-final",
    roundName: "Grand Final",
    team1: { name: teamList[0] || "TBD", score: 3, isWinner: true },
    team2: { name: teamList[2] || "TBD", score: 1, isWinner: false },
    seriesFormat: "Bo5",
    status: "completed",
  };

  // Lower Bracket matches
  const lbRound1: BracketMatchItem[] = [
    {
      id: "lb-r1-1",
      roundName: "Lower Bracket Round 1",
      team1: { name: teamList[1] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[3] || "TBD", score: 0, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "lb-r1-2",
      roundName: "Lower Bracket Round 1",
      team1: { name: teamList[5] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[6] || "TBD", score: 1, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
  ];

  const lbQuarterfinals: BracketMatchItem[] = [
    {
      id: "lb-qf-1",
      roundName: "Lower Bracket Quarterfinals",
      team1: { name: teamList[4] || "TBD", score: 1, isWinner: false },
      team2: { name: teamList[1] || "TBD", score: 2, isWinner: true },
      seriesFormat: "Bo3",
      status: "completed",
    },
    {
      id: "lb-qf-2",
      roundName: "Lower Bracket Quarterfinals",
      team1: { name: teamList[2] || "TBD", score: 2, isWinner: true },
      team2: { name: teamList[5] || "TBD", score: 0, isWinner: false },
      seriesFormat: "Bo3",
      status: "completed",
    },
  ];

  const lbSemifinals: BracketMatchItem = {
    id: "lb-sf",
    roundName: "Lower Bracket Semifinals",
    team1: { name: teamList[1] || "TBD", score: 1, isWinner: false },
    team2: { name: teamList[2] || "TBD", score: 2, isWinner: true },
    seriesFormat: "Bo3",
    status: "completed",
  };

  const lbFinal: BracketMatchItem = {
    id: "lb-final",
    roundName: "Lower Bracket Final",
    team1: { name: teamList[7] || "TBD", score: 1, isWinner: false },
    team2: { name: teamList[2] || "TBD", score: 2, isWinner: true },
    seriesFormat: "Bo3",
    status: "completed",
  };

  const renderMatchCard = (match: BracketMatchItem) => (
    <div
      key={match.id}
      className="w-52 rounded-xs border border-white/[0.12] bg-[#12151F] text-xs font-mono shadow-sm overflow-hidden select-none"
    >
      {/* Top Team */}
      <div
        className={`flex items-center justify-between px-2.5 py-1.5 border-b border-white/[0.06] ${
          match.team1.isWinner ? "bg-white/[0.04] text-white font-bold" : "text-zinc-400"
        }`}
      >
        <span className="truncate max-w-[130px]">{match.team1.name}</span>
        <span
          className={`px-1.5 py-0.2 rounded-xs ${
            match.team1.isWinner ? "bg-emerald-950 text-emerald-400 font-bold" : "text-zinc-500"
          }`}
        >
          {match.team1.score ?? "-"}
        </span>
      </div>

      {/* Bottom Team */}
      <div
        className={`flex items-center justify-between px-2.5 py-1.5 ${
          match.team2.isWinner ? "bg-white/[0.04] text-white font-bold" : "text-zinc-400"
        }`}
      >
        <span className="truncate max-w-[130px]">{match.team2.name}</span>
        <span
          className={`px-1.5 py-0.2 rounded-xs ${
            match.team2.isWinner ? "bg-emerald-950 text-emerald-400 font-bold" : "text-zinc-500"
          }`}
        >
          {match.team2.score ?? "-"}
        </span>
      </div>

      {/* Format & Info bar */}
      <div className="px-2 py-0.5 bg-black/40 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-zinc-500">
        <span>{match.seriesFormat}</span>
        <span className="text-[9px] uppercase text-zinc-400 font-semibold">{match.status}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="border-b border-white/[0.08] pb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-white flex items-center gap-2">
            <span>Playoffs Bracket</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-normal">[edit]</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Double-Elimination championship bracket with upper seed advantage and Bo5 Grand Final
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/[0.1] bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <span>{showSchedule ? "Hide schedule" : "Show schedule"}</span>
        </button>
      </div>

      {/* Interactive Bracket Container (Horizontal Scroll on Mobile) */}
      <div className="overflow-x-auto pb-6 pt-2">
        <div className="min-w-[950px] space-y-10">
          {/* UPPER BRACKET */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                Upper Bracket
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-6 items-center">
              {/* UB Column 1: Quarterfinals */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  UB Quarterfinals
                </div>
                <div className="space-y-6">
                  {ubQuarterfinals.map((m) => renderMatchCard(m))}
                </div>
              </div>

              {/* UB Column 2: Semifinals */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  UB Semifinals
                </div>
                <div className="space-y-24 pt-6">
                  {ubSemifinals.map((m) => renderMatchCard(m))}
                </div>
              </div>

              {/* UB Column 3: UB Final */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  Upper Bracket Final
                </div>
                <div className="pt-24">{renderMatchCard(ubFinal)}</div>
              </div>

              {/* UB Column 4: Grand Final */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-amber-400 uppercase pb-1 border-b border-amber-500/40 text-center flex items-center justify-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Grand Final (Bo5)</span>
                </div>
                <div className="pt-24">{renderMatchCard(grandFinal)}</div>
              </div>
            </div>
          </div>

          {/* LOWER BRACKET */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                Lower Bracket
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-6 items-center">
              {/* LB Column 1: Round 1 */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  LB Round 1
                </div>
                <div className="space-y-6">
                  {lbRound1.map((m) => renderMatchCard(m))}
                </div>
              </div>

              {/* LB Column 2: Quarterfinals */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  LB Quarterfinals
                </div>
                <div className="space-y-6">
                  {lbQuarterfinals.map((m) => renderMatchCard(m))}
                </div>
              </div>

              {/* LB Column 3: Semifinals */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  LB Semifinals
                </div>
                <div className="pt-8">{renderMatchCard(lbSemifinals)}</div>
              </div>

              {/* LB Column 4: LB Final */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase pb-1 border-b border-white/[0.08] text-center">
                  Lower Bracket Final
                </div>
                <div className="pt-8">{renderMatchCard(lbFinal)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
