"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
  Terminal,
  History,
  User,
} from "lucide-react";
import { validateSteamId, ValidationResult } from "@/lib/validation";
import { PlayerDashboardData } from "@/lib/opendota/types";

interface RecentPlayerSearch {
  id: string;
  name: string;
  avatarUrl?: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = "dotatrack_recent_player_searches";
const MAX_RECENT_SEARCHES = 5;

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
  const [recentSearches, setRecentSearches] = useState<RecentPlayerSearch[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch {
      // Ignore corrupted localStorage data
    }
  }, []);

  const saveRecentSearch = (item: RecentPlayerSearch) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      const updated = [item, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch (err) {
          console.warn("Failed to save recent search to localStorage", err);
        }
      }
      return updated;
    });
  };

  const handleRemoveRecent = (idToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((p) => p.id !== idToRemove);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const handleClearAllRecent = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      } catch {
        // ignore
      }
    }
  };

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
    setLoadingMessage("FETCHING STATS...");

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
            : "Failed to load player stats. Please verify connection and retry.");
        setErrorMessage(errorText);
        return;
      }

      const playerData = responseData as PlayerDashboardData;

      // Save to recent searches
      saveRecentSearch({
        id: String(accountId),
        name: playerData.proName || playerData.personaname || `Player #${accountId}`,
        avatarUrl: playerData.avatarUrl || undefined,
        timestamp: Date.now(),
      });

      if (autoNavigate) {
        setLoadingMessage("LOADING DASHBOARD...");
        router.push(`/player/${accountId}`);
      }
    } catch {
      setErrorMessage("Network error connecting to stats server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (id: string) => {
    setInputValue(id);
    setErrorMessage(null);
    handleSearch(undefined, id);
  };

  const handleClear = () => {
    setInputValue("");
    setErrorMessage(null);
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
              <span className="font-mono text-xs text-rose-500 font-bold select-none mr-2 shrink-0">&gt;</span>
              <input
                id="steam-id-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isLoading}
                placeholder="e.g. 70388657 or Steam profile URL..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                aria-describedby="search-hint search-error"
                autoComplete="off"
              />
            </div>

            {/* Tactical Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 rounded-sm bg-rose-600 px-6 py-3 sm:py-2.5 text-xs font-mono font-bold tracking-wider uppercase text-white shadow-md shadow-rose-950/80 transition-all hover:bg-rose-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <>
                  <span>TRACK</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Format Hint */}
        <p id="search-hint" className="text-[12px] text-zinc-400 text-left px-1">
          Supports 32-bit Dota 2 ID, 64-bit Steam ID, or custom Steam profile URL.
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
              <strong className="text-red-300 uppercase">[ERROR] </strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}



        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <History className="h-3 w-3 text-rose-500/80" />
              <span>Recent:</span>
            </span>
            {recentSearches.map((item) => (
              <div
                key={item.id}
                className="group inline-flex items-center rounded-sm border border-white/[0.08] bg-zinc-900/80 text-[11px] font-mono text-zinc-300 hover:border-rose-500/50 hover:bg-zinc-800 hover:text-white transition-all overflow-hidden"
              >
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPreset(item.id)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt=""
                      className="h-3.5 w-3.5 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <User className="h-3 w-3 text-zinc-500" />
                  )}
                  <span className="font-bold text-white max-w-[120px] truncate">{item.name}</span>
                  <span className="text-rose-400 font-semibold">{item.id}</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => handleRemoveRecent(item.id, e)}
                  title="Remove from recent searches"
                  className="px-1.5 py-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 border-l border-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleClearAllRecent}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 underline ml-1 cursor-pointer transition-colors"
            >
              Clear
            </button>
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
              className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:border-rose-500/50 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
