"use client";

import { useState } from "react";
import { DISPEL_RULES_DATA, DISABLE_TYPES_DATA } from "@/lib/learn/learn-data";
import { ShieldCheck, Zap, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from "lucide-react";

export function DispelsGuide() {
  const [selectedDispelType, setSelectedDispelType] = useState<"Basic Dispel" | "Strong Dispel" | "Undispellable">("Basic Dispel");

  const activeRule = DISPEL_RULES_DATA.find((r) => r.type === selectedDispelType) || DISPEL_RULES_DATA[0];

  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.08] bg-gradient-to-r from-[#0E1018] via-[#12141F] to-[#0E1018]">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dispels, Purges & Crowd Control Mechanics
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Understanding the hierarchy of dispels is what separates average Dota players from immortals. A <strong className="text-sky-300">Basic Dispel</strong> can cleanse silences, roots, and slows, but ONLY a <strong className="text-emerald-300">Strong Dispel</strong> can cleanse hard stuns!
          </p>
        </div>
      </div>

      {/* Dispel Tiers Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DISPEL_RULES_DATA.map((rule) => {
          const isSelected = selectedDispelType === rule.type;
          return (
            <button
              key={rule.type}
              onClick={() => setSelectedDispelType(rule.type)}
              className={`p-5 rounded-sm border text-left transition-all ${
                isSelected
                  ? rule.type === "Strong Dispel"
                    ? "border-emerald-500/50 bg-[#101815] shadow-lg shadow-emerald-950/40"
                    : rule.type === "Basic Dispel"
                    ? "border-sky-500/50 bg-[#0F1622] shadow-lg shadow-sky-950/40"
                    : "border-rose-500/50 bg-[#1A0F14] shadow-lg shadow-rose-950/40"
                  : "border-white/[0.08] bg-[#0E1018] hover:border-white/20 hover:bg-[#12141F]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-white">{rule.type}</span>
                {rule.type === "Strong Dispel" && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
                {rule.type === "Basic Dispel" && <Zap className="h-5 w-5 text-sky-400" />}
                {rule.type === "Undispellable" && <AlertTriangle className="h-5 w-5 text-rose-400" />}
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {rule.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Dispel Inspector */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.1] bg-[#0E1018] space-y-6">
        <div className="border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">{activeRule.type} Specification</h3>
            <span
              className={`text-xs font-mono px-2.5 py-0.5 rounded border uppercase ${
                activeRule.type === "Strong Dispel"
                  ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                  : activeRule.type === "Basic Dispel"
                  ? "bg-sky-950/80 border-sky-800 text-sky-300"
                  : "bg-rose-950/80 border-rose-800 text-rose-300"
              }`}
            >
              Tier {activeRule.type === "Basic Dispel" ? "1" : activeRule.type === "Strong Dispel" ? "2 (Max)" : "Absolute"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{activeRule.description}</p>
        </div>

        {/* Removes vs Cannot Remove Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Can remove */}
          <div className="p-4 rounded-sm border border-emerald-500/20 bg-emerald-950/10 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              What It Can Successfully Dispel
            </h4>
            {activeRule.removes.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {activeRule.removes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-400 italic">
                Undispellable effects cannot be removed by any purge.
              </p>
            )}
          </div>

          {/* Cannot remove */}
          <div className="p-4 rounded-sm border border-rose-500/20 bg-rose-950/10 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              What It CANNOT Dispel
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {activeRule.cannotRemove.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sources of this dispel */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
            Major In-Game Sources of {activeRule.type}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {activeRule.sources.map((src, i) => (
              <div
                key={i}
                className="p-3 rounded-sm border border-white/[0.06] bg-black/40 text-center"
              >
                <div className="text-xs font-bold text-white mb-0.5 truncate">{src.name}</div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {src.isItem ? `Item (${src.costOrHero})` : src.costOrHero}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disables Compendium Table */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm border border-white/[0.1] bg-[#0E1018] space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Complete Disables Taxonomy
          </h3>
          <p className="text-xs text-zinc-400">
            Compare all major disable conditions in Dota 2, what actions they restrict, and the minimum dispel required.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Disable</th>
                <th className="pb-3 font-semibold">What It Prevents</th>
                <th className="pb-3 font-semibold">What Is Still Allowed</th>
                <th className="pb-3 font-semibold">Required Dispel</th>
                <th className="pb-3 font-semibold">Example Spell / Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {DISABLE_TYPES_DATA.map((dis, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-white text-sm block">{dis.name}</span>
                    <span className="text-[11px] text-zinc-400">{dis.shortDesc}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-rose-300 font-mono text-[11px]">
                    {dis.preventsActions.join(", ")}
                  </td>
                  <td className="py-3.5 pr-4 text-emerald-300 font-mono text-[11px]">
                    {dis.allowsActions.join(", ")}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        dis.dispelRequired === "Strong Dispel"
                          ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                          : "bg-sky-950/80 border-sky-800 text-sky-300"
                      }`}
                    >
                      {dis.dispelRequired}
                    </span>
                  </td>
                  <td className="py-3.5 text-zinc-300">
                    <div className="font-mono text-[11px] text-white">{dis.exampleAbility}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{dis.iconicItem}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
