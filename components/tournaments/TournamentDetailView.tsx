"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { TournamentDetail, TournamentMatch } from "@/lib/opendota/tournaments-types";
import {
  Trophy,
  MapPin,
  Users,
  Swords,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Radio,
  Clock,
  CheckCircle,
  HelpCircle,
  Shield,
  Layers,
} from "lucide-react";

interface TournamentDetailViewProps {
  detail: TournamentDetail;
}

export function TournamentDetailView({ detail }: TournamentDetailViewProps) {
  const { tournament, teams, matches, standings, bracketAvailable } = detail;
  const [activeTab, setActiveTab] = useState<"matches" | "teams" | "standings" | "bracket">("matches");
  const [matchFilter, setMatchFilter] = useState<"all" | "bo1" | "bo3" | "bo5">("all");

  const isLive = tournament.status === "live";

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
    return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>&larr; BACK TO TOURNAMENTS</span>
        </Link>
      </div>

      {/* Hero Header Dossier */}
      <div className="relative rounded-sm border border-white/[0.1] bg-gradient-to-r from-[#140A10] via-[#0D0F18] to-[#0A0C14] p-6 sm:p-8 overflow-hidden shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold">
                TOURNAMENT_DOSSIER // #{tournament.id}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                  isLive
                    ? "bg-rose-950 text-rose-300 border-rose-600/70 shadow-sm"
                    : tournament.status === "upcoming"
                    ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                    : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
                }`}
              >
                {isLive && <Radio className="h-2 w-2 animate-pulse text-rose-400" />}
                <span>{tournament.status.toUpperCase()}</span>
              </span>

              <span className="rounded-sm bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400 uppercase">
                {tournament.tier.toUpperCase()} TIER
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white tracking-tight">
              {tournament.name}
            </h1>

            <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed max-w-2xl">
              {tournament.description}
            </p>

            {/* Key Facts Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-300">
              {tournament.prizePool && (
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-zinc-400">Prize:</span>
                  <strong className="text-white font-bold">{tournament.prizePool}</strong>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-zinc-400">Location:</span>
                <strong className="text-white">{tournament.region}</strong>
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                <Users className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-zinc-400">Teams:</span>
                <strong className="text-white">{teams.length} Teams</strong>
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.06] px-3 py-1.5 rounded">
                <Swords className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-400">Series:</span>
                <strong className="text-white">{matches.length} Matches</strong>
              </div>
            </div>
          </div>

          {/* Organizer / Website CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 flex-shrink-0">
            {tournament.officialWebsite && (
              <a
                href={tournament.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-rose-600 px-4 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-rose-500 shadow-md transition-colors"
              >
                <span>Official Tournament Hub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <div className="bg-black/50 border border-white/[0.08] px-4 py-2 rounded text-center text-xs font-mono text-zinc-400">
              <span>Organized by: </span>
              <strong className="text-white">{tournament.organizer}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] mb-6 pb-2">
        {(
          [
            { id: "matches", label: "Matches & Schedule", count: matches.length, icon: Swords },
            { id: "teams", label: "Participating Teams", count: teams.length, icon: Users },
            { id: "standings", label: "Standings & Rankings", count: standings.length, icon: Trophy },
            { id: "bracket", label: "Bracket Telemetry", icon: Layers },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-sm transition-all ${
                isActive
                  ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
                  : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {"count" in tab && (
                <span className="text-[10px] text-zinc-400 font-normal">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MATCHES & SCHEDULE */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          {/* Format Filter Bar */}
          <div className="flex items-center justify-between p-3 rounded-sm bg-[#0E1019] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Filter Series:</span>
              {(["all", "bo1", "bo3", "bo5"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setMatchFilter(fmt)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
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
                          <div className="relative h-7 w-7 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
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
                            className={`text-xs font-mono truncate ${
                              radiantWon ? "text-emerald-400 font-bold" : "text-zinc-200"
                            }`}
                          >
                            {m.radiant_team_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          {radiantWon && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                              WIN
                            </span>
                          )}
                          <span
                            className={`text-base font-black ${
                              radiantWon ? "text-emerald-400" : "text-white"
                            }`}
                          >
                            {m.radiant_score}
                          </span>
                        </div>
                      </div>

                      {/* Dire */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <div className="relative h-7 w-7 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
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
                            className={`text-xs font-mono truncate ${
                              direWon ? "text-emerald-400 font-bold" : "text-zinc-200"
                            }`}
                          >
                            {m.dire_team_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          {direWon && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                              WIN
                            </span>
                          )}
                          <span
                            className={`text-base font-black ${
                              direWon ? "text-emerald-400" : "text-white"
                            }`}
                          >
                            {m.dire_score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Link */}
                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Match ID: {m.match_id}</span>
                      <span className="text-rose-400 font-semibold">Verified Circuit Telemetry</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PARTICIPATING TEAMS */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((team) => (
            <div
              key={team.team_id}
              className="tactical-panel p-4 rounded-sm border border-white/[0.08] flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-12 w-12 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {team.logo_url ? (
                    <NextImage
                      src={team.logo_url}
                      alt={team.name}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <Shield className="h-6 w-6 text-zinc-600" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{team.name}</h3>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {team.tag || "Team"} • Rating: {Math.round(team.rating || 1000)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Record in Tournament:</span>
                <span className="text-white font-bold">
                  {team.wins}W - {team.losses}L
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: STANDINGS & RANKINGS */}
      {activeTab === "standings" && (
        <div className="tactical-panel rounded-sm border border-white/[0.08] overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Tournament Standings &amp; Placement Telemetry
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Derived from official match records and game wins during this circuit event.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-400 uppercase text-[10px] tracking-wider bg-black/40">
                  <th className="py-3 px-4 w-14">Rank</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Losses</th>
                  <th className="py-3 px-4 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {standings.map((s) => (
                  <tr key={s.team.team_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {s.rank <= 3 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs">
                          {s.rank}
                        </span>
                      ) : (
                        `#${s.rank}`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {s.team.logo_url ? (
                            <NextImage
                              src={s.team.logo_url}
                              alt={s.team.name}
                              fill
                              unoptimized
                              sizes="24px"
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-500">T</span>
                          )}
                        </div>
                        <span className="font-bold text-white text-xs">{s.team.name}</span>
                        {s.team.tag && (
                          <span className="text-[10px] text-zinc-500 uppercase">({s.team.tag})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-zinc-300">{s.matchesPlayed}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">{s.wins}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-400">{s.losses}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold ${
                          s.winRate >= 50 ? "text-emerald-400" : "text-zinc-300"
                        }`}
                      >
                        {s.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BRACKET TELEMETRY (Honest Data Notice) */}
      {activeTab === "bracket" && (
        <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-400">
            <HelpCircle className="h-6 w-6" />
          </div>

          <h3 className="font-mono text-base font-bold text-white">
            Bracket Telemetry &amp; Elimination Structure
          </h3>

          <p className="text-xs font-mono text-zinc-400 leading-relaxed">
            The Valve Dota 2 REST API and OpenDota telemetry feed provides series-level scores, match replays, and team records for <strong>{tournament.name}</strong>, but does not expose interactive tree brackets via public endpoints.
          </p>

          <p className="text-xs font-mono text-zinc-500 leading-relaxed">
            All confirmed match results and series scores are available under the <strong>Matches &amp; Schedule</strong> tab above. For live playoff bracket trees, please consult the official tournament organizer hub.
          </p>

          {tournament.officialWebsite && (
            <div className="pt-2">
              <a
                href={tournament.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-rose-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-rose-500 transition-colors"
              >
                <span>View Official Bracket at Event Hub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
