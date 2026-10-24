"use client";

import Image from "next/image";
import Link from "next/link";
import { Swords, Shield, Zap, Sparkles } from "lucide-react";
import { MatchPlayerDetailed } from "@/lib/opendota/match-types";

interface MatchScoreboardProps {
  radiantPlayers: MatchPlayerDetailed[];
  direPlayers: MatchPlayerDetailed[];
  radiantScore: number;
  direScore: number;
  radiantWin: boolean;
}

export function MatchScoreboard({
  radiantPlayers,
  direPlayers,
  radiantScore,
  direScore,
  radiantWin,
}: MatchScoreboardProps) {
  return (
    <div className="space-y-8 mb-8">
      {/* Radiant Scoreboard */}
      <TeamScoreboardTable
        teamName="The Radiant"
        isRadiant={true}
        isWinner={radiantWin}
        score={radiantScore}
        players={radiantPlayers}
      />

      {/* Dire Scoreboard */}
      <TeamScoreboardTable
        teamName="The Dire"
        isRadiant={false}
        isWinner={!radiantWin}
        score={direScore}
        players={direPlayers}
      />
    </div>
  );
}

function TeamScoreboardTable({
  teamName,
  isRadiant,
  isWinner,
  score,
  players,
}: {
  teamName: string;
  isRadiant: boolean;
  isWinner: boolean;
  score: number;
  players: MatchPlayerDetailed[];
}) {
  const teamColor = isRadiant ? "text-emerald-400" : "text-rose-400";
  const teamBorder = isRadiant ? "border-emerald-500/30" : "border-rose-500/30";
  const headerBg = isRadiant ? "bg-emerald-950/40" : "bg-rose-950/40";

  const totalNetWorth = players.reduce((sum, p) => sum + p.netWorth, 0);
  const totalDamage = players.reduce((sum, p) => sum + p.heroDamage, 0);
  const totalTowerDamage = players.reduce((sum, p) => sum + p.towerDamage, 0);
  const totalObs = players.reduce((sum, p) => sum + (p.obsPlaced || 0), 0);
  const totalSen = players.reduce((sum, p) => sum + (p.senPlaced || 0), 0);

  // Determine overall Team Lane Outcome
  const laneOutcomeByLane = new Map<number, string>();
  players.forEach((p) => {
    if (p.lane && p.laneOutcome && p.laneOutcome !== "Unavailable") {
      laneOutcomeByLane.set(p.lane, p.laneOutcome);
    }
  });

  let teamLaneOutcome: "Won" | "Lost" | "Drew" | "Unavailable" = "Unavailable";
  if (laneOutcomeByLane.size > 0) {
    let wonCount = 0;
    let lostCount = 0;
    laneOutcomeByLane.forEach((outcome) => {
      if (outcome === "Won") wonCount++;
      if (outcome === "Lost") lostCount++;
    });

    if (wonCount > lostCount) teamLaneOutcome = "Won";
    else if (lostCount > wonCount) teamLaneOutcome = "Lost";
    else teamLaneOutcome = "Drew";
  }

  return (
    <div className={`tactical-panel rounded-sm border ${teamBorder} overflow-hidden`}>
      {/* Table Header Banner */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-white/[0.08] ${headerBg}`}>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono font-black uppercase tracking-wider ${teamColor}`}>
            {teamName}
          </span>
          {isWinner && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs uppercase ${
                isRadiant
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.25)]"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.25)]"
              }`}
            >
              {isRadiant ? "RADIANT VICTORY" : "DIRE VICTORY"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-zinc-300">
          <span className="text-[10px] font-mono text-zinc-400 sm:hidden flex items-center gap-1 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08]">
            Scroll &rarr;
          </span>
          <div>
            Kills: <strong className="text-white">{score}</strong>
          </div>
          <div className="hidden sm:block">
            Net Worth: <strong className={teamColor}>{totalNetWorth.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-white/[0.06] bg-black/40 text-[10px] uppercase text-zinc-400 tracking-wider">
              <th className="sticky left-0 bg-[#0E1018] z-20 py-2.5 px-3 whitespace-nowrap min-w-[180px] shadow-[3px_0_8px_rgba(0,0,0,0.6)] border-r border-white/[0.06]">Hero / Player</th>
              <th className="py-2.5 px-1.5 text-center whitespace-nowrap">LVL</th>
              <th className="py-2.5 px-2 text-center whitespace-nowrap">K / D / A</th>
              <th className="py-2.5 px-1.5 text-center whitespace-nowrap">KDA</th>
              <th className="py-2.5 px-2 text-right whitespace-nowrap">NET WORTH</th>
              <th className="py-2.5 px-2 text-center whitespace-nowrap">LH / DN</th>
              <th className="py-2.5 px-2 text-center whitespace-nowrap">GPM / XPM</th>
              <th className="py-2.5 px-2 text-right whitespace-nowrap">HERO DMG</th>
              <th className="py-2.5 px-2 text-right whitespace-nowrap">BLDG DMG</th>
              <th className="py-2.5 px-1.5 text-right whitespace-nowrap">HEAL</th>
              <th className="py-2.5 px-1.5 text-center whitespace-nowrap">WARDS</th>
              <th className="py-2.5 px-2 text-center whitespace-nowrap">ITEMS &amp; BACKPACK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {players.map((player) => (
              <tr key={player.playerSlot} className="hover:bg-white/[0.02] transition-colors group">
                {/* Hero Portrait & Player Name */}
                <td className="sticky left-0 bg-[#0E1018] group-hover:bg-[#12141F] transition-colors z-10 py-2.5 px-3 whitespace-nowrap min-w-[200px] max-w-[240px] shadow-[3px_0_8px_rgba(0,0,0,0.6)] border-r border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-11 h-7 rounded-xs overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
                      <Image
                        src={player.heroImg}
                        alt={player.heroLocalizedName}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 max-w-[170px]">
                      <div className="flex items-center gap-1.5">
                        {player.accountId ? (
                          <Link
                            href={`/player/${player.accountId}`}
                            className="font-bold text-white hover:text-rose-400 truncate block transition-colors text-xs"
                            title={player.personaName}
                          >
                            {player.personaName}
                          </Link>
                        ) : (
                          <span className="font-bold text-zinc-300 truncate block text-xs" title={player.personaName}>
                            {player.personaName}
                          </span>
                        )}
                      </div>

                      {/* OpenDota Lane & Outcome Indicator */}
                      <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                        <span className="text-zinc-400 truncate">{player.laneDescription}</span>
                        {player.laneOutcome && player.laneOutcome !== "Unavailable" && (
                          <span
                            className={
                              player.laneOutcome === "Won"
                                ? "text-emerald-400 font-bold ml-0.5 shrink-0"
                                : player.laneOutcome === "Lost"
                                ? "text-rose-400 font-bold ml-0.5 shrink-0"
                                : "text-zinc-500 font-medium ml-0.5 shrink-0"
                            }
                          >
                            {player.laneOutcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Level */}
                <td className="py-2.5 px-2 text-center font-bold text-zinc-300 whitespace-nowrap">
                  {player.level}
                </td>

                {/* K/D/A */}
                <td className="py-2.5 px-2 text-center whitespace-nowrap">
                  <span className="text-emerald-400 font-bold">{player.kills}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-rose-400 font-bold">{player.deaths}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-amber-400 font-bold">{player.assists}</span>
                </td>

                {/* KDA Ratio */}
                <td className="py-2.5 px-2 text-center text-zinc-300 whitespace-nowrap">
                  {player.kda.toFixed(2)}
                </td>

                {/* Net Worth */}
                <td className="py-2.5 px-2 text-right font-bold text-amber-400 whitespace-nowrap">
                  {player.netWorth.toLocaleString()}
                </td>

                {/* LH / DN */}
                <td className="py-2.5 px-2 text-center text-zinc-300 whitespace-nowrap">
                  <span>{player.lastHits}</span>
                  <span className="text-zinc-600"> / </span>
                  <span>{player.denies}</span>
                </td>

                {/* GPM / XPM */}
                <td className="py-2.5 px-2 text-center text-zinc-300 whitespace-nowrap">
                  <span className="text-amber-300">{player.goldPerMin}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-blue-300">{player.xpPerMin}</span>
                </td>

                {/* Hero Damage */}
                <td className="py-2.5 px-2 text-right text-zinc-200 whitespace-nowrap">
                  <div>{player.heroDamage.toLocaleString()}</div>
                  <div className="text-[9px] text-zinc-500 whitespace-nowrap">
                    {player.damageShare}% team
                  </div>
                </td>

                {/* Tower Damage */}
                <td className="py-2.5 px-2 text-right text-zinc-300 whitespace-nowrap">
                  {player.towerDamage.toLocaleString()}
                </td>

                {/* Healing */}
                <td className="py-2.5 px-2 text-right text-zinc-400 whitespace-nowrap">
                  {player.heroHealing > 0 ? player.heroHealing.toLocaleString() : "—"}
                </td>

                {/* Wards (Observer / Sentry) */}
                <td className="py-2.5 px-2 text-center text-zinc-400 whitespace-nowrap">
                  <span className="text-amber-300 font-medium">{player.obsPlaced || "-"}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-sky-300 font-medium">{player.senPlaced || "-"}</span>
                </td>

                {/* Items & Backpack */}
                <td className="py-2 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* 6 Main Items */}
                    <div className="grid grid-cols-6 gap-0.5 bg-black/70 p-0.5 rounded-xs border border-white/[0.08] shadow-inner">
                      {player.items.map((item, idx) => (
                        <div
                          key={`item-${idx}`}
                          className="relative w-10 h-7 bg-zinc-950 rounded-xs overflow-hidden border border-white/[0.08] shadow-xs"
                          title={item?.name || "Empty Item Slot"}
                        >
                          {item ? (
                            <Image src={item.img} alt={item.name} fill sizes="40px" className="object-cover hover:scale-105 transition-transform" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {/* Backpack 3 Items */}
                    <div className="grid grid-cols-3 gap-0.5 bg-zinc-950/80 p-0.5 rounded-xs border border-white/[0.06]" title="Backpack">
                      {player.backpack.map((item, idx) => (
                        <div
                          key={`bp-${idx}`}
                          className="relative w-7 h-5 bg-zinc-900/90 rounded-xs overflow-hidden border border-white/[0.06] opacity-75"
                          title={`Backpack: ${item?.name || "Empty Slot"}`}
                        >
                          {item ? (
                            <Image src={item.img} alt={item.name} fill sizes="28px" className="object-cover" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {/* Neutral Item - Circular style like Dota 2 / Dotabuff */}
                    <div
                      className={`relative w-7 h-7 rounded-full overflow-hidden shrink-0 ${
                        player.neutralItem
                          ? "border border-amber-400/60 bg-zinc-950 shadow-[0_0_8px_rgba(251,191,36,0.25)]"
                          : "border border-dashed border-white/10 bg-zinc-950/60"
                      }`}
                      title={`Neutral Item: ${player.neutralItem?.name || "None"}`}
                    >
                      {player.neutralItem ? (
                        <Image src={player.neutralItem.img} alt={player.neutralItem.name} fill sizes="28px" className="object-cover" />
                      ) : null}
                    </div>

                    {/* Aghanim's Scepter / Shard Badges */}
                    <div className="flex flex-col gap-1 justify-center shrink-0">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-xs font-bold leading-none tracking-tight text-center ${
                          player.hasAghsScepter
                            ? "bg-blue-950 text-blue-300 border border-blue-500/60 shadow-[0_0_6px_rgba(59,130,246,0.35)]"
                            : "opacity-25 bg-zinc-900 text-zinc-500 border border-white/[0.04]"
                        }`}
                        title={player.hasAghsScepter ? "Aghanim's Scepter Acquired" : "No Aghanim's Scepter"}
                      >
                        AGH
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-xs font-bold leading-none tracking-tight text-center ${
                          player.hasAghsShard
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-[0_0_6px_rgba(6,182,212,0.35)]"
                            : "opacity-25 bg-zinc-900 text-zinc-500 border border-white/[0.04]"
                        }`}
                        title={player.hasAghsShard ? "Aghanim's Shard Acquired" : "No Aghanim's Shard"}
                      >
                        SHARD
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Team Totals Footer Row */}
          <tfoot>
            <tr className="border-t border-white/[0.08] bg-black/60 font-bold text-zinc-300">
              <td className="sticky left-0 bg-[#0A0C13] z-10 py-2.5 px-3 whitespace-nowrap shadow-[3px_0_8px_rgba(0,0,0,0.6)] border-r border-white/[0.06]">
                <div className="text-zinc-300 font-bold">TEAM TOTALS</div>
                {teamLaneOutcome !== "Unavailable" && (
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5 font-normal">
                    Lane Outcome:{" "}
                    <span
                      className={
                        teamLaneOutcome === "Won"
                          ? "text-emerald-400 font-bold"
                          : teamLaneOutcome === "Lost"
                          ? "text-rose-400 font-bold"
                          : "text-zinc-400 font-semibold"
                      }
                    >
                      {teamLaneOutcome}
                    </span>
                  </div>
                )}
              </td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">—</td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">{score} Kills</td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">—</td>
              <td className="py-2.5 px-2 text-right text-amber-400 whitespace-nowrap">{totalNetWorth.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">—</td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">—</td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">{totalDamage.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">{totalTowerDamage.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">—</td>
              <td className="py-2.5 px-2 text-center whitespace-nowrap">
                <span className="text-amber-300">{totalObs}</span>
                <span className="text-zinc-600"> / </span>
                <span className="text-sky-300">{totalSen}</span>
              </td>
              <td className="py-2.5 px-3 text-center text-zinc-500 whitespace-nowrap">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
