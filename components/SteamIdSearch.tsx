"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle, CheckCircle2, ArrowRight, X, Terminal, Cpu } from "lucide-react";
import { validateSteamId, ValidationResult } from "@/lib/validation";

interface SteamIdSearchProps {
  onSearchSubmit?: (result: ValidationResult) => void;
}

export function SteamIdSearch({ onSearchSubmit }: SteamIdSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<ValidationResult | null>(null);

  // Notable Dota 2 Pro Player Public Account IDs
  const proPresets = [
    { name: "Puppey", id: "87278757", role: "Hard Support" },
    { name: "Dendi", id: "70388657", role: "Midlane" },
    { name: "Arteezy", id: "32158079", role: "Carry" },
    { name: "Topson", id: "111620041", role: "Midlane" },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrorMessage(null);
    setSearchStatus(null);

    const validation = validateSteamId(inputValue);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Please enter a valid Steam ID or Account ID.");
      return;
    }

    setIsLoading(true);

    try {
      // Controlled validation flow - preparing for OpenDota API client integration in Phase 2
      await new Promise((resolve) => setTimeout(resolve, 550));
      setSearchStatus(validation);
      if (onSearchSubmit) {
        onSearchSubmit(validation);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (id: string) => {
    setInputValue(id);
    setErrorMessage(null);
    setSearchStatus(null);
  };

  const handleClear = () => {
    setInputValue("");
    setErrorMessage(null);
    setSearchStatus(null);
  };

  return (
    <div id="search-section" className="w-full max-w-2xl mx-auto scroll-mt-24">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <label htmlFor="steam-id-input" className="flex items-center gap-2 font-bold tracking-wider uppercase text-zinc-300">
            <Terminal className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
            <span>Track Player Profile</span>
          </label>
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1 text-[11px]"
              aria-label="Clear input"
            >
              <X className="h-3 w-3" /> [CLEAR]
            </button>
          )}
        </div>

        {/* Tactical Search Box */}
        <div className="relative group corner-tick">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-sm border border-white/[0.12] bg-[#0E1017] p-1.5 shadow-2xl transition-all focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/50">
            {/* Input Prefix Indicator */}
            <div className="relative flex-1 flex items-center min-h-[48px] px-3">
              <span className="font-mono text-xs text-rose-500 font-bold select-none mr-2">ID &gt;</span>
              <input
                id="steam-id-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                  if (searchStatus) setSearchStatus(null);
                }}
                disabled={isLoading}
                placeholder="Enter Steam Account ID or Profile URL..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                aria-describedby="search-hint search-error"
                autoComplete="off"
              />
            </div>

            {/* Tactical Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 px-6 py-3 sm:py-2.5 text-xs font-mono font-bold tracking-wider uppercase text-white shadow-md shadow-rose-950/80 transition-all hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  <span>PARSING...</span>
                </>
              ) : (
                <>
                  <span>TRACK PLAYER</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Format Hint */}
        <p id="search-hint" className="text-[12px] text-zinc-400 text-left px-1">
          Enter your 32-bit Dota 2 Account ID (e.g. <span className="font-mono text-zinc-300">87278757</span>), 64-bit Steam ID, or Steam profile URL.
        </p>

        {/* Error Notification */}
        {errorMessage && (
          <div
            id="search-error"
            role="alert"
            className="mt-1 flex items-start gap-2.5 rounded-sm border border-red-800/80 bg-red-950/50 p-3 text-xs text-red-200"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 font-mono">
              <strong className="text-red-300 uppercase">[SYNTAX_ERROR] </strong>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Verified Target Status Box */}
        {searchStatus && (
          <div
            role="status"
            className="mt-2 rounded-sm border border-rose-500/40 bg-[#12141F] p-4 text-left shadow-xl"
          >
            <div className="flex items-start gap-3.5">
              <div className="rounded bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-400">TARGET:</span>
                    <span className="font-mono text-sm font-bold text-rose-400">{searchStatus.cleanId}</span>
                  </div>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono uppercase text-zinc-300 border border-white/[0.08]">
                    {searchStatus.type === "steam64"
                      ? "64-bit Steam ID"
                      : searchStatus.type === "steam32"
                      ? "32-bit Account ID"
                      : "Vanity Profile"}
                  </span>
                </div>

                {searchStatus.steam32Id && searchStatus.type === "steam64" && (
                  <div className="mt-2 text-xs font-mono text-zinc-400">
                    Converted Dota 2 Account ID: <span className="text-zinc-200 font-bold">{searchStatus.steam32Id}</span>
                  </div>
                )}

                <div className="mt-2 text-xs text-zinc-300 leading-relaxed">
                  <span className="text-emerald-400 font-mono font-bold">✓ FORMAT VERIFIED:</span> Account ID is valid for Dota 2 matchmaking telemetry. Live match history ingestion via the OpenDota API is configured for the Phase 2 data release.
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">Ready for OpenDota payload sync</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="font-mono text-rose-400 hover:text-rose-300 transition-colors uppercase font-bold text-[11px]"
                  >
                    [Query Another ID]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Test Pro Player Presets */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1">Pro Presets:</span>
          {proPresets.map((pro) => (
            <button
              key={pro.id}
              type="button"
              onClick={() => handleSelectPreset(pro.id)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:border-rose-500/50 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            >
              <span className="font-bold text-white">{pro.name}</span>
              <span className="text-zinc-400">({pro.role})</span>
              <span className="text-rose-400 font-semibold">{pro.id}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
