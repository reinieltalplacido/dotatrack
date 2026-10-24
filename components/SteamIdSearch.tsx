"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  X,
  History,
  User,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { validateSteamId, ValidationResult } from "@/lib/validation";
import { PlayerDashboardData } from "@/lib/opendota/types";
import { ProPresetsModal } from "@/components/ProPresetsModal";

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
  const [loadingMessage, setLoadingMessage] = useState("Querying...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentPlayerSearch[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_SEARCHES);
        }
      }
    } catch {
      // Ignore corrupted localStorage data
    }
    return [];
  });
  const [proModalOpen, setProModalOpen] = useState(false);

  const saveRecentSearch = (item: Omit<RecentPlayerSearch, "timestamp">) => {
    const fullItem: RecentPlayerSearch = {
      ...item,
      timestamp: Date.now(),
    };
    setRecentSearches((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      const updated = [fullItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
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

  const handleSearch = useCallback(async (e?: React.FormEvent, directId?: string) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);

    const queryTarget = (directId ?? inputValue).trim();
    const validation = validateSteamId(queryTarget);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Enter a valid Steam ID or Account ID.");
      return;
    }

    const accountId = validation.steam32Id;
    if (!accountId) {
      setErrorMessage("Could not resolve a valid 32-bit Account ID from the provided input.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Fetching stats...");

    try {
      if (onSearchSubmit) {
        onSearchSubmit(validation);
      }

      setLoadingMessage("Loading player data...");
      const res = await fetch(`/api/players/${accountId}`, {
        headers: { Accept: "application/json" },
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorText =
          responseData?.error ||
          (res.status === 404
            ? `Player #${accountId} not found. Check that the ID is correct and match history is public.`
            : res.status === 429
            ? "Rate limit exceeded. Wait a few seconds and try again."
            : "Failed to load player stats. Check your connection and retry.");
        setErrorMessage(errorText);
        return;
      }

      const playerData = responseData as PlayerDashboardData;

      saveRecentSearch({
        id: String(accountId),
        name: playerData.proName || playerData.personaname || `Player #${accountId}`,
        avatarUrl: playerData.avatarUrl || undefined,
      });

      if (autoNavigate) {
        setLoadingMessage("Opening dashboard...");
        router.push(`/player/${accountId}`);
      }
    } catch {
      setErrorMessage("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [autoNavigate, inputValue, isLoading, onSearchSubmit, router]);

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
    <div id="search-section" className="w-full max-w-2xl scroll-mt-24">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        {/* Search input */}
        <div className="relative">
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-md p-1.5 transition-all focus-within:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--lp-border)",
              boxShadow: "0 2px 12px -2px rgba(0,0,0,0.4)",
            }}
          >
            <div className="relative flex-1 flex items-center min-h-[48px] px-3">
              <input
                id="steam-id-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isLoading}
                placeholder="Steam ID, Account ID, or profile URL"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                style={{ fontFamily: "var(--font-sans)" }}
                aria-describedby="search-hint search-error"
                autoComplete="off"
              />
              {inputValue && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                  aria-label="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 rounded px-6 py-3 sm:py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0 w-full sm:w-auto min-h-[44px]"
              style={{
                backgroundColor: "var(--lp-accent)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <span>Track player</span>
              )}
            </button>
          </div>
        </div>

        {/* Format hint */}
        <p id="search-hint" className="text-xs" style={{ color: "var(--lp-fg)", opacity: 0.5 }}>
          Supports 32-bit Dota 2 ID, 64-bit Steam ID, or custom Steam profile URL.
        </p>

        {/* Error */}
        {errorMessage && (
          <div
            id="search-error"
            role="alert"
            className="flex items-start gap-2.5 rounded-md p-3 text-xs text-red-200"
            style={{ backgroundColor: "rgba(127, 29, 29, 0.3)", border: "1px solid rgba(185, 28, 28, 0.5)" }}
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-1.5 pt-3"
            style={{ borderTop: "1px solid var(--lp-border)" }}
          >
            <span className="text-xs mr-1 flex items-center gap-1" style={{ color: "var(--lp-fg)", opacity: 0.5 }}>
              <History className="h-3 w-3" />
              <span>Recent</span>
            </span>
            {recentSearches.map((item) => (
              <div
                key={item.id}
                className="group inline-flex items-center rounded text-xs transition-all overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--lp-border)",
                  color: "var(--lp-fg)",
                }}
              >
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPreset(item.id)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/[0.04]"
                >
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt=""
                      className="h-3.5 w-3.5 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <User className="h-3 w-3 opacity-40" />
                  )}
                  <span className="font-medium max-w-[120px] truncate" style={{ color: "var(--lp-fg-strong)" }}>
                    {item.name}
                  </span>
                  <span className="opacity-50">{item.id}</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => handleRemoveRecent(item.id, e)}
                  title="Remove from recent searches"
                  className="px-1.5 py-1 opacity-30 hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
                  style={{ borderLeft: "1px solid var(--lp-border)" }}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleClearAllRecent}
              className="text-[10px] opacity-40 hover:opacity-80 underline ml-1 cursor-pointer transition-opacity"
              style={{ color: "var(--lp-fg)" }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Pro profiles trigger */}
        <div
          className="flex flex-wrap items-center gap-2 pt-3"
          style={{ borderTop: "1px solid var(--lp-border)" }}
        >
          <span className="text-xs flex items-center gap-1.5 shrink-0" style={{ color: "var(--lp-fg)", opacity: 0.5 }}>
            <Trophy className="w-3.5 h-3.5" />
            <span>Pro profiles</span>
          </span>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setProModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 min-h-[38px] text-xs font-medium transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "rgba(212, 54, 75, 0.12)",
              border: "1px solid rgba(212, 54, 75, 0.25)",
              color: "var(--lp-fg-strong)",
            }}
          >
            <span>Browse 50+ pro players</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </form>

      <ProPresetsModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onSelectPlayer={handleSelectPreset}
      />
    </div>
  );
}
