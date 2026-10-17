"use client";

import { TournamentSummary } from "@/lib/opendota/tournaments-types";
import { ArrowLeft, ExternalLink, Radio, Trophy, MapPin, Users, Swords } from "lucide-react";
import Link from "next/link";

export type LiquipediaTab = "overview" | "group_stage" | "playoffs" | "participants" | "matches";
export type LiquipediaRegionStage = "main" | "weu" | "eeu" | "cn" | "sea" | "sa";

interface LiquipediaHeaderProps {
  tournament: TournamentSummary;
  teamsCount: number;
  matchesCount: number;
  activeTab: LiquipediaTab;
  onTabChange: (tab: LiquipediaTab) => void;
  activeRegion: LiquipediaRegionStage;
  onRegionChange: (region: LiquipediaRegionStage) => void;
}

export function LiquipediaHeader({
  tournament,
  teamsCount,
  matchesCount,
  activeTab,
  onTabChange,
  activeRegion,
  onRegionChange,
}: LiquipediaHeaderProps) {
  const isLive = tournament.status === "live";

  const regionTabs: { id: LiquipediaRegionStage; label: string }[] = [
    { id: "main", label: "Main Tournament" },
    { id: "weu", label: "Western Europe" },
    { id: "eeu", label: "Eastern Europe" },
    { id: "cn", label: "China" },
    { id: "sea", label: "Southeast Asia" },
    { id: "sa", label: "South America" },
  ];

  const subTabs: { id: LiquipediaTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "group_stage", label: "Group Stage" },
    { id: "playoffs", label: "Playoffs" },
    { id: "participants", label: "Participants" },
    { id: "matches", label: "Matches & Schedule" },
  ];

  // Strip qualifier tags so the actual championship is rendered
  const baseName = tournament.name
    ? tournament.name
        .replace(/\s*[-–—:]?\s*(western europe|eastern europe|southeast asia|south america|north america|china|europe|cis|sea|weu|eeu|sa|na|cn)\s*(closed|open)?\s*qualif(ier)?(s)?\b/gi, "")
        .replace(/\s*[-–—:]?\s*(closed|open)?\s*qualif(ier)?(s)?\b/gi, "")
        .replace(/\s*qualifier(s)?/gi, "")
        .replace(/\s*qualifs/gi, "")
        .replace(/[-–—:]+$/, "")
        .replace(/\s+/g, " ")
        .trim()
    : "DreamLeague Season 30";

  const selectedRegion = regionTabs.find((r) => r.id === activeRegion);
  const displayTitle =
    activeRegion === "main"
      ? baseName
      : `${baseName}: ${selectedRegion?.label || "Regional"} Closed Qualifier`;

  return (
    <div className="space-y-4 mb-8">
      {/* Back Link */}
      <div>
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>&larr; BACK TO TOURNAMENTS</span>
        </Link>
      </div>

      {/* Main Liquipedia Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold">
              LIQUIPEDIA ESPORTS DOSSIER // #{tournament.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                isLive
                  ? "bg-rose-950 text-rose-300 border-rose-600/70"
                  : tournament.status === "upcoming"
                  ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                  : "bg-zinc-900 text-zinc-400 border-white/[0.08]"
              }`}
            >
              {isLive && <Radio className="h-2 w-2 animate-pulse text-rose-400" />}
              <span>{tournament.status.toUpperCase()}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            {displayTitle}
          </h1>
        </div>

        {tournament.officialWebsite && (
          <a
            href={tournament.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 border border-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white hover:border-white/30 transition-colors self-start sm:self-center"
          >
            <span>Official Event Hub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Liquipedia Circuit Bar */}
      <div className="bg-[#5c0f16] border-y border-[#8b1420] px-3 py-1.5 text-xs font-sans text-rose-200 flex items-center justify-between">
        <span className="text-[11px] text-rose-300 font-bold tracking-wider uppercase">[e]</span>
        <span className="font-bold text-center flex-1">{tournament.organizer || "ESL Gaming"} Events</span>
        <span className="w-4" aria-hidden="true" />
      </div>

      {/* Liquipedia Region / Stage Tabs (like Image 2) */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.1] bg-[#0C0E14] p-1 rounded-t-sm">
        {regionTabs.map((reg) => {
          const isActive = activeRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => onRegionChange(reg.id)}
              className={`px-3 py-1.5 text-xs font-mono transition-all rounded-xs cursor-pointer ${
                isActive
                  ? "bg-[#181C28] text-white font-bold border border-white/[0.15] border-b-transparent shadow-xs"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {reg.label}
            </button>
          );
        })}
      </div>

      {/* Liquipedia Section Sub-tabs (Overview, Group Stage, Playoffs, Participants, Matches) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.08] pb-1">
        {subTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 text-xs font-mono transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-rose-500 text-white font-bold bg-white/[0.03]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
