"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Zap, Clock, Timer, Loader2 } from "lucide-react";
import { HeroAbilityDetail, HeroAghsUpgrade, HeroAbilityAttribute } from "@/lib/opendota/hero-types";

interface HeroAbilitiesViewProps {
  abilities: HeroAbilityDetail[];
  aghs?: HeroAghsUpgrade | null;
  loading?: boolean;
}

export function HeroAbilitiesView({
  abilities,
  aghs = null,
  loading = false,
}: HeroAbilitiesViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If selected index is out of bounds due to hero change, reset to 0
  const activeAbility = abilities[selectedIndex] ?? abilities[0] ?? null;

  if (loading) {
    return (
      <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
          <Zap className="h-4 w-4 text-rose-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Hero Abilities &amp; Active Skills
          </h3>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
          <span>Synchronizing ability database...</span>
        </div>
      </div>
    );
  }

  if (!abilities || abilities.length === 0) {
    return null;
  }

  const formatListOrString = (val?: string | string[]) => {
    if (!val) return null;
    if (Array.isArray(val)) {
      return val.join(" / ");
    }
    return String(val);
  };

  const getDmgBadge = (dmg?: string) => {
    if (!dmg) return null;
    const lower = dmg.toLowerCase();
    if (lower.includes("mag")) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-700/60">
          Magical
        </span>
      );
    }
    if (lower.includes("phys")) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">
          Physical
        </span>
      );
    }
    if (lower.includes("pure")) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
          Pure
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-white/10">
        {dmg}
      </span>
    );
  };

  // Cooldown & Mana check
  const cdText = formatListOrString(activeAbility?.cd);
  const isCdActive = cdText && cdText !== "0" && cdText !== "00";

  const mcText = formatListOrString(activeAbility?.mc);
  const isMcActive = mcText && mcText !== "0" && mcText !== "00";

  // Extract duration per level from attributes
  const extractDuration = (attrib?: HeroAbilityAttribute[]) => {
    if (!attrib || attrib.length === 0) return null;
    const durAttr =
      attrib.find((a) => a.key === "duration") ||
      attrib.find((a) => a.key === "stun_duration") ||
      attrib.find((a) => a.key === "hero_duration") ||
      attrib.find((a) => a.key === "disarm_duration") ||
      attrib.find((a) => a.key === "silence_duration") ||
      attrib.find(
        (a) =>
          (a.key?.toLowerCase().includes("duration") ||
            a.header?.toLowerCase().includes("duration")) &&
          !a.key?.toLowerCase().includes("vision_duration") &&
          !a.key?.toLowerCase().includes("knockback_duration")
      );

    if (!durAttr || !durAttr.value) return null;
    const val = formatListOrString(durAttr.value);
    if (!val || val === "0" || val === "00") return null;

    const label = durAttr.header
      ? durAttr.header.replace(/:$/, "").trim()
      : "Duration";
    const formattedVal = val.endsWith("s") || val.endsWith("%") ? val : `${val}s`;

    return { label, value: formattedVal };
  };

  const durationInfo = extractDuration(activeAbility?.attrib);

  const isPassive =
    activeAbility?.behavior?.toString().toLowerCase().includes("passive") || false;

  // Check Aghanim's Scepter & Shard relevance for active ability
  const isScepterUpgraded =
    aghs?.has_scepter &&
    aghs?.scepter_skill_name &&
    activeAbility?.dname?.toLowerCase() === aghs.scepter_skill_name.toLowerCase();

  const isShardUpgraded =
    aghs?.has_shard &&
    aghs?.shard_skill_name &&
    activeAbility?.dname?.toLowerCase() === aghs.shard_skill_name.toLowerCase();

  // Filter attributes: prioritize user-facing ones with clean headers
  const attributesToDisplay = (activeAbility?.attrib ?? []).filter((at) => {
    if (!at.header || at.header.trim() === "") return false;
    const lowerKey = at.key.toLowerCase();
    if (
      lowerKey.includes("windup") ||
      lowerKey.includes("vision_duration") ||
      lowerKey.includes("knockback_height")
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="tactical-panel p-4 rounded-sm border border-white/[0.08]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-rose-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Hero Abilities &amp; Active Skills
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {abilities.length} Skills Available
        </span>
      </div>

      {/* Ability Icons Selector Row */}
      <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-thin">
        {abilities.map((ability, idx) => {
          const isSelected = idx === (selectedIndex < abilities.length ? selectedIndex : 0);
          const hasScepter =
            aghs?.has_scepter &&
            aghs.scepter_skill_name &&
            ability.dname?.toLowerCase() === aghs.scepter_skill_name.toLowerCase();
          const hasShard =
            aghs?.has_shard &&
            aghs.shard_skill_name &&
            ability.dname?.toLowerCase() === aghs.shard_skill_name.toLowerCase();

          return (
            <button
              key={ability.name || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select ability: ${ability.dname}`}
              className={`relative group rounded p-0.5 transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? "ring-2 ring-rose-500 bg-rose-500/20"
                  : "border border-white/10 opacity-75 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded overflow-hidden bg-black">
                <NextImage
                  src={ability.img}
                  alt={ability.dname}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              {/* Scepter Mini Indicator */}
              {hasScepter && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center p-0.5 shadow-sm"
                  title="Upgraded by Aghanim's Scepter"
                >
                  <div className="relative w-full h-full">
                    <NextImage src="/aghs_scepter.png" alt="Scepter" fill className="object-contain" />
                  </div>
                </div>
              )}

              {/* Shard Mini Indicator */}
              {hasShard && (
                <div
                  className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-sky-950 border border-sky-400 flex items-center justify-center p-0.5 shadow-sm"
                  title="Upgraded by Aghanim's Shard"
                >
                  <div className="relative w-full h-full">
                    <NextImage src="/aghs_shard.png" alt="Shard" fill className="object-contain" />
                  </div>
                </div>
              )}

              {/* Indicator Pip for Active Skill */}
              {isSelected && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-1 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Ability Tactical Card */}
      {activeAbility && (
        <div className="mt-2 rounded bg-black/40 border border-white/[0.06] p-3.5 space-y-3">
          {/* Header Row: Title, Target Behavior, Badges */}
          <div className="flex items-center gap-3 pb-2.5 border-b border-white/[0.06]">
            <div className="relative h-12 w-12 rounded overflow-hidden bg-black border border-white/15 flex-shrink-0">
              <NextImage
                src={activeAbility.img}
                alt={activeAbility.dname}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-mono font-bold text-white tracking-wide truncate">
                {activeAbility.dname}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {/* Behavior Tag */}
                {activeAbility.behavior && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                    {Array.isArray(activeAbility.behavior)
                      ? activeAbility.behavior.join(", ")
                      : activeAbility.behavior}
                  </span>
                )}
                {/* Damage Type Badge */}
                {getDmgBadge(activeAbility.dmg_type)}
              </div>
            </div>
          </div>

          {/* DEDICATED RESOURCE & TIMING TELEMETRY BAR (Cooldown, Mana Cost, Duration) */}
          {/* Each item uses whitespace-nowrap and clean pill formatting so values NEVER wrap mid-stat */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cooldown Pill */}
            {isCdActive && (
              <div
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-black/70 border border-white/10 text-zinc-200 whitespace-nowrap"
                title="Ability Cooldown"
              >
                <Clock className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                <span className="text-[10px] font-mono uppercase text-zinc-400">Cooldown:</span>
                <span className="font-mono text-xs font-bold text-white tnum">{cdText}s</span>
              </div>
            )}

            {/* Mana Cost Pill */}
            {isMcActive && (
              <div
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-sky-950/50 border border-sky-800/60 text-sky-200 whitespace-nowrap"
                title="Ability Mana Cost per Level"
              >
                <div className="w-2.5 h-2.5 rotate-45 bg-sky-400 flex-shrink-0" />
                <span className="text-[10px] font-mono uppercase text-sky-300">Mana Cost:</span>
                <span className="font-mono text-xs font-bold text-sky-100 tnum">{mcText}</span>
              </div>
            )}

            {/* Passive / No Mana Indicator */}
            {!isMcActive && isPassive && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-zinc-400 whitespace-nowrap text-xs font-mono">
                <span className="text-[10px] uppercase text-zinc-400">Mana Cost:</span>
                <span className="font-bold text-zinc-300">Passive (No Mana)</span>
              </div>
            )}

            {/* Duration Pill */}
            {durationInfo && (
              <div
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-200 whitespace-nowrap"
                title={`${durationInfo.label} per level`}
              >
                <Timer className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-[10px] font-mono uppercase text-amber-300">
                  {durationInfo.label}:
                </span>
                <span className="font-mono text-xs font-bold text-amber-100 tnum">
                  {durationInfo.value}
                </span>
              </div>
            )}
          </div>

          {/* Spell Flags: Pierces BKB & Dispellable */}
          {(activeAbility.bkbpierce || activeAbility.dispellable) && (
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              {activeAbility.bkbpierce && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400">Pierces BKB:</span>
                  <span
                    className={`font-bold ${
                      activeAbility.bkbpierce.toLowerCase() === "yes"
                        ? "text-emerald-400"
                        : "text-zinc-300"
                    }`}
                  >
                    {activeAbility.bkbpierce}
                  </span>
                </div>
              )}
              {activeAbility.dispellable && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400">Dispellable:</span>
                  <span
                    className={`font-bold ${
                      activeAbility.dispellable.toLowerCase() === "yes"
                        ? "text-emerald-400"
                        : activeAbility.dispellable.toLowerCase().includes("strong")
                        ? "text-amber-400"
                        : "text-zinc-300"
                    }`}
                  >
                    {activeAbility.dispellable}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Aghanim's Scepter In-Ability Callout */}
          {isScepterUpgraded && (
            <div className="flex items-start gap-2.5 p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs font-mono">
              <div className="relative h-6 w-6 flex-shrink-0 mt-0.5">
                <NextImage
                  src="/aghs_scepter.png"
                  alt="Aghanim's Scepter"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Aghanim&apos;s Scepter Upgrade
                </div>
                <div className="text-xs text-amber-100/90 font-sans mt-0.5 leading-relaxed">
                  {aghs?.scepter_desc}
                </div>
              </div>
            </div>
          )}

          {/* Aghanim's Shard In-Ability Callout */}
          {isShardUpgraded && (
            <div className="flex items-start gap-2.5 p-2.5 rounded bg-sky-950/30 border border-sky-500/40 text-sky-200 text-xs font-mono">
              <div className="relative h-6 w-6 flex-shrink-0 mt-0.5">
                <NextImage
                  src="/aghs_shard.png"
                  alt="Aghanim's Shard"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">
                  Aghanim&apos;s Shard Upgrade
                </div>
                <div className="text-xs text-sky-100/90 font-sans mt-0.5 leading-relaxed">
                  {aghs?.shard_desc}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {activeAbility.desc && (
            <p className="text-xs font-sans text-zinc-200 leading-relaxed whitespace-pre-line">
              {activeAbility.desc}
            </p>
          )}

          {/* Attributes Matrix */}
          {attributesToDisplay.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-2">
              {attributesToDisplay.map((attr) => {
                const label = attr.header.replace(/:$/, "").trim();
                const valStr = formatListOrString(attr.value);
                return (
                  <div
                    key={attr.key}
                    className="flex items-center justify-between gap-2 px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
                  >
                    <span className="text-[10px] uppercase text-zinc-400 truncate">
                      {label}:
                    </span>
                    <span className="text-xs font-bold text-zinc-100 tnum flex-shrink-0">
                      {valStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lore Flavor Text */}
          {activeAbility.lore && (
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[11px] font-serif italic text-zinc-400 leading-relaxed block">
                &ldquo;{activeAbility.lore}&rdquo;
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
