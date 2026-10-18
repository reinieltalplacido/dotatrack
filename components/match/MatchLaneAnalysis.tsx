"use client";

import Image from "next/image";
import { Swords, Info, ShieldAlert, MapPin } from "lucide-react";
import { MatchLanePairing, MatchPlayerDetailed } from "@/lib/opendota/match-types";

interface MatchLaneAnalysisProps {
  lanePairings: MatchLanePairing[];
  isParsed: boolean;
}

export function MatchLaneAnalysis({ lanePairings, isParsed }: MatchLaneAnalysisProps) {
  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              LANE PERFORMANCE &amp; HEAD-TO-HEAD MATCHUPS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Early-game laning phase breakdown evaluated at 5:00, 10:00, and 15:00 minutes.
          </p>
        </div>

        {/* Methodology Notice */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1.5 rounded-sm border border-white/[0.08]">
          <Info className="h-3.5 w-3.5 text-zinc-500" />
          <span>Independent of final game victory</span>
        </div>
      </div>

      {!isParsed ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <ShieldAlert className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Laning Data Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Minute-by-minute CS and Net Worth time series require parsed replay files.
            Request a replay parse using the button at the top to unlock exact lane evaluations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {lanePairings.map((pairing, index) => {
            const isRadFavored = pairing.verdict === "Radiant Favored";
            const isDireFavored = pairing.verdict === "Dire Favored";

            // Determine core vs support in radiant lane using farm metrics
            const sortedRad = [...pairing.radiantPlayers].sort((a, b) => {
              const aFarm = (a.lhAt10 ?? a.lastHits) * 50 + (a.netWorthAt10 ?? a.netWorth);
              const bFarm = (b.lhAt10 ?? b.lastHits) * 50 + (b.netWorthAt10 ?? b.netWorth);
              return bFarm - aFarm;
            });
            const radCoreSlot = sortedRad[0]?.playerSlot;

            // Determine core vs support in dire lane using farm metrics
            const sortedDire = [...pairing.direPlayers].sort((a, b) => {
              const aFarm = (a.lhAt10 ?? a.lastHits) * 50 + (a.netWorthAt10 ?? a.netWorth);
              const bFarm = (b.lhAt10 ?? b.lastHits) * 50 + (b.netWorthAt10 ?? b.netWorth);
              return bFarm - aFarm;
            });
            const direCoreSlot = sortedDire[0]?.playerSlot;

            return (
              <div
                key={`lane-${index}`}
                className="p-5 rounded-sm bg-black/40 border border-white/[0.08] relative overflow-hidden"
              >
                {/* Lane Title & Verdict */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-mono font-black text-white uppercase tracking-wider">
                        {pairing.mapLocation || pairing.laneName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      <span className="text-emerald-400 font-bold">{pairing.radiantRoleLabel}</span>
                      <span className="text-zinc-600 mx-2">vs</span>
                      <span className="text-rose-400 font-bold">{pairing.direRoleLabel}</span>
                    </div>
                  </div>

                  {/* Verdict Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-1 rounded-sm border ${
                        isRadFavored
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/60"
                          : isDireFavored
                          ? "bg-rose-950/80 text-rose-300 border-rose-600/60"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.1]"
                      }`}
                    >
                      {pairing.verdict}
                    </span>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-xs font-mono text-zinc-400 mb-4 bg-zinc-950/60 p-2.5 rounded-sm border border-white/[0.04]">
                  <strong className="text-zinc-200">Lane Assessment:</strong> {pairing.reason}
                </div>

                {/* Head-to-Head Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Radiant Laners */}
                  <div className="space-y-3 p-3 rounded-sm bg-emerald-950/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {pairing.radiantRoleLabel || "Radiant Laners"}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500/70">
                        The Radiant
                      </span>
                    </div>

                    {pairing.radiantPlayers.length === 0 ? (
                      <span className="text-xs font-mono text-zinc-500">No designated laner</span>
                    ) : (
                      pairing.radiantPlayers.map((player) => {
                        const isCore = player.playerSlot === radCoreSlot;
                        let roleTag = "SUPPORT";
                        if (player.lane === 2) {
                          roleTag = "MIDLANER";
                        } else if (player.lane === 1) {
                          // Radiant Lane 1 is Safelane
                          roleTag = isCore ? "CARRY" : "SUPPORT";
                        } else if (player.lane === 3) {
                          // Radiant Lane 3 is Offlane
                          roleTag = isCore ? "OFFLANE" : "SUPPORT";
                        } else {
                          roleTag = player.roleName === "Carry" ? "CARRY" : player.roleName === "Offlane" ? "OFFLANE" : player.roleName === "Mid" ? "MIDLANER" : "SUPPORT";
                        }

                        return (
                          <LanerCard
                            key={player.playerSlot}
                            player={player}
                            isRadiant={true}
                            roleTag={roleTag}
                          />
                        );
                      })
                    )}
                  </div>

                  {/* Dire Laners */}
                  <div className="space-y-3 p-3 rounded-sm bg-rose-950/10 border border-rose-500/20">
                    <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
                      <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                        {pairing.direRoleLabel || "Dire Laners"}
                      </span>
                      <span className="text-[10px] font-mono text-rose-500/70">
                        The Dire
                      </span>
                    </div>

                    {pairing.direPlayers.length === 0 ? (
                      <span className="text-xs font-mono text-zinc-500">No designated laner</span>
                    ) : (
                      pairing.direPlayers.map((player) => {
                        const isCore = player.playerSlot === direCoreSlot;
                        let roleTag = "SUPPORT";
                        if (player.lane === 2) {
                          roleTag = "MIDLANER";
                        } else if (player.lane === 3) {
                          // Dire Lane 3 is Safelane (Top)
                          roleTag = isCore ? "CARRY" : "SUPPORT";
                        } else if (player.lane === 1) {
                          // Dire Lane 1 is Offlane (Bottom)
                          roleTag = isCore ? "OFFLANE" : "SUPPORT";
                        } else {
                          roleTag = player.roleName === "Carry" ? "CARRY" : player.roleName === "Offlane" ? "OFFLANE" : player.roleName === "Mid" ? "MIDLANER" : "SUPPORT";
                        }

                        return (
                          <LanerCard
                            key={player.playerSlot}
                            player={player}
                            isRadiant={false}
                            roleTag={roleTag}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LanerCard({
  player,
  isRadiant,
  roleTag,
}: {
  player: MatchPlayerDetailed;
  isRadiant: boolean;
  roleTag: string;
}) {
  const isCarry = roleTag === "CARRY";
  const isOfflane = roleTag === "OFFLANE";
  const isMid = roleTag === "MIDLANER";

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-sm bg-zinc-950/80 border border-white/[0.06] hover:border-white/[0.15] transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative w-11 h-8 rounded-sm overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
          <Image src={player.heroImg} alt={player.heroLocalizedName} fill sizes="44px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-mono font-bold text-white truncate">
              {player.personaName}
            </span>
            {/* Explicit Lane Role Badge */}
            <span
              className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-xs border ${
                isCarry
                  ? "bg-amber-950/90 text-amber-300 border-amber-600/60"
                  : isOfflane
                  ? "bg-rose-950/90 text-rose-300 border-rose-600/60"
                  : isMid
                  ? "bg-sky-950/90 text-sky-300 border-sky-600/60"
                  : "bg-teal-950/90 text-teal-300 border-teal-600/60"
              }`}
            >
              {roleTag}
            </span>
          </div>

          <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 flex-wrap">
            <span>{player.heroLocalizedName}</span>
            {player.laneOutcome && player.laneOutcome !== "Unavailable" && (
              <>
                <span className="text-zinc-600">•</span>
                <span
                  className={
                    player.laneOutcome === "Won"
                      ? "text-emerald-400 font-bold"
                      : player.laneOutcome === "Lost"
                      ? "text-rose-400 font-bold"
                      : "text-zinc-400"
                  }
                >
                  {player.laneOutcome}
                </span>
              </>
            )}
            <span className="text-zinc-600">•</span>
            <span>{player.earlyDeaths} early deaths</span>
          </div>
        </div>
      </div>

      {/* 5m & 10m metrics */}
      <div className="text-right text-[11px] font-mono shrink-0">
        <div>
          <span className="text-zinc-500 text-[9px] mr-1">@ 10m CS:</span>
          <strong className="text-white">{player.lhAt10 ?? "—"}</strong>
        </div>
        <div>
          <span className="text-zinc-500 text-[9px] mr-1">@ 10m NW:</span>
          <strong className={isRadiant ? "text-emerald-400" : "text-rose-400"}>
            {player.netWorthAt10 ? player.netWorthAt10.toLocaleString() : "—"}
          </strong>
        </div>
      </div>
    </div>
  );
}
