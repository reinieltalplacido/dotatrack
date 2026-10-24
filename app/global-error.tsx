"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DotaTrack Critical Global Error]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-[#F1F3F7] antialiased flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#0E1018] border border-rose-900/50 rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-xl font-bold font-mono text-white mb-2">
            Critical System Anomaly
          </h1>

          <p className="text-sm text-zinc-400 mb-6">
            A fatal initialization fault occurred. Click below to reload the combat environment.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors shadow-lg shadow-rose-950/40 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>REINITIALIZE INTERFACE</span>
          </button>
        </div>
      </body>
    </html>
  );
}
