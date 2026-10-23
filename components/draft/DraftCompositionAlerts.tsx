"use client";

import { CompositionVoidAlert } from "@/lib/draft/draft-engine";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface DraftCompositionAlertsProps {
  radiantAlerts: CompositionVoidAlert[];
  direAlerts: CompositionVoidAlert[];
}

export function DraftCompositionAlerts({
  radiantAlerts,
  direAlerts,
}: DraftCompositionAlertsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Radiant Alerts Column */}
      <div className="tactical-panel p-4 rounded-sm border border-emerald-950/60 bg-[#0A0E14] space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Radiant Composition Voids ({radiantAlerts.length})
          </span>
        </div>

        {radiantAlerts.length === 0 ? (
          <div className="flex items-center gap-2 py-4 text-xs font-mono text-emerald-300/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Well-rounded composition. No critical voids detected.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {radiantAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-sm border text-xs font-mono space-y-1 ${
                  alert.severity === "critical"
                    ? "bg-red-950/40 border-red-800/60 text-red-200"
                    : alert.severity === "warning"
                    ? "bg-amber-950/40 border-amber-800/60 text-amber-200"
                    : "bg-blue-950/40 border-blue-800/60 text-blue-200"
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                  {alert.severity === "critical" ? (
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  ) : alert.severity === "warning" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  )}
                  <span>{alert.title}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {alert.description}
                </p>
                {alert.counterExample && (
                  <div className="text-[10px] text-zinc-400 pt-1 border-t border-white/[0.06]">
                    💡 {alert.counterExample}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dire Alerts Column */}
      <div className="tactical-panel p-4 rounded-sm border border-rose-950/60 bg-[#120A0E] space-y-3">
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Dire Composition Voids ({direAlerts.length})
          </span>
        </div>

        {direAlerts.length === 0 ? (
          <div className="flex items-center gap-2 py-4 text-xs font-mono text-emerald-300/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Well-rounded composition. No critical voids detected.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {direAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-sm border text-xs font-mono space-y-1 ${
                  alert.severity === "critical"
                    ? "bg-red-950/40 border-red-800/60 text-red-200"
                    : alert.severity === "warning"
                    ? "bg-amber-950/40 border-amber-800/60 text-amber-200"
                    : "bg-blue-950/40 border-blue-800/60 text-blue-200"
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                  {alert.severity === "critical" ? (
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  ) : alert.severity === "warning" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  )}
                  <span>{alert.title}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {alert.description}
                </p>
                {alert.counterExample && (
                  <div className="text-[10px] text-zinc-400 pt-1 border-t border-white/[0.06]">
                    💡 {alert.counterExample}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
