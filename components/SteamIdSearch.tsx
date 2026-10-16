"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle, CheckCircle2, ArrowRight, X } from "lucide-react";
import { validateSteamId, ValidationResult } from "@/lib/validation";

interface SteamIdSearchProps {
  onSearchSubmit?: (result: ValidationResult) => void;
}

export function SteamIdSearch({ onSearchSubmit }: SteamIdSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<ValidationResult | null>(null);

  // Example public IDs to quickly test input formats
  const exampleIds = [
    { label: "Account ID (Dendi)", value: "70388657" },
    { label: "Account ID (Puppey)", value: "87278757" },
    { label: "Steam64 ID", value: "76561198047544485" },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrorMessage(null);
    setSearchStatus(null);

    const validation = validateSteamId(inputValue);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Please enter a valid Steam ID.");
      return;
    }

    setIsLoading(true);

    // Controlled simulation to validate input and prepare for OpenDota API connection
    // In Phase 2, this will call `fetch(`/api/players/${validation.cleanId}`)`
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setSearchStatus(validation);
      if (onSearchSubmit) {
        onSearchSubmit(validation);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExample = (val: string) => {
    setInputValue(val);
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
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative flex flex-col gap-2.5">
        <label
          htmlFor="steam-id-input"
          className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between"
        >
          <span>Track your player profile</span>
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 font-normal"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </label>

        <div className="relative group">
          {/* Subtle outer glow on hover/focus */}
          <div
            className={`absolute -inset-[1px] rounded-lg bg-gradient-to-r from-rose-600/30 via-red-600/10 to-rose-600/30 opacity-70 blur-xs transition duration-300 group-hover:opacity-100 ${
              errorMessage ? "from-red-600/50 to-rose-600/50" : ""
            }`}
          />

          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-lg border border-white/[0.12] bg-[#11131C] p-1.5 shadow-2xl transition-all focus-within:border-rose-500/80 focus-within:ring-1 focus-within:ring-rose-500/40">
            {/* Input field with icon */}
            <div className="relative flex-1 flex items-center min-h-[46px] px-3">
              <Search
                className="h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-rose-400 shrink-0"
                aria-hidden="true"
              />
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
                placeholder="Enter your Steam ID or account ID..."
                className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                aria-describedby="search-hint search-error"
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3 sm:py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-rose-950/60 transition-all hover:from-rose-500 hover:to-red-500 hover:shadow-rose-900/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <span>Track Player</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Hint */}
        <p id="search-hint" className="text-xs text-zinc-400 text-left px-1">
          Enter your Steam account ID to explore your match history and statistics.
        </p>

        {/* Error notification banner */}
        {errorMessage && (
          <div
            id="search-error"
            role="alert"
            className="mt-1 flex items-start gap-2.5 rounded-md border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-200 animate-in fade-in-50 duration-200"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-medium text-red-300">Validation error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Search status feedback (Prepared for OpenDota API synchronization) */}
        {searchStatus && (
          <div
            role="status"
            className="mt-2 rounded-lg border border-rose-500/30 bg-[#161219]/90 p-4 text-left shadow-lg animate-in fade-in-50 duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-rose-500/20 p-1.5 text-rose-400 mt-0.5">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">
                    Steam ID Verified:{" "}
                    <span className="font-mono text-rose-400 font-bold">{searchStatus.cleanId}</span>
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-rose-950/80 px-2 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-800/40">
                    {searchStatus.type === "steam64"
                      ? "Steam64 ID"
                      : searchStatus.type === "steam32"
                      ? "Account ID"
                      : "Vanity Name"}
                  </span>
                </div>

                {searchStatus.steam32Id && searchStatus.type === "steam64" && (
                  <p className="mt-1 text-xs text-zinc-400">
                    Converted 32-bit Dota 2 Account ID:{" "}
                    <span className="font-mono text-zinc-200">{searchStatus.steam32Id}</span>
                  </p>
                )}

                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  Account format successfully verified and ready for tracking. Live player statistics and match
                  synchronization via the OpenDota API will be active in the next release step.
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors underline underline-offset-4"
                  >
                    Track another account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Test ID Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.05]">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Quick Test:</span>
          {exampleIds.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelectExample(item.value)}
              className="inline-flex items-center rounded border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-rose-500/40 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            >
              <span className="text-zinc-400 mr-1.5">{item.label}:</span>
              <span className="font-mono text-rose-400 font-semibold">{item.value}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
