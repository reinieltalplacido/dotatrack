"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ShoppingCart, Sparkles, AlertCircle, Zap, Award } from "lucide-react";
import { MatchPlayerDetailed } from "@/lib/opendota/match-types";

interface MatchItemTimelineProps {
  players: MatchPlayerDetailed[];
  isParsed: boolean;
}

export function MatchItemTimeline({ players, isParsed }: MatchItemTimelineProps) {
  const [selectedPlayerSlot, setSelectedPlayerSlot] = useState<number>(players[0]?.playerSlot ?? 0);

  const selectedPlayer = players.find((p) => p.playerSlot === selectedPlayerSlot) || players[0];

  const startingItems = selectedPlayer?.purchaseLog.filter((item) => item.isStartingItem) || [];
  const inGamePurchases = selectedPlayer?.purchaseLog.filter((item) => !item.isStartingItem) || [];
  const abilityUpgrades = selectedPlayer?.abilityUpgrades || [];

  // Group abilities for Dotabuff-style matrix
  const regularAbilitiesMap = new Map<number, { id: number; name: string; img: string }>();
  for (const u of abilityUpgrades) {
    if (!u.isTalent && !regularAbilitiesMap.has(u.abilityId)) {
      regularAbilitiesMap.set(u.abilityId, { id: u.abilityId, name: u.abilityName, img: u.img });
    }
  }
  const regularAbilities = Array.from(regularAbilitiesMap.values());
  const hasTalents = abilityUpgrades.some((u) => u.isTalent);
  const selectedTalents = abilityUpgrades.filter((u) => u.isTalent);

  // Compute cumulative rank of each regular ability at each level
  const rankMap: Record<number, number> = {};
  const abilityCounters: Record<number, number> = {};
  for (const u of abilityUpgrades) {
    if (!u.isTalent) {
      abilityCounters[u.abilityId] = (abilityCounters[u.abilityId] || 0) + 1;
      rankMap[u.level] = abilityCounters[u.abilityId];
    }
  }

  const maxLevel = abilityUpgrades.length > 0 ? Math.max(...abilityUpgrades.map((u) => u.level)) : 0;
  const levelColumns = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div className="tactical-panel p-4 sm:p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              SKILL BUILD &amp; ITEM TIMINGS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Level-by-level ability progression, talent selections, and chronological item purchase timestamps.
          </p>
        </div>
      </div>

      {!isParsed ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Build Events Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Detailed skill builds, item purchase logs, and timestamps require a parsed replay file.
            Final inventory items are visible in the Scoreboard section.
          </p>
        </div>
      ) : (
        <>
          {/* Player Selector Tabs */}
          <div className="flex items-center gap-1.5 mb-6 pb-2 border-b border-white/[0.04] overflow-x-auto no-scrollbar whitespace-nowrap">
            {players.map((p) => {
              const isSelected = p.playerSlot === selectedPlayerSlot;
              const teamBorder = p.isRadiant ? "border-emerald-500/40" : "border-rose-500/40";
              const teamActiveBg = p.isRadiant ? "bg-emerald-950/60" : "bg-rose-950/60";

              return (
                <button
                  key={p.playerSlot}
                  onClick={() => setSelectedPlayerSlot(p.playerSlot)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all cursor-pointer shrink-0 min-h-[38px] ${
                    isSelected
                      ? `${teamActiveBg} ${teamBorder} text-white font-bold`
                      : "bg-zinc-950 border-white/[0.06] text-zinc-400 hover:text-white"
                  }`}
                  title={`${p.personaName} (${p.heroLocalizedName})`}
                >
                  <div className="relative w-6 h-4 rounded-xs overflow-hidden shrink-0">
                    <Image src={p.heroImg} alt={p.heroLocalizedName} fill sizes="24px" className="object-cover" />
                  </div>
                  <span className="text-xs font-mono hidden sm:inline max-w-[100px] truncate">
                    {p.heroLocalizedName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Player Overview */}
          {selectedPlayer && (
            <div className="p-4 rounded-sm bg-zinc-950/80 border border-white/[0.06] mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-8 rounded-xs overflow-hidden border border-white/[0.1] bg-zinc-900 shrink-0">
                  <Image
                    src={selectedPlayer.heroImg}
                    alt={selectedPlayer.heroLocalizedName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-mono font-bold text-white">
                    {selectedPlayer.personaName} ({selectedPlayer.heroLocalizedName})
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    {selectedPlayer.isRadiant ? "The Radiant" : "The Dire"} • {selectedPlayer.netWorth.toLocaleString()} Net Worth • {selectedPlayer.goldPerMin} GPM
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-zinc-400">
                Level {selectedPlayer.level} • <strong className="text-white">{abilityUpgrades.length}</strong> Skills • <strong className="text-white">{selectedPlayer.purchaseLog.length}</strong> Items
              </div>
            </div>
          )}

          {/* Skill Build & Talent Progression Section */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                <span>Skill Build &amp; Talent Progression</span>
              </div>
              {abilityUpgrades.length > 0 && (
                <span className="text-[11px] font-mono text-zinc-400">
                  Levels 1–{maxLevel} ({abilityUpgrades.length} Upgrades Recorded)
                </span>
              )}
            </div>

            {abilityUpgrades.length === 0 ? (
              <div className="p-4 rounded-sm bg-zinc-950/60 border border-white/[0.04] text-center text-xs font-mono text-zinc-500">
                No ability upgrade sequence recorded for this player in replay data.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dotabuff-style Ability Level Matrix Table */}
                <div className="overflow-x-auto rounded-sm border border-white/[0.08] bg-black/40 p-2 sm:p-3">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-zinc-500 text-[10px]">
                        <th className="py-1.5 px-2 font-bold uppercase min-w-[140px] sm:min-w-[170px] sticky left-0 bg-[#0E1018] z-10 border-r border-white/[0.06]">
                          Ability
                        </th>
                        {levelColumns.map((lvl) => (
                          <th key={`lvl-th-${lvl}`} className="py-1.5 px-1 text-center min-w-[28px] sm:min-w-[32px]">
                            <span className="text-[10px] text-zinc-400 font-bold">{lvl}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {/* Regular Abilities Rows */}
                      {regularAbilities.map((ab) => (
                        <tr key={`matrix-ab-${ab.id}`} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-1.5 px-2 sticky left-0 bg-[#0E1018] z-10 border-r border-white/[0.06] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xs overflow-hidden border border-white/[0.08] bg-zinc-950 shrink-0">
                                <Image src={ab.img} alt={ab.name} fill sizes="32px" className="object-cover" />
                              </div>
                              <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px] sm:max-w-[150px]" title={ab.name}>
                                {ab.name}
                              </span>
                            </div>
                          </td>

                          {levelColumns.map((lvl) => {
                            const upgradedAtThisLevel = abilityUpgrades[lvl - 1];
                            const isThisAbility = upgradedAtThisLevel?.abilityId === ab.id;

                            return (
                              <td key={`cell-${ab.id}-${lvl}`} className="py-1.5 px-1 text-center">
                                {isThisAbility ? (
                                  <div
                                    className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.35)] flex items-center justify-center text-xs font-bold font-mono"
                                    title={`${ab.name} (Level ${rankMap[lvl]} at Hero Level ${lvl})`}
                                  >
                                    {rankMap[lvl]}
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-xs bg-zinc-950/40 border border-white/[0.02] flex items-center justify-center text-[10px] text-zinc-700">
                                    ·
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      {/* Talents Row (if any talent was leveled) */}
                      {hasTalents && (
                        <tr className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-1.5 px-2 sticky left-0 bg-[#0E1018] z-10 border-r border-white/[0.06] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.25)]">
                                <Award className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-amber-300">
                                Talents
                              </span>
                            </div>
                          </td>

                          {levelColumns.map((lvl) => {
                            const upgrade = abilityUpgrades[lvl - 1];
                            const isTalentAtThisLevel = upgrade?.isTalent;

                            return (
                              <td key={`cell-talent-${lvl}`} className="py-1.5 px-1 text-center">
                                {isTalentAtThisLevel ? (
                                  <div
                                    className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-xs bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.4)] flex items-center justify-center text-xs font-bold cursor-help"
                                    title={`Hero Level ${lvl} Talent: ${upgrade.abilityName}`}
                                  >
                                    <Award className="h-3.5 w-3.5 text-amber-300" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-xs bg-zinc-950/40 border border-white/[0.02] flex items-center justify-center text-[10px] text-zinc-700">
                                    ·
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Selected Talents Breakdown */}
                {selectedTalents.length > 0 && (
                  <div className="p-3 rounded-sm bg-zinc-950/60 border border-white/[0.06]">
                    <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      <span>Chosen Talents</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalents.map((t, idx) => (
                        <div
                          key={`chosen-talent-${idx}`}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono"
                        >
                          <span className="font-bold text-amber-400">Level {t.level}:</span>
                          <span>{t.abilityName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Starting Items Section */}
          {startingItems.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Starting Inventory (Pre-Game Horn)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {startingItems.map((item, idx) => (
                  <div
                    key={`start-${idx}`}
                    className="p-2 rounded-sm bg-zinc-950 border border-white/[0.06] flex items-center gap-2"
                  >
                    <div className="relative w-7 h-6 rounded-xs overflow-hidden bg-black shrink-0">
                      <Image src={item.img} alt={item.name} fill sizes="28px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-bold text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {item.timeFormatted}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Game Chronological Item Timeline */}
          <div>
            <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-rose-500" />
              <span>In-Game Item Milestones</span>
            </div>

            {inGamePurchases.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500">No in-game purchases recorded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {inGamePurchases.map((item, idx) => (
                  <div
                    key={`ingame-${idx}`}
                    className="p-2.5 rounded-sm bg-zinc-950/80 border border-white/[0.06] hover:border-white/[0.15] transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-6 rounded-xs overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                        <Image src={item.img} alt={item.name} fill sizes="32px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-bold text-white truncate">
                          {item.name}
                        </div>
                        {item.cost && (
                          <div className="text-[10px] font-mono text-amber-400">
                            {item.cost.toLocaleString()} gold
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded-xs bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-rose-300 font-bold shrink-0">
                      {item.timeFormatted}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
