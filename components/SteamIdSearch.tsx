"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight, X, Terminal, ExternalLink } from "lucide-react";
import { validateSteamId, ValidationResult } from "@/lib/validation";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface SteamIdSearchProps {
  onSearchSubmit?: (result: ValidationResult) => void;
  autoNavigate?: boolean;
}

export function SteamIdSearch({ onSearchSubmit, autoNavigate = true }: SteamIdSearchProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("QUERYING OPENDOTA...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedPlayer, setConfirmedPlayer] = useState<{
    data: PlayerDashboardData;
    validation: ValidationResult;
  } | null>(null);

  // Notable Dota 2 Pro Player Public Account IDs
  const proPresets = [
    { name: "Puppey", id: "87278757", role: "Hard Support" },
    { name: "Dendi", id: "70388657", role: "Midlane" },
    { name: "Arteezy", id: "32158079", role: "Carry" },
    { name: "Topson", id: "111620041", role: "Midlane" },
  ];

  const handleSearch = async (e?: React.FormEvent, directId?: string) => {
    if (e) e.preventDefault();

    // Prevent duplicate submissions while a lookup is in progress
    if (isLoading) return;

    setErrorMessage(null);
    setConfirmedPlayer(null);

    const queryTarget = (directId ?? inputValue).trim();
    const validation = validateSteamId(queryTarget);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Please enter a valid Steam ID or Account ID.");
      return;
    }

    const accountId = validation.steam32Id;
    if (!accountId) {
      setErrorMessage("Could not resolve a valid 32-bit Account ID from the provided input.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("RESOLVING TELEMETRY...");

    try {
      if (onSearchSubmit) {
        onSearchSubmit(validation);
      }

      setLoadingMessage("FETCHING OPENDOTA DATA...");
      const res = await fetch(`/api/players/${accountId}`, {
        headers: { Accept: "application/json" },
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorText =
          responseData?.error ||
          (res.status === 404
            ? `Player #${accountId} not found on OpenDota. Ensure the ID is correct and match history is public.`
            : res.status === 429
            ? "OpenDota rate limit exceeded. Please wait a few seconds before trying again."
            : "Failed to load player telemetry. Please verify connection and retry.");
        setErrorMessage(errorText);
        return;
      }

      const playerData = responseData as PlayerDashboardData;

      // Show confirmed state with real verified server data
      setConfirmedPlayer({
        data: playerData,
        validation,
      });

      if (autoNavigate) {
        setLoadingMessage("LOADING DASHBOARD...");
        router.push(`/player/${accountId}`);
      }
    } catch {
      setErrorMessage("Network error connecting to telemetry server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (id: string) => {
    setInputValue(id);
    setErrorMessage(null);
    setConfirmedPlayer(null);
    handleSearch(undefined, id);
  };

  const handleClear = () => {
    setInputValue("");
    setErrorMessage(null);
    setConfirmedPlayer(null);
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
          {inputValue && !isLoading && (
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
                  if (confirmedPlayer) setConfirmedPlayer(null);
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
                  <span>{loadingMessage}</span>
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
          Enter your 32-bit Dota 2 Account ID (e.g. <span className="font-mono text-zinc-300">70388657</span>), 64-bit Steam ID, or Steam profile URL.
        </p>

        {/* Error Notification */}
        {errorMessage && (
          <div
            id="search-error"
            role="alert"
            className="mt-1 flex items-start gap-2.5 rounded-sm border border-red-800/80 bg-red-950/50 p-3 text-xs text-red-200 shadow-lg"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 font-mono">
              <strong className="text-red-300 uppercase">[TELEMETRY_ERROR] </strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Verified Target Status Box - Only displayed after successful server response */}
        {confirmedPlayer && (
          <div
            role="status"
            className="mt-2 rounded-sm border border-emerald-500/40 bg-[#0F151C] p-4 text-left shadow-2xl transition-all animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative h-12 w-12 rounded border border-emerald-500/40 overflow-hidden shrink-0 bg-zinc-900">
                <Image
                  src={confirmedPlayer.data.avatarUrl}
                  alt={confirmedPlayer.data.personaname}
                  width={48}
                  height={48}
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-400">TARGET:</span>
                    <span className="font-mono text-sm font-bold text-emerald-400 truncate">
                      {confirmedPlayer.data.personaname}
                    </span>
                    {confirmedPlayer.data.proName && (
                      <span className="text-xs font-mono text-amber-400 font-semibold">
                        [{confirmedPlayer.data.proName}]
                      </span>
                    )}
                  </div>
                  <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> VERIFIED ON OPENDOTA
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">ACCOUNT ID</span>
                    <span className="font-bold text-zinc-200">{confirmedPlayer.data.accountId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">RANK TIER</span>
                    <span className="font-bold text-rose-400">{confirmedPlayer.data.rankFormatted.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">LIFETIME W/L</span>
                    <span className="font-bold text-zinc-200">
                      {confirmedPlayer.data.lifetime.wins} - {confirmedPlayer.data.lifetime.losses}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">WIN RATE</span>
                    <span className="font-bold text-emerald-400">
                      {confirmedPlayer.data.lifetime.winRate}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Synchronized telemetry. Redirecting to profile dashboard...
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/player/${confirmedPlayer.data.accountId}`)}
                    className="font-mono text-rose-400 hover:text-rose-300 transition-colors uppercase font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>View Profile Now</span>
                    <ExternalLink className="h-3 w-3" />
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
              disabled={isLoading}
              onClick={() => handleSelectPreset(pro.id)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:border-rose-500/50 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
