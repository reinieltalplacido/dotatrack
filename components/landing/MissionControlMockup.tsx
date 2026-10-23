"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  TrendingUp,
  Activity,
  Flame,
  Clock,
  ArrowRight,
  Shield,
  Check,
  ExternalLink,
} from "lucide-react";

interface TopHero {
  name: string;
  games: string;
  winrate: string;
  gpm: string;
  kda: string;
}

interface RecentMatch {
  hero: string;
  result: "WON" | "LOST";
  kda: string;
  duration: string;
  time: string;
  networth: string;
}

interface PlayerProfile {
  name: string;
  team: string;
  role: string;
  initials: string;
  accountId: string;
  rank: string;
  rankBadge: string;
  winRate: string;
  record: string;
  matches: string;
  avgKda: string;
  kdaRatio: string;
  gpm: string;
  xpm: string;
  recentForm: ("W" | "L")[];
  formSummary: string;
  laneEfficiency: string;
  topHeroes: TopHero[];
  recentMatches: RecentMatch[];
}

const PLAYER_PROFILES: PlayerProfile[] = [
  {
    name: "Yatoro",
    team: "Team Spirit",
    role: "Carry (Pos 1)",
    initials: "YTR",
    accountId: "321580662",
    rank: "Immortal #1",
    rankBadge: "Immortal Rank #1",
    winRate: "63.8%",
    record: "5,842W - 3,312L",
    matches: "9,154",
    avgKda: "11.6 / 3.1 / 10.4",
    kdaRatio: "7.10",
    gpm: "842",
    xpm: "880",
    recentForm: ["W", "W", "W", "W", "L", "W", "W", "W", "W", "W"],
    formSummary: "17W - 3L (85% Last 20)",
    laneEfficiency: "78.4 CS@10 (Top 0.1%)",
    topHeroes: [
      { name: "Morphling", games: "542", winrate: "68.4%", gpm: "860", kda: "12.4/2.1/9.8" },
      { name: "Terrorblade", games: "389", winrate: "64.2%", gpm: "815", kda: "9.8/3.4/8.6" },
      { name: "Phantom Assassin", games: "310", winrate: "62.8%", gpm: "785", kda: "11.2/3.8/9.0" },
    ],
    recentMatches: [
      { hero: "Morphling", result: "WON", kda: "14/1/9", duration: "34:12", time: "2h ago", networth: "26.4k" },
      { hero: "Terrorblade", result: "WON", kda: "9/2/11", duration: "28:45", time: "5h ago", networth: "22.8k" },
      { hero: "Phantom Assassin", result: "LOST", kda: "8/4/6", duration: "41:10", time: "7h ago", networth: "24.1k" },
    ],
  },
  {
    name: "Miracle-",
    team: "Nigma Galaxy",
    role: "Mid / Carry (Pos 2)",
    initials: "MRC",
    accountId: "105248644",
    rank: "Immortal #14",
    rankBadge: "Immortal Rank #14",
    winRate: "64.2%",
    record: "6,920W - 3,854L",
    matches: "10,774",
    avgKda: "12.8 / 3.4 / 11.2",
    kdaRatio: "7.06",
    gpm: "820",
    xpm: "855",
    recentForm: ["W", "W", "L", "W", "W", "W", "W", "L", "W", "W"],
    formSummary: "15W - 5L (75% Last 20)",
    laneEfficiency: "82.1 CS@10 (Top 0.1%)",
    topHeroes: [
      { name: "Invoker", games: "820", winrate: "66.5%", gpm: "780", kda: "11.8/3.2/13.5" },
      { name: "Anti-Mage", games: "412", winrate: "65.1%", gpm: "895", kda: "10.2/2.4/6.8" },
      { name: "Shadow Fiend", games: "390", winrate: "63.4%", gpm: "790", kda: "12.5/4.1/9.2" },
    ],
    recentMatches: [
      { hero: "Invoker", result: "WON", kda: "16/2/14", duration: "38:20", time: "1h ago", networth: "28.5k" },
      { hero: "Anti-Mage", result: "WON", kda: "11/1/7", duration: "31:15", time: "4h ago", networth: "25.2k" },
      { hero: "Shadow Fiend", result: "WON", kda: "13/3/9", duration: "29:40", time: "8h ago", networth: "21.6k" },
    ],
  },
  {
    name: "Topson",
    team: "Tundra Esports",
    role: "Midlane (Pos 2)",
    initials: "TOP",
    accountId: "94054712",
    rank: "2x TI Champion",
    rankBadge: "Immortal Leaderboard",
    winRate: "61.8%",
    record: "7,140W - 4,410L",
    matches: "11,550",
    avgKda: "10.4 / 4.6 / 13.8",
    kdaRatio: "5.26",
    gpm: "740",
    xpm: "795",
    recentForm: ["W", "W", "W", "L", "W", "W", "L", "W", "W", "W"],
    formSummary: "14W - 6L (70% Last 20)",
    laneEfficiency: "74.6 CS@10 (Top 0.5%)",
    topHeroes: [
      { name: "Monkey King", games: "610", winrate: "64.8%", gpm: "760", kda: "11.5/4.2/12.4" },
      { name: "Invoker", games: "540", winrate: "62.1%", gpm: "750", kda: "9.8/3.9/14.0" },
      { name: "Pugna", games: "380", winrate: "63.5%", gpm: "680", kda: "8.6/4.5/15.2" },
    ],
    recentMatches: [
      { hero: "Monkey King", result: "WON", kda: "15/3/12", duration: "32:50", time: "3h ago", networth: "23.4k" },
      { hero: "Pugna", result: "WON", kda: "7/2/18", duration: "26:10", time: "6h ago", networth: "16.8k" },
      { hero: "Invoker", result: "LOST", kda: "9/5/11", duration: "39:45", time: "9h ago", networth: "22.1k" },
    ],
  },
];

type ProfileTab = "performance" | "heroes" | "matches";

export function MissionControlMockup() {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ProfileTab>("performance");
  const player = PLAYER_PROFILES[activePlayerIndex];

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none perspective-container">
      {/* Outer ambient red glow behind card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-red-600/25 via-red-700/20 to-red-950/25 rounded-2xl blur-2xl opacity-75 pointer-events-none transform -rotate-1" />

      {/* Main Profile Card Container (Fixed 3D tilt, no tilt on hover) */}
      <div
        className="relative rounded-2xl border border-white/15 bg-[#0D0E16]/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300 ease-out transform lg:[transform:rotateY(-10deg)_rotateX(6deg)]"
        style={{
          boxShadow:
            "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Top Header: Player Status & Preset Switcher */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400">
              PLAYER PROFILE // RECENT STATS
            </span>
          </div>

          {/* Quick Player Switcher Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-black/50 border border-white/[0.06]">
            {PLAYER_PROFILES.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActivePlayerIndex(idx)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  activePlayerIndex === idx
                    ? "bg-rose-600 text-white font-bold shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Player Identity Banner */}
        <div className="my-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar Badge */}
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-rose-950 via-zinc-900 to-black border border-rose-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-rose-950/40">
              <span className="font-mono font-black text-sm text-rose-200">
                {player.initials}
              </span>
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0D0E16]" />
            </div>

            {/* Names & Rank */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {player.name}
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1">
                  <Trophy className="w-2.5 h-2.5" />
                  {player.rank}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {player.team} • {player.role}
              </p>
            </div>
          </div>

          {/* Steam Account ID */}
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">
              STEAM ID
            </span>
            <span className="text-xs font-mono font-semibold text-zinc-300">
              {player.accountId}
            </span>
          </div>
        </div>

        {/* Core KPI Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] mb-4">
          <div className="text-left px-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              WIN RATE
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-400 block mt-0.5">
              {player.winRate}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block truncate">
              {player.record}
            </span>
          </div>

          <div className="text-left px-2 border-x border-white/[0.06]">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              KDA RATIO
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-white block mt-0.5">
              {player.kdaRatio}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block truncate">
              {player.avgKda}
            </span>
          </div>

          <div className="text-left px-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              EFFICIENCY
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-amber-300 block mt-0.5">
              {player.gpm} GPM
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block truncate">
              {player.xpm} XPM
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-black/50 border border-white/[0.06] mb-3">
          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "performance"
                ? "bg-rose-600/30 text-white border border-rose-500/40 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Form &amp; Impact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("heroes")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "heroes"
                ? "bg-rose-600/30 text-white border border-rose-500/40 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Top Heroes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("matches")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "matches"
                ? "bg-rose-600/30 text-white border border-rose-500/40 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Matches</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[160px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "performance" && (
              <motion.div
                key={`perf-${player.name}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5"
              >
                {/* Recent 10 Matches Form Pills */}
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-zinc-400">RECENT FORM (LAST 10)</span>
                    <span className="text-emerald-400 font-bold">{player.formSummary}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {player.recentForm.map((res, i) => (
                      <span
                        key={i}
                        className={`flex-1 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                          res === "W"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">LANE IMPACT</span>
                    <span className="text-white font-bold mt-0.5 block truncate">
                      {player.laneEfficiency}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">ADVANTAGE SWING</span>
                    <span className="text-rose-400 font-bold mt-0.5 block">
                      +4,850 Gold @ 20m
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "heroes" && (
              <motion.div
                key={`heroes-${player.name}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {player.topHeroes.map((hero, i) => (
                  <div
                    key={hero.name}
                    className="p-2 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-zinc-500 text-[10px] w-3">
                        #{i + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{hero.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {hero.games} Matches • {hero.kda} KDA
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 block">
                        {hero.winrate}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {hero.gpm} GPM
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "matches" && (
              <motion.div
                key={`matches-${player.name}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {player.recentMatches.map((m, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          m.result === "WON"
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {m.result}
                      </span>
                      <div>
                        <span className="font-bold text-white">{m.hero}</span>
                        <span className="text-zinc-500 text-[10px] font-mono ml-2">
                          {m.duration}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-200 block text-[11px]">
                        {m.kda}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Profile Action Link */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400">
            OpenDota Match Records • Patch 7.37e
          </span>
          <Link
            href={`/player/${player.accountId}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span>VIEW FULL PROFILE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
