"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Log unexpected errors for production telemetry
    console.error("[DotaTrack Application Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F1F3F7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#0E1018] border border-white/[0.08] rounded-xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle atmospheric gradients */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-lg shadow-rose-950/40">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/40 text-[11px] font-mono font-semibold text-rose-300 uppercase tracking-wider">
                <AlertTriangle className="h-3 w-3" />
                <span>Combat Fault Encountered</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                Aegis Claim Expired
              </h1>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                {error?.message ||
                  "An unexpected anomaly disrupted data transmission from the battlefield. You can retry the operation or return to safety."}
              </p>
            </div>

            {/* Diagnostic details */}
            {(error?.digest || error?.message) && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setShowDiagnostics((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <span>{showDiagnostics ? "Hide" : "Show"} Diagnostics</span>
                  {showDiagnostics ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {showDiagnostics && (
                  <div className="mt-2 text-[11px] font-mono text-zinc-400 bg-black/60 border border-white/[0.08] rounded p-3 text-left overflow-x-auto max-h-40 space-y-1">
                    {error.digest && <div>Digest: {error.digest}</div>}
                    {error.message && <div className="text-rose-400/90 font-semibold">Message: {error.message}</div>}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors shadow-lg shadow-rose-900/30 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>RETRY ACTION</span>
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>RETURN TO BASE</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
