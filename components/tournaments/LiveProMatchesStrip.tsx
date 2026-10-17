"use client";

import Link from "next/link";
import NextImage from "next/image";
import { LiveOrRecentProMatch } from "@/lib/opendota/tournaments-types";
import { Radio, Swords, Eye, ShieldAlert } from "lucide-react";

interface LiveProMatchesStripProps {
  matches: LiveOrRecentProMatch[];
}

export function LiveProMatchesStrip({ matches }: LiveProMatchesStripProps) {
  if (!matches || matches.length === 0) return null;

  const formatGameTime = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "Live";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "Finished";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-rose-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Live &amp; Recent Pro Matches // Circuit Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          Real-time Valve Steam esports feed
        </span>
      </div>

      {/* Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {matches.map((m, idx) => {
          const isLive = m.is_live;
          const radiantWon = !isLive && m.radiant_win === true;
          const direWon = !isLive && m.radiant_win === false;

          return (
            <Link
              key={`${m.is_live ? "live" : "pro"}-${m.match_id}-${idx}`}
              href={`/tournaments/${m.league_id}`}
              className="group tactical-panel p-3.5 rounded-sm border border-white/[0.08] hover:border-rose-500/50 flex flex-col justify-between transition-all"
            >
              {/* Match Header: Tournament & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[160px] group-hover:text-white transition-colors">
                  {m.league_name}
                </span>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {m.series_type && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 uppercase">
                      {m.series_type}
                    </span>
                  )}

                  {isLive ? (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-950 border border-rose-600/60 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                      <Radio className="h-2 w-2 animate-pulse text-rose-400" />
                      <span>{formatGameTime(m.game_time)}</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-500">
                      {formatDuration(m.duration)}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Scoreboard: Radiant vs Dire */}
              <div className="space-y-2 py-1">
                {/* Radiant Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {m.radiant_team.logo ? (
                        <NextImage
                          src={m.radiant_team.logo}
                          alt={m.radiant_team.name}
                          fill
                          unoptimized
                          sizes="24px"
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <span className="text-[9px] font-mono font-bold text-emerald-400">R</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono truncate font-medium ${
                        radiantWon ? "text-emerald-400 font-bold" : "text-zinc-200"
                      }`}
                    >
                      {m.radiant_team.name}
                    </span>
                  </div>

                  <span
                    className={`text-sm font-mono font-black ${
                      radiantWon ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {m.radiant_team.score}
                  </span>
                </div>

                {/* Dire Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <div className="relative h-6 w-6 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {m.dire_team.logo ? (
                        <NextImage
                          src={m.dire_team.logo}
                          alt={m.dire_team.name}
                          fill
                          unoptimized
                          sizes="24px"
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <span className="text-[9px] font-mono font-bold text-rose-400">D</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono truncate font-medium ${
                        direWon ? "text-emerald-400 font-bold" : "text-zinc-200"
                      }`}
                    >
                      {m.dire_team.name}
                    </span>
                  </div>

                  <span
                    className={`text-sm font-mono font-black ${
                      direWon ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {m.dire_team.score}
                  </span>
                </div>
              </div>

              {/* Match Footer */}
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                {isLive && m.spectators ? (
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Eye className="h-3 w-3 text-rose-400" />
                    <span>{m.spectators.toLocaleString()} watching</span>
                  </span>
                ) : (
                  <span>Match #{m.match_id}</span>
                )}

                <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform">
                  View Series &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
