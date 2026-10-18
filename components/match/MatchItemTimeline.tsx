"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ShoppingCart, Sparkles, AlertCircle } from "lucide-react";
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

  return (
    <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="h-4 w-4 text-rose-500" />
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
              ITEM BUILD &amp; PURCHASE TIMINGS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Chronological purchase timestamps derived from recorded replay events.
          </p>
        </div>
      </div>

      {!isParsed ? (
        <div className="p-8 text-center rounded-sm bg-black/40 border border-white/[0.04]">
          <AlertCircle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white mb-1">
            Item Purchase Events Unavailable (Unparsed Replay)
          </h3>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed">
            Detailed item purchase logs and timestamps require a parsed replay file.
            Final inventory items are visible in the Scoreboard section.
          </p>
        </div>
      ) : (
        <>
          {/* Player Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6 pb-2 border-b border-white/[0.04]">
            {players.map((p) => {
              const isSelected = p.playerSlot === selectedPlayerSlot;
              const teamBorder = p.isRadiant ? "border-emerald-500/40" : "border-rose-500/40";
              const teamActiveBg = p.isRadiant ? "bg-emerald-950/60" : "bg-rose-950/60";

              return (
                <button
                  key={p.playerSlot}
                  onClick={() => setSelectedPlayerSlot(p.playerSlot)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm border transition-all cursor-pointer ${
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
                Total Item Events: <strong className="text-white">{selectedPlayer.purchaseLog.length}</strong>
              </div>
            </div>
          )}

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
