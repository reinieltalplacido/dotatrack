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
                isRadiant ? "bg-emerald-500 text-black" : "bg-rose-500 text-white"
              }`}
            >
              VICTORIOUS
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
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
        <table className="w-full text-left border-collapse text-xs font-mono min-w-[950px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-black/40 text-[10px] uppercase text-zinc-400 tracking-wider">
              <th className="py-2.5 px-3">Hero / Player</th>
              <th className="py-2.5 px-2 text-center">LVL</th>
              <th className="py-2.5 px-2 text-center">K / D / A</th>
              <th className="py-2.5 px-2 text-center">KDA</th>
              <th className="py-2.5 px-2 text-right">NET WORTH</th>
              <th className="py-2.5 px-2 text-center">LH / DN</th>
              <th className="py-2.5 px-2 text-center">GPM / XPM</th>
              <th className="py-2.5 px-2 text-right">HERO DMG</th>
              <th className="py-2.5 px-2 text-right">BLDG DMG</th>
              <th className="py-2.5 px-2 text-right">HEAL</th>
              <th className="py-2.5 px-2 text-center">WARDS</th>
              <th className="py-2.5 px-3 text-center">ITEMS &amp; BACKPACK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {players.map((player) => (
              <tr key={player.playerSlot} className="hover:bg-white/[0.02] transition-colors">
                {/* Hero Portrait & Player Name */}
                <td className="py-2.5 px-3">
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {player.accountId ? (
                          <Link
                            href={`/player/${player.accountId}`}
                            className="font-bold text-white hover:text-rose-400 truncate block transition-colors text-xs"
                          >
                            {player.personaName}
                          </Link>
                        ) : (
                          <span className="font-bold text-zinc-300 truncate block text-xs">
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
                                ? "text-emerald-400 font-bold ml-0.5"
                                : player.laneOutcome === "Lost"
                                ? "text-rose-400 font-bold ml-0.5"
                                : "text-zinc-500 font-medium ml-0.5"
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
                <td className="py-2.5 px-2 text-center font-bold text-zinc-300">
                  {player.level}
                </td>

                {/* K/D/A */}
                <td className="py-2.5 px-2 text-center">
                  <span className="text-emerald-400 font-bold">{player.kills}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-rose-400 font-bold">{player.deaths}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-amber-400 font-bold">{player.assists}</span>
                </td>

                {/* KDA Ratio */}
                <td className="py-2.5 px-2 text-center text-zinc-300">
                  {player.kda.toFixed(2)}
                </td>

                {/* Net Worth */}
                <td className="py-2.5 px-2 text-right font-bold text-amber-400">
                  {player.netWorth.toLocaleString()}
                </td>

                {/* LH / DN */}
                <td className="py-2.5 px-2 text-center text-zinc-300">
                  {player.lastHits} <span className="text-zinc-600">/</span> {player.denies}
                </td>

                {/* GPM / XPM */}
                <td className="py-2.5 px-2 text-center text-zinc-300">
                  <span className="text-amber-300">{player.goldPerMin}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-blue-300">{player.xpPerMin}</span>
                </td>

                {/* Hero Damage */}
                <td className="py-2.5 px-2 text-right text-zinc-200">
                  {player.heroDamage.toLocaleString()}
                  <span className="text-[9px] text-zinc-500 block">
                    {player.damageShare}% team
                  </span>
                </td>

                {/* Tower Damage */}
                <td className="py-2.5 px-2 text-right text-zinc-300">
                  {player.towerDamage.toLocaleString()}
                </td>

                {/* Healing */}
                <td className="py-2.5 px-2 text-right text-zinc-400">
                  {player.heroHealing > 0 ? player.heroHealing.toLocaleString() : "—"}
                </td>

                {/* Wards (Observer / Sentry) */}
                <td className="py-2.5 px-2 text-center text-zinc-400">
                  <span className="text-amber-300 font-medium">{player.obsPlaced || "-"}</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-sky-300 font-medium">{player.senPlaced || "-"}</span>
                </td>

                {/* Items & Backpack */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* 6 Main Items */}
                    <div className="grid grid-cols-6 gap-0.5 bg-black/60 p-0.5 rounded-xs border border-white/[0.06]">
                      {player.items.map((item, idx) => (
                        <div
                          key={`item-${idx}`}
                          className="relative w-6 h-5 bg-zinc-950 rounded-xs overflow-hidden border border-white/[0.04]"
                          title={item?.name || "Empty"}
                        >
                          {item ? (
                            <Image src={item.img} alt={item.name} fill sizes="24px" className="object-cover" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {/* Backpack 3 Items */}
                    <div className="grid grid-cols-3 gap-0.5 bg-zinc-900/60 p-0.5 rounded-xs border border-white/[0.04]">
                      {player.backpack.map((item, idx) => (
                        <div
                          key={`bp-${idx}`}
                          className="relative w-5 h-4 bg-zinc-950 rounded-xs overflow-hidden border border-white/[0.04] opacity-75"
                          title={`Backpack: ${item?.name || "Empty"}`}
                        >
                          {item ? (
                            <Image src={item.img} alt={item.name} fill sizes="20px" className="object-cover" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {/* Neutral Item */}
                    <div
                      className="relative w-6 h-5 rounded-xs overflow-hidden border border-amber-500/40 bg-zinc-950"
                      title={`Neutral: ${player.neutralItem?.name || "None"}`}
                    >
                      {player.neutralItem ? (
                        <Image src={player.neutralItem.img} alt={player.neutralItem.name} fill sizes="24px" className="object-cover" />
                      ) : null}
                    </div>

                    {/* Aghanim's Scepter / Shard Badges */}
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded-xs font-bold leading-tight ${
                          player.hasAghsScepter
                            ? "bg-blue-900/80 text-blue-200 border border-blue-600/50"
                            : "opacity-20 bg-zinc-900 text-zinc-600"
                        }`}
                        title="Aghanim's Scepter"
                      >
                        AGH
                      </span>
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded-xs font-bold leading-tight ${
                          player.hasAghsShard
                            ? "bg-cyan-900/80 text-cyan-200 border border-cyan-600/50"
                            : "opacity-20 bg-zinc-900 text-zinc-600"
                        }`}
                        title="Aghanim's Shard"
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
              <td className="py-2.5 px-3">
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
              <td className="py-2.5 px-2 text-center">—</td>
              <td className="py-2.5 px-2 text-center">{score} Kills</td>
              <td className="py-2.5 px-2 text-center">—</td>
              <td className="py-2.5 px-2 text-right text-amber-400">{totalNetWorth.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center">—</td>
              <td className="py-2.5 px-2 text-center">—</td>
              <td className="py-2.5 px-2 text-right">{totalDamage.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-right">{totalTowerDamage.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-right">—</td>
              <td className="py-2.5 px-2 text-center">
                <span className="text-amber-300">{totalObs}</span>
                <span className="text-zinc-600"> / </span>
                <span className="text-sky-300">{totalSen}</span>
              </td>
              <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
