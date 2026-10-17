"use client";

import { useState } from "react";
import { Search, Clipboard, Share2, Check, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface MatchSearchHeaderProps {
  currentMatchId?: string;
  onSearch: (matchId: string) => void;
  isLoading: boolean;
}

const SAMPLE_PRO_MATCH = "9049003291";

export function MatchSearchHeader({ currentMatchId, onSearch, isLoading }: MatchSearchHeaderProps) {
  const [inputValue, setInputValue] = useState(currentMatchId || "");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Extracts numeric Match ID from plain input or Dota 2 match URLs (dotabuff, opendota, stratz, steam)
  const extractMatchId = (raw: string): string | null => {
    const trimmed = raw.trim();
    // Direct match ID: 5 to 12 digits
    if (/^\d{5,12}$/.test(trimmed)) {
      return trimmed;
    }
    // Extract from URL (e.g. https://www.opendota.com/matches/9049003291)
    const urlMatch = trimmed.match(/matches\/(\d{5,12})/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
    return null;
  };

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const matchId = extractMatchId(inputValue);
    if (!matchId) {
      setError("Please enter a valid Dota 2 Match ID (e.g. 9049003291) or a match URL.");
      return;
    }

    onSearch(matchId);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
      const extracted = extractMatchId(text);
      if (extracted) {
        onSearch(extracted);
      }
    } catch {
      setError("Clipboard access denied. Please paste the Match ID directly into the input.");
    }
  };

  const handleShare = async () => {
    if (!currentMatchId) return;
    try {
      const url = `${window.location.origin}/match-data?id=${currentMatchId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="tactical-panel p-6 sm:p-8 rounded-sm mb-8 border border-white/[0.08] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/[0.04] rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-sm bg-blue-950/70 border border-blue-700/50 px-2.5 py-1 text-[11px] font-mono text-blue-300 font-bold tracking-wider mb-2">
          <span>MATCH TELEMETRY &amp; COMBAT ANALYZER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
          DOTA 2 MATCH ANALYZER
        </h1>
        <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-2xl mt-1 leading-relaxed">
          Inspect granular scoreboard metrics, lane outcomes, chronological item purchases, ability skill builds,
          gold &amp; XP swings, and combat timelines using verified match data.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleAnalyze} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste Match ID (e.g. 9049003291) or OpenDota / Dotabuff URL..."
              className="w-full bg-zinc-950 border border-white/[0.12] focus:border-rose-500 rounded-sm pl-10 pr-24 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
            {/* Quick Paste Button inside input */}
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-white/[0.08] rounded-xs transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="h-3 w-3" />
              <span>PASTE</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-rose-950/50 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <span>ANALYZE MATCH</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800/50 p-2.5 rounded-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Links & Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.04]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-zinc-500">Quick Test:</span>
          <button
            type="button"
            onClick={() => {
              setInputValue(SAMPLE_PRO_MATCH);
              onSearch(SAMPLE_PRO_MATCH);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-sm bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Sample Pro Match ({SAMPLE_PRO_MATCH})</span>
          </button>
        </div>

        {currentMatchId && (
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-sm bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copy shareable link"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">COPIED LINK!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3 text-zinc-400" />
                <span>SHARE ANALYSIS URL</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
