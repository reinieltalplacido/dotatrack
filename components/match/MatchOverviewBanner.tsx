"use client";

import { useState } from "react";
import {
  Trophy,
  Clock,
  Calendar,
  Globe,
  Layers,
  Sparkles,
  FileCheck2,
  FileQuestion,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { NormalizedMatchData } from "@/lib/opendota/match-types";

interface MatchOverviewBannerProps {
  match: NormalizedMatchData;
  onRefresh?: () => void;
}

export function MatchOverviewBanner({ match, onRefresh }: MatchOverviewBannerProps) {
  const [isRequestingParse, setIsRequestingParse] = useState(false);
  const [parseMessage, setParseMessage] = useState<string | null>(null);

  const handleRequestParse = async () => {
    setIsRequestingParse(true);
    setParseMessage(null);
    try {
      const res = await fetch(`/api/matches/${match.matchId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request parse");
      setParseMessage(data.message || "Parse requested successfully. Replay processing queued.");
    } catch (err) {
      setParseMessage(err instanceof Error ? err.message : "Error submitting parse request.");
    } finally {
      setIsRequestingParse(false);
    }
  };

  const isRadiantVictory = match.radiantWin;

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8 relative overflow-hidden">
      {/* Team Victory Ambient Background */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-20 transition-all ${
          isRadiantVictory
            ? "bg-gradient-to-r from-emerald-950 via-transparent to-transparent"
            : "bg-gradient-to-l from-rose-950 via-transparent to-transparent"
        }`}
      />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4 relative z-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-zinc-400">
            MATCH ID: <strong className="text-white font-bold">{match.matchId}</strong>
          </span>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar className="h-3 w-3 text-zinc-500" />
            <span>{match.startTimeFormatted}</span>
          </div>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3 w-3 text-zinc-500" />
            <span>{match.durationFormatted}</span>
          </div>
        </div>

        {/* Parsed / Unparsed status badge */}
        <div className="flex items-center gap-2">
          {match.isParsed ? (
            <div className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 text-[11px] font-mono text-emerald-300 font-bold">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>PARSED REPLAY DATA</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-sm bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 text-[11px] font-mono text-amber-300 font-bold">
                <FileQuestion className="h-3.5 w-3.5 text-amber-400" />
                <span>UNPARSED REPLAY</span>
              </div>
              <button
                type="button"
                onClick={handleRequestParse}
                disabled={isRequestingParse}
                className="inline-flex items-center gap-1 rounded-sm bg-zinc-900 border border-white/[0.1] px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isRequestingParse ? "animate-spin text-amber-400" : ""}`} />
                <span>{isRequestingParse ? "QUEUEING..." : "REQUEST PARSE"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Parse confirmation notice if triggered */}
      {parseMessage && (
        <div className="mb-4 p-3 rounded-sm bg-zinc-900 border border-amber-600/40 text-xs font-mono text-amber-300 flex items-center justify-between">
          <span>{parseMessage}</span>
          <button onClick={() => setParseMessage(null)} className="text-[10px] underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Scoreboard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left relative z-10 mb-6">
        {/* Radiant Side */}
        <div className={`p-4 rounded-sm border ${isRadiantVictory ? "border-emerald-500/40 bg-emerald-950/30 shadow-lg shadow-emerald-950/30" : "border-white/[0.06] bg-black/30"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>THE RADIANT</span>
              {isRadiantVictory && <Trophy className="h-4 w-4 text-emerald-400" />}
            </span>
            {isRadiantVictory && (
              <span className="text-[10px] font-mono font-black bg-emerald-500 text-black px-2 py-0.5 rounded-xs uppercase tracking-wider">
                WINNER
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-white">
            {match.radiantScore}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Total Net Worth: <strong className="text-emerald-400">{match.radiantTeamTotalNetWorth.toLocaleString()}</strong>
          </div>
        </div>

        {/* Center Versus / Match Type */}
        <div className="text-center space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
            FINAL OUTCOME
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-white">
            {isRadiantVictory ? (
              <span className="text-emerald-400">RADIANT VICTORY</span>
            ) : (
              <span className="text-rose-400">DIRE VICTORY</span>
            )}
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {match.gameMode} • {match.lobbyType}
          </div>
        </div>

        {/* Dire Side */}
        <div className={`p-4 rounded-sm border ${!isRadiantVictory ? "border-rose-500/40 bg-rose-950/30 shadow-lg shadow-rose-950/30" : "border-white/[0.06] bg-black/30"} text-center md:text-right`}>
          <div className="flex items-center justify-between md:justify-end gap-2 mb-2">
            {!isRadiantVictory && (
              <span className="text-[10px] font-mono font-black bg-rose-500 text-white px-2 py-0.5 rounded-xs uppercase tracking-wider">
                WINNER
              </span>
            )}
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              {!isRadiantVictory && <Trophy className="h-4 w-4 text-rose-400" />}
              <span>THE DIRE</span>
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-white">
            {match.direScore}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Total Net Worth: <strong className="text-rose-400">{match.direTeamTotalNetWorth.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Match Meta Footer Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-zinc-500" />
          <span>Region: <strong className="text-zinc-200">{match.region}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-zinc-500" />
          <span>Skill: <strong className="text-zinc-200">{match.skillBracket}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Version: <strong className="text-zinc-200">{match.patch}</strong></span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          {match.replayUrl && (
            <a
              href={match.replayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 underline"
            >
              <span>Download Replay</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
