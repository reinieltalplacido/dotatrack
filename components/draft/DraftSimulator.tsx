"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Swords,
  Shield,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  Plus,
  X,
  Shuffle,
  ChevronRight,
  Info,
} from "lucide-react";
import { EnrichedHeroSummary } from "@/lib/opendota/hero-types";
import {
  DraftRole,
  DraftSlot,
  analyzeDraftMatchup,
  getRecommendedNextPicks,
  PRO_DRAFT_PRESETS,
  ProDraftPreset,
} from "@/lib/draft/draft-engine";
import { HeroPickerModal } from "./HeroPickerModal";
import { DraftCompositionRadar } from "./DraftCompositionRadar";
import { DraftCompositionAlerts } from "./DraftCompositionAlerts";
import { DraftRecommendations } from "./DraftRecommendations";

interface DraftSimulatorProps {
  allHeroes: EnrichedHeroSummary[];
}

const DEFAULT_ROLES: DraftRole[] = [
  "Carry",
  "Mid",
  "Offlane",
  "Soft Support",
  "Hard Support",
];

export function DraftSimulator({ allHeroes }: DraftSimulatorProps) {
  // 5 Radiant slots
  const [radiantSlots, setRadiantSlots] = useState<DraftSlot[]>(
    DEFAULT_ROLES.map((role, idx) => ({
      id: `radiant-${idx}`,
      team: "radiant",
      role,
      position: (idx + 1) as 1 | 2 | 3 | 4 | 5,
      hero: null,
    }))
  );

  // 5 Dire slots
  const [direSlots, setDireSlots] = useState<DraftSlot[]>(
    DEFAULT_ROLES.map((role, idx) => ({
      id: `dire-${idx}`,
      team: "dire",
      role,
      position: (idx + 1) as 1 | 2 | 3 | 4 | 5,
      hero: null,
    }))
  );

  const [activeTeamTurn, setActiveTeamTurn] = useState<"radiant" | "dire">("radiant");
  const [selectedSlotForPicker, setSelectedSlotForPicker] = useState<DraftSlot | null>(null);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  // Set of all hero IDs currently picked across both teams
  const pickedHeroIds = useMemo(() => {
    const ids = new Set<number>();
    radiantSlots.forEach((s) => s.hero && ids.add(s.hero.id));
    direSlots.forEach((s) => s.hero && ids.add(s.hero.id));
    return ids;
  }, [radiantSlots, direSlots]);

  // Draft Analysis Engine
  const analysis = useMemo(() => {
    const radHeroes = radiantSlots.map((s) => s.hero);
    const direHeroes = direSlots.map((s) => s.hero);
    return analyzeDraftMatchup(radHeroes, direHeroes);
  }, [radiantSlots, direSlots]);

  // Live Next Pick Recommendations
  const recommendations = useMemo(() => {
    const allied = (activeTeamTurn === "radiant" ? radiantSlots : direSlots).map((s) => s.hero);
    const enemy = (activeTeamTurn === "radiant" ? direSlots : radiantSlots).map((s) => s.hero);
    return getRecommendedNextPicks(allHeroes, allied, enemy);
  }, [allHeroes, activeTeamTurn, radiantSlots, direSlots]);

  // Open modal for a specific slot
  const handleOpenSlotPicker = (slot: DraftSlot) => {
    setSelectedSlotForPicker(slot);
    setIsPickerModalOpen(true);
  };

  // Assign hero to slot
  const handleSelectHeroForSlot = (hero: EnrichedHeroSummary) => {
    if (selectedSlotForPicker) {
      if (selectedSlotForPicker.team === "radiant") {
        setRadiantSlots((prev) =>
          prev.map((s) => (s.id === selectedSlotForPicker.id ? { ...s, hero } : s))
        );
      } else {
        setDireSlots((prev) =>
          prev.map((s) => (s.id === selectedSlotForPicker.id ? { ...s, hero } : s))
        );
      }
      setSelectedSlotForPicker(null);
      return;
    }

    // Auto-fill into first empty slot of active team
    const targetSlots = activeTeamTurn === "radiant" ? radiantSlots : direSlots;
    const firstEmpty = targetSlots.find((s) => s.hero === null);
    if (firstEmpty) {
      if (activeTeamTurn === "radiant") {
        setRadiantSlots((prev) =>
          prev.map((s) => (s.id === firstEmpty.id ? { ...s, hero } : s))
        );
      } else {
        setDireSlots((prev) =>
          prev.map((s) => (s.id === firstEmpty.id ? { ...s, hero } : s))
        );
      }
    }
  };

  // Remove hero from slot
  const handleRemoveHero = (e: React.MouseEvent, slotId: string, team: "radiant" | "dire") => {
    e.stopPropagation();
    if (team === "radiant") {
      setRadiantSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, hero: null } : s))
      );
    } else {
      setDireSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, hero: null } : s))
      );
    }
  };

  // Clear all slots
  const handleClearDraft = () => {
    setRadiantSlots((prev) => prev.map((s) => ({ ...s, hero: null })));
    setDireSlots((prev) => prev.map((s) => ({ ...s, hero: null })));
  };

  // Load Pro Preset
  const handleLoadPreset = (preset: ProDraftPreset) => {
    const heroMap = new Map(allHeroes.map((h) => [h.id, h]));

    setRadiantSlots(
      preset.radiantHeroIds.map((id, idx) => ({
        id: `radiant-${idx}`,
        team: "radiant",
        role: preset.radiantRoles[idx] || DEFAULT_ROLES[idx],
        position: (idx + 1) as 1 | 2 | 3 | 4 | 5,
        hero: heroMap.get(id) || null,
      }))
    );

    setDireSlots(
      preset.direHeroIds.map((id, idx) => ({
        id: `dire-${idx}`,
        team: "dire",
        role: preset.direRoles[idx] || DEFAULT_ROLES[idx],
        position: (idx + 1) as 1 | 2 | 3 | 4 | 5,
        hero: heroMap.get(id) || null,
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Presets & Reset */}
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08] bg-[#0A0C14] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="h-4 w-4 text-rose-500" />
            <h1 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              Competitive Draft Assistant &amp; Counter Engine
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            Simulate 5v5 drafts, analyze team composition voids, and receive live algorithmic counter-pick advice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Preset Buttons */}
          <span className="text-zinc-500 hidden sm:inline text-[11px] mr-1">Pro Presets:</span>
          {PRO_DRAFT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1.5 rounded-xs bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/[0.08] transition-all font-bold"
              title={preset.subtitle}
            >
              {preset.title.split("(")[0]}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClearDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.1] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Center Matchup Gauge: Real-time Win Probability Meter */}
      <div className="tactical-panel p-5 rounded-sm border border-white/[0.08] bg-[#0A0C14] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-mono font-black text-emerald-400">
              RADIANT {analysis.radiantWinProbability}% WIN PROBABILITY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-black text-rose-400">
              DIRE {(100 - analysis.radiantWinProbability).toFixed(1)}% WIN PROBABILITY
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* Dual Color Advantage Progress Bar */}
        <div className="h-3 w-full rounded-xs bg-zinc-900 overflow-hidden flex border border-white/[0.06]">
          <div
            className="bg-emerald-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${analysis.radiantWinProbability}%` }}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${100 - analysis.radiantWinProbability}%` }}
          />
        </div>

        {/* Tactical Verdict & Win Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="bg-black/30 p-2.5 rounded-sm border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
              DRAFT VERDICT
            </span>
            <p className="text-zinc-200 leading-relaxed">{analysis.verdict}</p>
          </div>

          <div className="bg-emerald-950/20 p-2.5 rounded-sm border border-emerald-900/30">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
              RADIANT KEY WIN CONDITION
            </span>
            <p className="text-emerald-200/90 leading-relaxed">
              {analysis.keyWinConditionRadiant}
            </p>
          </div>

          <div className="bg-rose-950/20 p-2.5 rounded-sm border border-rose-900/30">
            <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
              DIRE KEY WIN CONDITION
            </span>
            <p className="text-rose-200/90 leading-relaxed">
              {analysis.keyWinConditionDire}
            </p>
          </div>
        </div>
      </div>

      {/* 5v5 Drafting Rosters (Radiant vs Dire) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radiant Team Column (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Radiant Roster (First Pick)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTeamTurn("radiant")}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                activeTeamTurn === "radiant"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-zinc-900 text-zinc-500 hover:text-white"
              }`}
            >
              {activeTeamTurn === "radiant" ? "★ Active Turn" : "Select Turn"}
            </button>
          </div>

          <div className="space-y-2">
            {radiantSlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => handleOpenSlotPicker(slot)}
                className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  slot.hero
                    ? "bg-[#091510] border-emerald-900/60 hover:border-emerald-500/80"
                    : "bg-[#0A0C14] border-dashed border-emerald-900/40 hover:border-emerald-600 hover:bg-emerald-950/20"
                }`}
              >
                {/* Left: Role & Position */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 text-center font-mono font-black text-emerald-400 text-xs">
                    P{slot.position}
                  </div>

                  {slot.hero ? (
                    <div className="relative h-11 w-18 rounded-xs overflow-hidden border border-white/[0.1] bg-black shrink-0">
                      <Image
                        src={slot.hero.img}
                        alt={slot.hero.localized_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-18 rounded-xs border border-white/[0.08] bg-black/40 flex items-center justify-center text-zinc-600 shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                      {slot.role}
                    </span>
                    <span className="text-sm font-bold text-white block truncate">
                      {slot.hero ? slot.hero.localized_name : "Empty Pick"}
                    </span>
                  </div>
                </div>

                {/* Right: Stats or Select CTA */}
                <div className="flex items-center gap-3">
                  {slot.hero ? (
                    <div className="text-right text-xs font-mono">
                      <span className="text-emerald-400 font-bold block">
                        {slot.hero.winRate.toFixed(1)}% WR
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {slot.hero.attack_type}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase hover:underline">
                      + Slot Hero
                    </span>
                  )}

                  {slot.hero && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveHero(e, slot.id, "radiant")}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Clear slot"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dire Team Column (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-900/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <h2 className="text-sm font-mono font-bold text-rose-400 uppercase tracking-wider">
                Dire Roster (Second Pick)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTeamTurn("dire")}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                activeTeamTurn === "dire"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-zinc-900 text-zinc-500 hover:text-white"
              }`}
            >
              {activeTeamTurn === "dire" ? "★ Active Turn" : "Select Turn"}
            </button>
          </div>

          <div className="space-y-2">
            {direSlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => handleOpenSlotPicker(slot)}
                className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  slot.hero
                    ? "bg-[#18090E] border-rose-900/60 hover:border-rose-500/80"
                    : "bg-[#0A0C14] border-dashed border-rose-900/40 hover:border-rose-600 hover:bg-rose-950/20"
                }`}
              >
                {/* Left: Role & Position */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 text-center font-mono font-black text-rose-400 text-xs">
                    P{slot.position}
                  </div>

                  {slot.hero ? (
                    <div className="relative h-11 w-18 rounded-xs overflow-hidden border border-white/[0.1] bg-black shrink-0">
                      <Image
                        src={slot.hero.img}
                        alt={slot.hero.localized_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-18 rounded-xs border border-white/[0.08] bg-black/40 flex items-center justify-center text-zinc-600 shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                      {slot.role}
                    </span>
                    <span className="text-sm font-bold text-white block truncate">
                      {slot.hero ? slot.hero.localized_name : "Empty Pick"}
                    </span>
                  </div>
                </div>

                {/* Right: Stats or Select CTA */}
                <div className="flex items-center gap-3">
                  {slot.hero ? (
                    <div className="text-right text-xs font-mono">
                      <span className="text-rose-400 font-bold block">
                        {slot.hero.winRate.toFixed(1)}% WR
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {slot.hero.attack_type}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-rose-400 font-bold uppercase hover:underline">
                      + Slot Hero
                    </span>
                  )}

                  {slot.hero && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveHero(e, slot.id, "dire")}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Clear slot"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live AI Counter Recommendations for Active Turn */}
      <DraftRecommendations
        recommendations={recommendations}
        activeTeam={activeTeamTurn}
        onSelectHero={handleSelectHeroForSlot}
      />

      {/* 6-Axis Tactical Radar Balance */}
      <DraftCompositionRadar
        radiantScores={analysis.radiantScores}
        direScores={analysis.direScores}
      />

      {/* Composition Voids & Alerts */}
      <DraftCompositionAlerts
        radiantAlerts={analysis.radiantAlerts}
        direAlerts={analysis.direAlerts}
      />

      {/* Hero Selection Modal */}
      {selectedSlotForPicker && (
        <HeroPickerModal
          isOpen={isPickerModalOpen}
          onClose={() => {
            setIsPickerModalOpen(false);
            setSelectedSlotForPicker(null);
          }}
          onSelectHero={handleSelectHeroForSlot}
          allHeroes={allHeroes}
          pickedHeroIds={pickedHeroIds}
          targetTeam={selectedSlotForPicker.team}
          targetRole={selectedSlotForPicker.role}
        />
      )}
    </div>
  );
}
