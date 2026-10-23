"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  Activity,
  Clock,
  ArrowRight,
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
  winRate: string;
  record: string;
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

const PLAYER: PlayerProfile = {
  name: "Yatoro",
  team: "Team Spirit",
  role: "Carry · Pos 1",
  initials: "YTR",
  accountId: "321580662",
  rank: "Immortal #1",
  winRate: "63.8%",
  record: "5,842W – 3,312L",
  avgKda: "11.6 / 3.1 / 10.4",
  kdaRatio: "7.10",
  gpm: "842",
  xpm: "880",
  recentForm: ["W", "W", "W", "W", "L", "W", "W", "W", "W", "W"],
  formSummary: "17W – 3L  (85%)",
  laneEfficiency: "78.4 CS@10",
  topHeroes: [
    { name: "Morphling", games: "542", winrate: "68.4%", gpm: "860", kda: "12.4 / 2.1 / 9.8" },
    { name: "Terrorblade", games: "389", winrate: "64.2%", gpm: "815", kda: "9.8 / 3.4 / 8.6" },
    { name: "Phantom Assassin", games: "310", winrate: "62.8%", gpm: "785", kda: "11.2 / 3.8 / 9.0" },
  ],
  recentMatches: [
    { hero: "Morphling", result: "WON", kda: "14 / 1 / 9", duration: "34:12", time: "2h ago", networth: "26.4k" },
    { hero: "Terrorblade", result: "WON", kda: "9 / 2 / 11", duration: "28:45", time: "5h ago", networth: "22.8k" },
    { hero: "Phantom Assassin", result: "LOST", kda: "8 / 4 / 6", duration: "41:10", time: "7h ago", networth: "24.1k" },
  ],
};

type ProfileTab = "form" | "heroes" | "matches";

export function MissionControlMockup() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("form");
  const player = PLAYER;

  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none perspective-[1200px]">
      {/* Soft ambient glow behind card */}
      <div
        className="absolute -inset-6 rounded-3xl pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(220, 38, 38, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* 3D Card */}
      <div
        className="relative rounded-2xl overflow-hidden transition-transform duration-500 ease-out lg:[transform:rotateY(-6deg)_rotateX(4deg)] hover:lg:[transform:rotateY(-2deg)_rotateX(1deg)]"
        style={{
          transformStyle: "preserve-3d",
          background: "linear-gradient(165deg, #111318 0%, #0C0D12 40%, #0A0B0F 100%)",
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.07)",
            "0 2px 4px rgba(0,0,0,0.3)",
            "0 12px 40px -8px rgba(0,0,0,0.7)",
            "0 30px 60px -12px rgba(0,0,0,0.5)",
            "0 0 80px -20px rgba(220, 38, 38, 0.12)",
          ].join(", "),
        }}
      >
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Player identity ── */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Avatar */}
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-rose-900/50 via-zinc-900 to-zinc-950 border border-white/[0.08] flex items-center justify-center shrink-0">
                <span className="font-mono font-black text-[13px] text-rose-300/80">
                  {player.initials}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0C0D12]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-white tracking-tight">
                    {player.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400/90 font-mono">
                    <Trophy className="w-2.5 h-2.5" />
                    {player.rank}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {player.team} · {player.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="mx-5 mb-4 rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
            {[
              { label: "Win Rate", value: player.winRate, sub: player.record, color: "text-emerald-400" },
              { label: "KDA", value: player.kdaRatio, sub: player.avgKda, color: "text-white" },
              { label: "GPM", value: player.gpm, sub: `${player.xpm} XPM`, color: "text-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="px-3 py-2.5 text-center">
                <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className={`text-base font-bold font-mono block mt-0.5 tabular-nums ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-[9px] text-zinc-600 font-mono tabular-nums block">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div className="mx-5 mb-3 flex rounded-lg bg-white/[0.02] border border-white/[0.05] p-0.5">
          {([
            { key: "form" as const, label: "Form", icon: Activity },
            { key: "heroes" as const, label: "Top Heroes", icon: Swords },
            { key: "matches" as const, label: "Matches", icon: Clock },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === key
                  ? "bg-white/[0.06] text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="min-h-[140px] mx-5 mb-5">
          <AnimatePresence mode="wait">
            {activeTab === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-3"
              >
                {/* Win/Loss streak */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Last 10 Games</span>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono tabular-nums">
                      {player.formSummary}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {player.recentForm.map((res, i) => (
                      <span
                        key={i}
                        className={`flex-1 h-[22px] rounded-md flex items-center justify-center text-[9px] font-bold font-mono transition-colors ${
                          res === "W"
                            ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/15"
                            : "bg-rose-500/12 text-rose-400 border border-rose-500/15"
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics pair */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5">
                    <span className="text-[9px] text-zinc-500 font-medium block">Lane Impact</span>
                    <span className="text-[13px] text-white font-semibold font-mono block mt-0.5 tabular-nums">
                      {player.laneEfficiency}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5">
                    <span className="text-[9px] text-zinc-500 font-medium block">Net Adv. @20m</span>
                    <span className="text-[13px] text-rose-400 font-semibold font-mono block mt-0.5 tabular-nums">
                      +4,850 Gold
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "heroes" && (
              <motion.div
                key="heroes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-1.5"
              >
                {player.topHeroes.map((hero, i) => (
                  <div
                    key={hero.name}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-zinc-600 w-3 tabular-nums">
                        {i + 1}
                      </span>
                      <div>
                        <span className="text-[12px] font-semibold text-white block">{hero.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
                          {hero.games} games · {hero.kda}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-bold text-emerald-400 font-mono block tabular-nums">
                        {hero.winrate}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
                        {hero.gpm} GPM
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "matches" && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-1.5"
              >
                {player.recentMatches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-9 py-0.5 rounded-md text-center text-[9px] font-bold font-mono ${
                          m.result === "WON"
                            ? "bg-emerald-500/12 text-emerald-400"
                            : "bg-rose-500/12 text-rose-400"
                        }`}
                      >
                        {m.result === "WON" ? "W" : "L"}
                      </span>
                      <div>
                        <span className="text-[12px] font-semibold text-white">{m.hero}</span>
                        <span className="text-[10px] text-zinc-600 font-mono ml-1.5 tabular-nums">
                          {m.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-zinc-300 font-mono block tabular-nums">
                        {m.kda}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-mono">{m.time}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="border-t border-white/[0.05] px-5 py-3 flex items-center justify-end">
          <Link
            href={`/player/${player.accountId}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <span>View full profile</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
