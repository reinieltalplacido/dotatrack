"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  TournamentDetail,
  TournamentMatch,
  TournamentSeries,
  TournamentStanding,
  TournamentTeam,
} from "@/lib/opendota/tournaments-types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  Radio,
  Search,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

interface TournamentDetailViewProps {
  detail: TournamentDetail;
}

type DossierTab = "overview" | "standings" | "series" | "matches" | "teams";

export function TournamentDetailView({ detail }: TournamentDetailViewProps) {
  const { tournament, teams, matches, series = [], stages = [], standings } = detail;

  const [activeTab, setActiveTab] = useState<DossierTab>("overview");
  const [matchFormatFilter, setMatchFormatFilter] = useState<"all" | "bo1" | "bo3" | "bo5">("all");
  const [teamSearch, setTeamSearch] = useState("");

  const isLive = tournament.status === "live";
  const isUpcoming = tournament.status === "upcoming";

  const filteredMatches = matches.filter((m) => {
    if (matchFormatFilter === "all") return true;
    if (matchFormatFilter === "bo1") return m.series_type === 1;
    if (matchFormatFilter === "bo3") return m.series_type === 2;
    if (matchFormatFilter === "bo5") return m.series_type === 3;
    return true;
  });

  const filteredSeries = series.filter((s) => {
    if (matchFormatFilter === "all") return true;
    if (matchFormatFilter === "bo1") return s.series_type === 1;
    if (matchFormatFilter === "bo3") return s.series_type === 2;
    if (matchFormatFilter === "bo5") return s.series_type === 3;
    return true;
  });

  const filteredTeams = teams.filter((t) => {
    if (!teamSearch.trim()) return true;
    const q = teamSearch.toLowerCase();
    return t.name.toLowerCase().includes(q) || (t.tag && t.tag.toLowerCase().includes(q));
  });

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "Recent Match";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Top 4 teams by standings for overview podium
  const topTeams = standings.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. TOP BREADCRUMB & EVENT STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>BACK TO TOURNAMENTS</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500">EVENT ID: #{tournament.id}</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400">DATA SOURCE: OPENDOTA</span>
        </div>
      </div>

      {/* 2. TOURNAMENT HERO BANNER */}
      <div className="relative overflow-hidden rounded-sm border border-white/[0.1] bg-gradient-to-r from-[#0C0E16] via-[#111422] to-[#0A0B10] p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xs px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  isLive
                    ? "bg-rose-950 text-rose-300 border-rose-600/70"
                    : isUpcoming
                    ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                    : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
                }`}
              >
                {isLive && <Radio className="h-2.5 w-2.5 animate-pulse text-rose-400" />}
                <span>{tournament.status.toUpperCase()}</span>
              </span>

              <span className="rounded-xs bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                {tournament.tier} TIER
              </span>

              {tournament.organizer && (
                <span className="text-xs font-mono text-zinc-400 border-l border-white/10 pl-2">
                  Organized by <strong className="text-zinc-200">{tournament.organizer}</strong>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-tight">
              {tournament.name}
            </h1>

            <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed">
              Official Dota 2 pro tournament stats covering {teams.length} participating teams
              and {matches.length} recorded matches.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                <span>{tournament.region}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-bold text-amber-300">{tournament.prizePool}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-sky-400" />
                <span>{teams.length} Participating Teams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Swords className="h-3.5 w-3.5 text-rose-400" />
                <span>{matches.length} Matches Logged</span>
              </div>
            </div>
          </div>

          {tournament.officialWebsite && (
            <div className="shrink-0 flex items-center">
              <a
                href={tournament.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-500 text-xs font-mono font-bold text-white transition-colors shadow-lg"
              >
                <span>OFFICIAL EVENT PORTAL</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 3. RELATED STAGES / REGIONAL QUALIFIERS SWITCHER (REAL OPENDOTA DATA) */}
      {stages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-rose-500" />
              <strong className="text-zinc-200">Tournament Stages & Regional Qualifiers:</strong>
            </span>
            <span className="text-[11px] text-zinc-500">Switch to view regional qualifier stats</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-sm bg-[#0C0E16] border border-white/[0.08]">
            {stages.map((stg) => {
              const isSelected = stg.isCurrent;
              return (
                <Link
                  key={stg.id}
                  href={`/tournaments/${stg.id}`}
                  className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]"
                  }`}
                >
                  <span>{stg.name}</span>
                  {stg.region && stg.region !== "Global" && (
                    <span className="ml-1.5 text-[10px] opacity-75 uppercase">[{stg.region}]</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. NAVIGATION TABS */}
      <div className="border-b border-white/[0.1] flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
        {[
          { id: "overview" as const, label: "Overview & Podium", count: null },
          { id: "standings" as const, label: "Event Standings", count: standings.length },
          { id: "series" as const, label: "Series Results", count: series.length },
          { id: "matches" as const, label: "Match Log", count: matches.length },
          { id: "teams" as const, label: "Teams & Rosters", count: teams.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-mono transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 min-h-[40px] ${
                isActive
                  ? "border-rose-500 text-white font-bold bg-white/[0.03]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-rose-500/20 text-rose-300" : "bg-white/[0.05] text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. TAB CONTENT */}

      {/* TAB 1: OVERVIEW & PODIUM */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Top Standings Podium Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Tournament Leaderboard & Top Performers</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("standings")}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
              >
                View all {standings.length} standings &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topTeams.map((item, idx) => (
                <div
                  key={item.team.team_id}
                  className={`tactical-panel p-4 rounded-sm border transition-all ${
                    idx === 0
                      ? "border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-[#0E1019]"
                      : idx === 1
                      ? "border-zinc-400/30 bg-[#0E1019]"
                      : idx === 2
                      ? "border-amber-700/30 bg-[#0E1019]"
                      : "border-white/[0.08] bg-[#0E1019]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-xs ${
                        idx === 0
                          ? "bg-amber-400 text-black font-extrabold"
                          : idx === 1
                          ? "bg-zinc-300 text-black font-bold"
                          : idx === 2
                          ? "bg-amber-700 text-white font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      RANK #{item.rank}
                    </span>

                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {item.winRate}% WR
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-10 w-10 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.team.logo_url ? (
                        <NextImage
                          src={item.team.logo_url}
                          alt={item.team.name}
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <Users className="h-4 w-4 text-zinc-500" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="font-mono text-sm font-bold text-white truncate">
                        {item.team.name}
                      </h3>
                      {item.team.tag && (
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          [{item.team.tag}]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">W - L</span>
                      <strong className="text-white">
                        {item.wins} - {item.losses}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">MATCHES</span>
                      <strong className="text-white">{item.matchesPlayed}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics & Series Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <Swords className="h-4 w-4 text-rose-500" />
                  <span>Recent Series Encounters</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("series")}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
                >
                  View all series &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {series.slice(0, 5).map((s) => (
                  <div
                    key={s.series_id}
                    className="tactical-panel p-3.5 rounded-sm border border-white/[0.08] hover:border-white/[0.2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-zinc-800 text-zinc-300">
                        {s.series_name}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {formatTimestamp(s.start_time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs">
                      {/* Team 1 */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            s.team1.isWinner ? "text-emerald-400" : "text-zinc-300"
                          }`}
                        >
                          {s.team1.name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            s.team1.isWinner
                              ? "bg-emerald-950 text-emerald-300"
                              : "bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          {s.team1.score}
                        </span>
                      </div>

                      <span className="text-zinc-600">:</span>

                      {/* Team 2 */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            s.team2.isWinner
                              ? "bg-emerald-950 text-emerald-300"
                              : "bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          {s.team2.score}
                        </span>
                        <span
                          className={`font-bold ${
                            s.team2.isWinner ? "text-emerald-400" : "text-zinc-300"
                          }`}
                        >
                          {s.team2.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dossier Meta Summary */}
            <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] bg-[#0E1017] space-y-4">
              <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-2">
                <Shield className="h-4 w-4 text-rose-500" />
                <span>Tournament Summary</span>
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Tier:</span>
                  <span className="font-bold text-white uppercase">{tournament.tier}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Status:</span>
                  <span className="font-bold text-rose-400 uppercase">{tournament.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Prize Pool:</span>
                  <span className="font-bold text-amber-300">{tournament.prizePool}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Host Region:</span>
                  <span className="font-bold text-white">{tournament.region}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Participating Teams:</span>
                  <span className="font-bold text-white">{teams.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-zinc-500">Recorded Matches:</span>
                  <span className="font-bold text-white">{matches.length}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Data Status:</span>
                  <span className="text-emerald-400 font-bold">Up to date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STANDINGS (REAL TOURNAMENT RECORD) */}
      {activeTab === "standings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div>
              <h2 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Event Standings & Performance Breakdown</span>
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Calculated directly from all recorded series and matches in this tournament.
              </p>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              {standings.length} Teams Ranked
            </span>
          </div>

          <div className="overflow-x-auto rounded-sm border border-white/[0.08] bg-[#0E1017]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-wider bg-black/40">
                  <th className="py-2.5 px-3 w-14 text-center">Rank</th>
                  <th className="py-2.5 px-4">Team</th>
                  <th className="py-2.5 px-3 text-center">Matches</th>
                  <th className="py-2.5 px-3 text-center">Record (W - L)</th>
                  <th className="py-2.5 px-3 text-center">Diff</th>
                  <th className="py-2.5 px-4 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {standings.map((s) => {
                  const diff = s.wins - s.losses;
                  const isTop = s.rank <= 4;
                  return (
                    <tr
                      key={s.team.team_id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isTop ? "bg-rose-950/[0.05]" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-white">#{s.rank}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
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
                              <Users className="h-3 w-3 text-zinc-500" />
                            )}
                          </div>
                          <span className="font-bold text-white">{s.team.name}</span>
                          {s.team.tag && (
                            <span className="text-[10px] text-zinc-500 uppercase">
                              [{s.team.tag}]
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-zinc-300">
                        {s.matchesPlayed}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-zinc-200">
                        <span className="text-emerald-400">{s.wins}</span> -{" "}
                        <span className="text-rose-400">{s.losses}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        <span
                          className={
                            diff > 0
                              ? "text-emerald-400"
                              : diff < 0
                              ? "text-rose-400"
                              : "text-zinc-500"
                          }
                        >
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`font-bold ${
                            s.winRate >= 50 ? "text-emerald-400" : "text-zinc-400"
                          }`}
                        >
                          {s.winRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERIES RESULTS (REAL OPENDOTA SERIES) */}
      {activeTab === "series" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-sm bg-[#0E1019] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Filter Series Format:</span>
              {(["all", "bo1", "bo3", "bo5"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setMatchFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                    matchFormatFilter === fmt
                      ? "bg-rose-950 text-rose-300 border border-rose-600 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {fmt === "all" ? "All Formats" : fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing <strong>{filteredSeries.length}</strong> recorded competitive series
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSeries.map((s) => (
              <div
                key={s.series_id}
                className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/[0.2] transition-colors space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase px-1.5 py-0.2 rounded-xs bg-zinc-800">
                      {s.series_name}
                    </span>
                    <span>•</span>
                    <span>{formatTimestamp(s.start_time)}</span>
                  </div>
                  <span className="text-zinc-500">{s.matches.length} Games Played</span>
                </div>

                <div className="space-y-2">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        {s.team1.logo ? (
                          <NextImage
                            src={s.team1.logo}
                            alt={s.team1.name}
                            fill
                            unoptimized
                            sizes="24px"
                            className="object-contain p-0.5"
                          />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-emerald-400">1</span>
                        )}
                      </div>
                      <span
                        className={`font-mono text-xs truncate ${
                          s.team1.isWinner ? "font-bold text-white" : "text-zinc-400"
                        }`}
                      >
                        {s.team1.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {s.team1.isWinner && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          SERIES WIN
                        </span>
                      )}
                      <span
                        className={`font-mono text-sm px-2 py-0.5 rounded-xs ${
                          s.team1.isWinner
                            ? "bg-emerald-950 text-emerald-300 font-bold"
                            : "text-zinc-500"
                        }`}
                      >
                        {s.team1.score}
                      </span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        {s.team2.logo ? (
                          <NextImage
                            src={s.team2.logo}
                            alt={s.team2.name}
                            fill
                            unoptimized
                            sizes="24px"
                            className="object-contain p-0.5"
                          />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-rose-400">2</span>
                        )}
                      </div>
                      <span
                        className={`font-mono text-xs truncate ${
                          s.team2.isWinner ? "font-bold text-white" : "text-zinc-400"
                        }`}
                      >
                        {s.team2.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {s.team2.isWinner && (
                        <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                          SERIES WIN
                        </span>
                      )}
                      <span
                        className={`font-mono text-sm px-2 py-0.5 rounded-xs ${
                          s.team2.isWinner
                            ? "bg-rose-950 text-rose-300 font-bold"
                            : "text-zinc-500"
                        }`}
                      >
                        {s.team2.score}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match links in series */}
                <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span>Games:</span>
                    {s.matches.map((gm, gIdx) => (
                      <Link
                        key={gm.match_id}
                        href={`/match-data?id=${gm.match_id}`}
                        className="text-zinc-300 hover:text-rose-400 underline transition-colors"
                      >
                        G{gIdx + 1}
                      </Link>
                    ))}
                  </div>

                  <span>SERIES #{s.series_id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INDIVIDUAL MATCHES LOG */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-sm bg-[#0E1019] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Filter Series Format:</span>
              {(["all", "bo1", "bo3", "bo5"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setMatchFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                    matchFormatFilter === fmt
                      ? "bg-rose-950 text-rose-300 border border-rose-600 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {fmt === "all" ? "All Formats" : fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing <strong>{filteredMatches.length}</strong> recorded games
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMatches.map((m, idx) => {
              const radiantWon = m.radiant_win;
              const direWon = !m.radiant_win;

              return (
                <div
                  key={`${m.match_id}-${idx}`}
                  className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/[0.2] transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase">{m.series_name}</span>
                      <span>•</span>
                      <span>{formatTimestamp(m.start_time)}</span>
                    </div>
                    <span className="text-zinc-500">Duration: {formatDuration(m.duration)}</span>
                  </div>

                  <div className="space-y-2">
                    {/* Radiant */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                          {m.radiant_team_logo ? (
                            <NextImage
                              src={m.radiant_team_logo}
                              alt={m.radiant_team_name}
                              fill
                              unoptimized
                              sizes="24px"
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
                        <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                          {m.dire_team_logo ? (
                            <NextImage
                              src={m.dire_team_logo}
                              alt={m.dire_team_name}
                              fill
                              unoptimized
                              sizes="24px"
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

                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">MATCH ID: {m.match_id}</span>
                    <Link
                      href={`/match-data?id=${m.match_id}`}
                      className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-bold text-[11px] transition-colors"
                    >
                      <span>Analyze Game</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: PARTICIPATING TEAMS */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-2">
            <div>
              <h2 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-400" />
                <span>Participating Teams</span>
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Official rosters and competition records for all {teams.length} participating clubs.
              </p>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search team or tag..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full bg-[#0C0E16] border border-white/[0.1] rounded-xs pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTeams.map((team) => (
              <div
                key={team.team_id}
                className="tactical-panel p-4 rounded-sm border border-white/[0.08] hover:border-white/[0.2] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative h-10 w-10 rounded bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                    {team.logo_url ? (
                      <NextImage
                        src={team.logo_url}
                        alt={team.name}
                        fill
                        unoptimized
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <Users className="h-4 w-4 text-zinc-500" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="font-mono text-sm font-bold text-white truncate">{team.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                      {team.tag && <span>[{team.tag}]</span>}
                      <span>•</span>
                      <span>Rating: {Math.round(team.rating)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono shrink-0">
                  <div className="text-emerald-400 font-bold">{team.wins} Wins</div>
                  <div className="text-zinc-500">{team.losses} Losses</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
