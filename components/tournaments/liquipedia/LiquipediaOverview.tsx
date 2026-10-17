"use client";

import { useState } from "react";
import NextImage from "next/image";
import { TournamentSummary, TournamentTeam } from "@/lib/opendota/tournaments-types";
import { generateLiquipediaPrizePool, PrizePlacementItem } from "./liquipedia-data";
import { AlertTriangle, Trophy, ChevronDown, ChevronUp, Users, Shield, Calendar, MapPin } from "lucide-react";

interface LiquipediaOverviewProps {
  tournament: TournamentSummary;
  teams: TournamentTeam[];
}

export function LiquipediaOverview({ tournament, teams }: LiquipediaOverviewProps) {
  const [showAllPlacements, setShowAllPlacements] = useState(false);

  const totalPrizeNumber = tournament.numericPrizePool || 1000000;
  const prizePoolItems = generateLiquipediaPrizePool(totalPrizeNumber, teams);

  const displayedPlacements = showAllPlacements ? prizePoolItems : prizePoolItems.slice(0, 4);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Liquipedia Under Construction Notice (Image 2) */}
      <div className="rounded-sm border border-[#78101a] bg-[#540910] p-3 flex items-center gap-3 shadow-md max-w-2xl">
        <div className="bg-amber-500/20 p-1.5 rounded-xs border border-amber-500/30 text-amber-300 shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="text-xs font-sans text-zinc-100">
          <span>This tournament page is </span>
          <strong className="text-white font-bold">under construction</strong>
          <span> and is subject to major revisions.</span>
        </div>
      </div>

      {/* Format Section (Image 2) */}
      <div className="space-y-3">
        <div className="border-b border-white/[0.08] pb-1.5 flex items-center justify-between">
          <h2 className="text-xl font-sans font-bold text-white flex items-center gap-2">
            <span>Format</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-normal">[edit]</span>
          </h2>
        </div>

        <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] bg-[#0E1017] space-y-4 font-mono text-xs text-zinc-300">
          <div>
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>Group Stage</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>24 teams swiss-system or dual round-robin groups</li>
              <li>All matches are <span className="text-zinc-200 font-bold">Bo3</span></li>
              <li>
                <span className="text-emerald-400 font-bold">Top eight teams</span> advance to the Double-Elimination Playoffs
              </li>
              <li>Remaining teams are eliminated with baseline club prize distribution</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>Playoffs</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Double-elimination bracket with Upper and Lower seed brackets</li>
              <li>All matches (except Grand Final) are <span className="text-zinc-200 font-bold">Bo3</span></li>
              <li>
                Grand Final is <span className="text-amber-400 font-bold">Bo5</span> with no winner advantage
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Prize Pool Section (Image 3) */}
      <div className="space-y-4">
        <div className="border-b border-white/[0.08] pb-1.5 flex items-center justify-between">
          <h2 className="text-xl font-sans font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span>Prize Pool &amp; Placement</span>
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded">
            Total: {formatCurrency(totalPrizeNumber)} USD
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Liquipedia Placement Table (Image 3) */}
          <div className="lg:col-span-3 overflow-x-auto rounded-sm border border-white/[0.08] bg-[#0E1017]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] tracking-wider bg-black/40">
                  <th className="py-2.5 px-3 w-16 text-center">Place</th>
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3 text-right">$ USD</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">Player Prize</th>
                  <th className="py-2.5 px-3 text-right hidden md:table-cell">Club Reward</th>
                  <th className="py-2.5 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displayedPlacements.map((p, idx) => {
                  return (
                    <tr key={`${p.place}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                      {/* Place badge */}
                      <td className="py-2.5 px-3 text-center">
                        {p.badgeType === "gold" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#846b10] text-[#ffe680] border border-[#d4af37]/60 shadow-xs">
                            1st
                          </span>
                        ) : p.badgeType === "silver" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#1d424e] text-[#a5e3f6] border border-[#38bdf8]/50 shadow-xs">
                            2nd
                          </span>
                        ) : p.badgeType === "bronze" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#482811] text-[#f7ba8b] border border-[#cd7f32]/50 shadow-xs">
                            3rd
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-bold">{p.place}</span>
                        )}
                      </td>

                      {/* Participant */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-5 w-5 rounded bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {p.teamLogo ? (
                              <NextImage
                                src={p.teamLogo}
                                alt={p.teamName || "Team"}
                                fill
                                unoptimized
                                sizes="20px"
                                className="object-contain p-0.5"
                              />
                            ) : (
                              <Users className="h-3 w-3 text-zinc-500" />
                            )}
                          </div>
                          <span className={`font-bold ${p.teamName === "TBD" ? "text-zinc-500" : "text-white"}`}>
                            {p.teamName}
                          </span>
                        </div>
                      </td>

                      {/* Total Prize */}
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        {formatCurrency(p.totalPrizeUsd)}
                      </td>

                      {/* Player Prize */}
                      <td className="py-2.5 px-3 text-right text-zinc-300 hidden sm:table-cell">
                        {formatCurrency(p.playerPrizeUsd)}
                      </td>

                      {/* Club Reward */}
                      <td className="py-2.5 px-3 text-right text-zinc-400 hidden md:table-cell">
                        {formatCurrency(p.clubRewardUsd)}
                      </td>

                      {/* Points */}
                      <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                        {p.points.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Expand / Collapse toggle */}
            <div className="p-2 border-t border-white/[0.06] text-center bg-black/20">
              <button
                type="button"
                onClick={() => setShowAllPlacements(!showAllPlacements)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 px-3"
              >
                <span>{showAllPlacements ? "Show less" : `Show remaining (${prizePoolItems.length - 4})`}</span>
                {showAllPlacements ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Liquipedia Right Quick Box (Image 3 right box) */}
          <div className="rounded-sm border border-white/[0.08] bg-[#0E1017] p-4 font-mono text-xs space-y-3">
            <div className="border-b border-white/[0.08] pb-2 text-zinc-400 text-[11px] font-bold uppercase tracking-wider text-center">
              Base Placement Summary
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-[#846b10] text-[#ffe680] font-bold text-[10px]">1st</span>
                <span className="text-white font-bold">{formatCurrency(Math.round(totalPrizeNumber * 0.16))}</span>
                <span className="text-amber-400 font-bold">3,000 pts</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-[#1d424e] text-[#a5e3f6] font-bold text-[10px]">2nd</span>
                <span className="text-white font-bold">{formatCurrency(Math.round(totalPrizeNumber * 0.115))}</span>
                <span className="text-amber-400 font-bold">2,500 pts</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-[#482811] text-[#f7ba8b] font-bold text-[10px]">3rd</span>
                <span className="text-white font-bold">{formatCurrency(Math.round(totalPrizeNumber * 0.078))}</span>
                <span className="text-amber-400 font-bold">2,000 pts</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 leading-relaxed">
              Official circuit points count toward The International &amp; Riyadh Masters direct qualifying invites.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
