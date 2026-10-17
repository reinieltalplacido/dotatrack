"use client";

import { useState } from "react";
import NextImage from "next/image";
import { TournamentTeam } from "@/lib/opendota/tournaments-types";
import { getRosterForTeam, LiquipediaTeamRoster } from "./liquipedia-data";
import { Users, ChevronDown, ChevronUp, Share2, Info } from "lucide-react";

interface LiquipediaParticipantsProps {
  teams: TournamentTeam[];
}

export function LiquipediaParticipants({ teams }: LiquipediaParticipantsProps) {
  const [showAllRosters, setShowAllRosters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // If teams array has few teams, supplement with premier teams from Liquipedia screenshot 4
  const displayTeams = [...teams];
  const knownPremierNames = [
    "Astra Invicta",
    "Aurora Gaming",
    "BetBoom Team",
    "Natus Vincere",
    "PARIVISION",
    "Pipsqueak+4",
    "Team Tidebound",
    "Team Yandex",
    "LGD Gaming",
    "Xtreme Gaming",
    "1w Team",
    "GamerLegion",
    "Team Liquid",
    "Team Spirit",
    "OG",
    "Yellow Submarine",
  ];

  if (displayTeams.length < 16) {
    const existingNames = new Set(displayTeams.map((t) => t.name.toLowerCase()));
    knownPremierNames.forEach((name, idx) => {
      if (!existingNames.has(name.toLowerCase())) {
        displayTeams.push({
          team_id: 99000 + idx,
          name,
          tag: name.substring(0, 3).toUpperCase(),
          rating: 1300 - idx * 10,
          wins: 0,
          losses: 0,
          logo_url: null,
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Header & Controls (Image 4) */}
      <div className="border-b border-white/[0.08] pb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-white flex items-center gap-2">
            <span>Participants</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-normal">[edit]</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            {displayTeams.length} competing organizations • Circuit direct invites and regional qualifier seeds
          </p>
        </div>

        {/* Toggles toolbar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-2.5 py-1 rounded-sm border border-white/[0.08] text-zinc-300 hover:text-white">
            <input
              type="checkbox"
              checked={showAllRosters}
              onChange={(e) => setShowAllRosters(e.target.checked)}
              className="accent-rose-500 rounded-xs"
            />
            <span>Show rosters</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-2.5 py-1 rounded-sm border border-white/[0.08] text-zinc-300 hover:text-white">
            <input
              type="checkbox"
              checked={compactView}
              onChange={(e) => setCompactView(e.target.checked)}
              className="accent-rose-500 rounded-xs"
            />
            <span>Compact view</span>
          </label>
        </div>
      </div>

      {/* Grid of Team Cards (Image 4) */}
      <div
        className={`grid gap-2.5 ${
          compactView
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {displayTeams.map((team, idx) => {
          const isQualified = idx >= 14 || team.name === "OG" || team.name === "Yellow Submarine";
          const roster = getRosterForTeam(team.name, team.tag, isQualified);
          const isExpanded = showAllRosters || Boolean(expandedTeams[team.name]);

          return (
            <div
              key={`${team.team_id}-${team.name}`}
              className="rounded-sm border border-white/[0.08] bg-[#10131B] hover:border-white/[0.2] transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleTeam(team.name)}
                className="p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                    {team.logo_url ? (
                      <NextImage
                        src={team.logo_url}
                        alt={team.name}
                        fill
                        unoptimized
                        sizes="24px"
                        className="object-contain p-0.5"
                      />
                    ) : (
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </div>
                  <span className="font-sans font-bold text-xs text-white truncate">{team.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-semibold border ${
                      roster.status === "Invited"
                        ? "bg-zinc-800 text-zinc-300 border-white/[0.1]"
                        : "bg-rose-950/80 text-rose-300 border-rose-700/60"
                    }`}
                  >
                    {roster.status}
                  </span>
                  <button type="button" className="text-zinc-500 hover:text-white">
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable 5-Man Roster (Image 4) */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-white/[0.06] bg-black/40 text-[11px] font-mono space-y-1">
                  {roster.players.map((p) => (
                    <div key={p.pos} className="flex items-center justify-between text-zinc-300 py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 font-bold w-3">{p.pos}.</span>
                        <span className="font-bold text-white hover:text-rose-400 transition-colors">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{p.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
