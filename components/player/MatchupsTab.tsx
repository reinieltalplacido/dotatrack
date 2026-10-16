"use client";

import { Swords, Users, ShieldAlert, Cpu } from "lucide-react";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface MatchupsTabProps {
  data: PlayerDashboardData;
}

export function MatchupsTab({ data }: MatchupsTabProps) {
  return (
    <div className="space-y-6">
      {/* Feature In Development Banner */}
      <div className="tactical-panel p-8 text-center rounded-sm border border-white/[0.08]">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 mb-4">
          <Cpu className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-mono font-bold text-white mb-2 uppercase tracking-wider">
          Matchups & Synergy Matrix
        </h2>
        <p className="text-xs font-mono text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
          The automated hero synergy and counter matchup engine is currently under active calibration for Dota 2 Patch 7.37. Telemetry will calculate individual player win rates when paired with or playing against specific hero compositions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-[#0A0C13] border border-white/[0.06] p-4 rounded-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
              <Users className="h-4 w-4" />
              <span>ALLY SYNERGY RADAR (COMING SOON)</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 leading-normal">
              Reveals which allied hero picks statistically amplify {data.personaname}&apos;s win rate.
            </p>
          </div>

          <div className="bg-[#0A0C13] border border-white/[0.06] p-4 rounded-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold mb-1">
              <Swords className="h-4 w-4" />
              <span>NEMESIS COUNTER MATRIX (COMING SOON)</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 leading-normal">
              Identifies which enemy heroes historically cause the highest difficulty or defeat rates.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
          <ShieldAlert className="h-3.5 w-3.5 text-zinc-500" />
          <span>Status: Pipeline scheduled for Phase 3 release.</span>
        </div>
      </div>
    </div>
  );
}
