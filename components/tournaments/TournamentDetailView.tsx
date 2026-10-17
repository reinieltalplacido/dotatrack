"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { TournamentDetail, TournamentMatch } from "@/lib/opendota/tournaments-types";
import {
  LiquipediaHeader,
  LiquipediaTab,
  LiquipediaRegionStage,
} from "./liquipedia/LiquipediaHeader";
import { LiquipediaOverview } from "./liquipedia/LiquipediaOverview";
import { LiquipediaParticipants } from "./liquipedia/LiquipediaParticipants";
import { LiquipediaBracket } from "./liquipedia/LiquipediaBracket";
import { LiquipediaGroupStage } from "./liquipedia/LiquipediaGroupStage";
import { Swords, ExternalLink } from "lucide-react";

interface TournamentDetailViewProps {
  detail: TournamentDetail;
}

export function TournamentDetailView({ detail }: TournamentDetailViewProps) {
  const { tournament, teams, matches, standings } = detail;
  const [activeTab, setActiveTab] = useState<LiquipediaTab>("overview");
  const [activeRegion, setActiveRegion] = useState<LiquipediaRegionStage>("main");
  const [matchFilter, setMatchFilter] = useState<"all" | "bo1" | "bo3" | "bo5">("all");

  const filteredMatches = matches.filter((m) => {
    if (matchFilter === "all") return true;
    if (matchFilter === "bo1") return m.series_type === 1;
    if (matchFilter === "bo3") return m.series_type === 2;
    if (matchFilter === "bo5") return m.series_type === 3;
    return true;
  });

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatStartTime = (timestamp: number) => {
    if (!timestamp) return "Recent Match";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Liquipedia Header with Title, Circuit Banner, Region Tabs, and Subtabs */}
      <LiquipediaHeader
        tournament={tournament}
        teamsCount={teams.length}
        matchesCount={matches.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRegion={activeRegion}
        onRegionChange={setActiveRegion}
      />

      {/* LIQUIPEDIA TAB 1: OVERVIEW (Format & Prize Pool Distribution Table) */}
      {activeTab === "overview" && (
        <LiquipediaOverview tournament={tournament} teams={teams} />
      )}

      {/* LIQUIPEDIA TAB 2: GROUP STAGE (Swiss System Standings) */}
      {activeTab === "group_stage" && (
        <LiquipediaGroupStage standings={standings} teams={teams} />
      )}

      {/* LIQUIPEDIA TAB 3: PLAYOFFS (Double Elimination Bracket) */}
      {activeTab === "playoffs" && (
        <LiquipediaBracket matches={matches} teams={teams} />
      )}

      {/* LIQUIPEDIA TAB 4: PARTICIPANTS (Team Cards with Rosters) */}
      {activeTab === "participants" && (
        <LiquipediaParticipants teams={teams} />
      )}

      {/* LIQUIPEDIA TAB 5: MATCHES & SCHEDULE */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          {/* Format Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-sm bg-[#0E1019] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Filter Series:</span>
              {(["all", "bo1", "bo3", "bo5"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setMatchFilter(fmt)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                    matchFilter === fmt
                      ? "bg-rose-950 text-rose-300 border border-rose-600 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {fmt === "all" ? "All Formats" : fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing <strong>{filteredMatches.length}</strong> recorded matches
            </span>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 rounded border border-dashed border-white/[0.1] bg-black/20 text-xs font-mono text-zinc-400">
              No matches found for the selected series filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMatches.map((m, idx) => {
                const radiantWon = m.radiant_win;
                const direWon = !m.radiant_win;

                return (
                  <div
                    key={`${m.match_id}-${idx}`}
                    className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/[0.2] transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase">{m.series_name}</span>
                        <span>•</span>
                        <span>{formatStartTime(m.start_time)}</span>
                      </div>
                      <span className="text-zinc-500">Duration: {formatDuration(m.duration)}</span>
                    </div>

                    {/* Scoreboard */}
                    <div className="space-y-2">
                      {/* Radiant */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <div className="relative h-7 w-7 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                            {m.radiant_team_logo ? (
                              <NextImage
                                src={m.radiant_team_logo}
                                alt={m.radiant_team_name}
                                fill
                                unoptimized
                                sizes="28px"
                                className="object-contain p-0.5"
                              />
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-emerald-400">R</span>
                            )}
                          </div>
                          <span
                            className={`font-mono text-xs truncate ${
                              radiantWon ? "font-bold text-white" : "text-zinc-400"
                            }`}
                          >
                            {m.radiant_team_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {radiantWon && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                              WIN
                            </span>
                          )}
                          <span
                            className={`font-mono text-sm px-2 py-0.5 rounded-xs ${
                              radiantWon ? "bg-emerald-950 text-emerald-300 font-bold" : "text-zinc-500"
                            }`}
                          >
                            {m.radiant_score}
                          </span>
                        </div>
                      </div>

                      {/* Dire */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <div className="relative h-7 w-7 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                            {m.dire_team_logo ? (
                              <NextImage
                                src={m.dire_team_logo}
                                alt={m.dire_team_name}
                                fill
                                unoptimized
                                sizes="28px"
                                className="object-contain p-0.5"
                              />
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-rose-400">D</span>
                            )}
                          </div>
                          <span
                            className={`font-mono text-xs truncate ${
                              direWon ? "font-bold text-white" : "text-zinc-400"
                            }`}
                          >
                            {m.dire_team_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {direWon && (
                            <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                              WIN
                            </span>
                          )}
                          <span
                            className={`font-mono text-sm px-2 py-0.5 rounded-xs ${
                              direWon ? "bg-rose-950 text-rose-300 font-bold" : "text-zinc-500"
                            }`}
                          >
                            {m.dire_score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Replay Action */}
                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[10px]">MATCH ID: {m.match_id}</span>
                      <Link
                        href={`/match-data?id=${m.match_id}`}
                        className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-bold text-[11px] transition-colors"
                      >
                        <span>Analyze Telemetry</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
