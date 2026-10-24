"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  User,
  ArrowRight,
  TrendingUp,
  Trophy,
  Swords,
  Sparkles,
  Gamepad2,
  Home,
  History,
  CornerDownLeft,
  AlertCircle,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { validateSteamId } from "@/lib/validation";
import heroesData from "@/lib/opendota/heroes-data.json";

interface RawHeroEntry {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  shortName: string;
}

const heroesList: RawHeroEntry[] = Object.values(heroesData as Record<string, RawHeroEntry>);

interface RecentPlayerSearch {
  id: string;
  name: string;
  avatarUrl?: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = "dotatrack_recent_player_searches";

const PRO_PRESETS = [
  { name: "Miracle-", id: "105248644", team: "Nigma Galaxy" },
  { name: "Topson", id: "94054712", team: "Tundra Esports" },
  { name: "Yatoro", id: "321580797", team: "Team Spirit" },
  { name: "Arteezy", id: "86745912", team: "Shopify Rebellion" },
];

const NAVIGATION_ITEMS = [
  {
    id: "nav-heroes",
    title: "Go to Heroes Compendium",
    subtitle: "Explore 127 heroes, stats, counter matchups & builds",
    href: "/heroes",
    icon: Gamepad2,
  },
  {
    id: "nav-tournaments",
    title: "Go to Pro Tournaments",
    subtitle: "Live Tier-1 Liquipedia brackets, schedules & prize pools",
    href: "/tournaments",
    icon: Trophy,
  },
  {
    id: "nav-meta",
    title: "Go to Meta Trends",
    subtitle: "Hero tier lists, win rates, pick rates & patch analysis",
    href: "/meta-trends",
    icon: TrendingUp,
  },
  {
    id: "nav-match",
    title: "Go to Match Analyzer",
    subtitle: "Scoreboard breakdown, combat timeline & economy swings",
    href: "/match-data",
    icon: Swords,
  },
  {
    id: "nav-learn",
    title: "Go to Learn Academy",
    subtitle: "Attributes guide, item counter matrix & dispel mechanics",
    href: "/learn",
    icon: GraduationCap,
  },
  {
    id: "nav-home",
    title: "Go to Home / Overview",
    subtitle: "Return to DotaTrack landing page & tracker",
    href: "/",
    icon: Home,
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentPlayerSearch[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 4));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [isOpen]);

  // Lock scroll and auto-focus when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery("");
      setValidationError(null);
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle removing a recent search item
  const handleRemoveRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item.id !== id);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Check if query is a potential match ID
  const isMatchIdCandidate = useMemo(() => {
    const trimmed = query.trim();
    return /^\d{5,12}$/.test(trimmed) || /matches\/(\d{5,12})/i.test(trimmed);
  }, [query]);

  // Filter matching heroes
  const matchingHeroes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return [];
    return heroesList
      .filter(
        (hero) =>
          hero.localized_name.toLowerCase().includes(trimmed) ||
          hero.shortName.toLowerCase().includes(trimmed)
      )
      .slice(0, 5);
  }, [query]);

  // Filter matching navigation items
  const matchingNav = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return NAVIGATION_ITEMS;
    return NAVIGATION_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.subtitle.toLowerCase().includes(trimmed)
    );
  }, [query]);

  // Build the flat list of actionable items for keyboard navigation
  const flatActionItems = useMemo(() => {
    const items: Array<{
      id: string;
      category: string;
      title: string;
      subtitle?: string;
      icon: React.ComponentType<{ className?: string }>;
      action: () => void;
    }> = [];

    const trimmed = query.trim();

    if (trimmed) {
      // 1. Direct Player Tracking option
      items.push({
        id: "action-track-player",
        category: "TRACK PLAYER",
        title: `Track Player "${trimmed}"`,
        subtitle: "Validate ID / URL and view complete match & hero performance",
        icon: User,
        action: () => handleTrackPlayer(trimmed),
      });

      // 2. If it's a numeric/match ID candidate, offer match analysis
      if (isMatchIdCandidate) {
        const matchId = trimmed.match(/\d{5,12}/)?.[0] || trimmed;
        items.push({
          id: "action-analyze-match",
          category: "MATCH ANALYZER",
          title: `Analyze Match #${matchId}`,
          subtitle: "Inspect combat breakdown, timeline events & gold swings",
          icon: Swords,
          action: () => {
            onClose();
            router.push(`/match-data?id=${matchId}`);
          },
        });
      }

      // 3. Matching Heroes
      matchingHeroes.forEach((hero) => {
        items.push({
          id: `hero-${hero.id}`,
          category: "HEROES",
          title: hero.localized_name,
          subtitle: `${hero.primary_attr.toUpperCase()} Attribute Hero • View stats & counters`,
          icon: Sparkles,
          action: () => {
            onClose();
            router.push(`/heroes`);
          },
        });
      });

      // 4. Matching Pages (GO TO)
      matchingNav.forEach((nav) => {
        items.push({
          id: nav.id,
          category: "GO TO",
          title: nav.title,
          subtitle: nav.subtitle,
          icon: nav.icon,
          action: () => {
            onClose();
            router.push(nav.href);
          },
        });
      });
    } else {
      // When query is empty:

      // 1. Recent Searches (if any)
      recentSearches.forEach((recent) => {
        items.push({
          id: `recent-${recent.id}`,
          category: "RECENT SEARCHES",
          title: recent.name,
          subtitle: `Dota Account ID: ${recent.id}`,
          icon: History,
          action: () => {
            onClose();
            router.push(`/player/${recent.id}`);
          },
        });
      });

      // 2. Pro Player Presets
      PRO_PRESETS.forEach((pro) => {
        items.push({
          id: `pro-${pro.id}`,
          category: "PRO PLAYERS",
          title: `${pro.name} (${pro.team})`,
          subtitle: `Account ID: ${pro.id}`,
          icon: User,
          action: () => {
            onClose();
            router.push(`/player/${pro.id}`);
          },
        });
      });

      // 3. GO TO Navigation
      NAVIGATION_ITEMS.forEach((nav) => {
        items.push({
          id: nav.id,
          category: "GO TO",
          title: nav.title,
          subtitle: nav.subtitle,
          icon: nav.icon,
          action: () => {
            onClose();
            router.push(nav.href);
          },
        });
      });
    }

    return items;
  }, [query, isMatchIdCandidate, matchingHeroes, matchingNav, recentSearches]);

  // Keep selected index in bounds
  useEffect(() => {
    if (selectedIndex >= flatActionItems.length) {
      setSelectedIndex(0);
    }
  }, [flatActionItems, selectedIndex]);

  // Submit / Track Player handler
  const handleTrackPlayer = (inputStr: string) => {
    setValidationError(null);
    const trimmed = inputStr.trim();
    if (!trimmed) {
      setValidationError("Please enter an Account ID or Steam profile URL.");
      return;
    }

    const validation = validateSteamId(trimmed);
    if (!validation.isValid || !validation.steam32Id) {
      setValidationError(
        validation.errorMessage || "Invalid Steam Account ID. Enter a valid 32-bit ID or URL."
      );
      return;
    }

    setIsSubmitting(true);
    onClose();
    router.push(`/player/${validation.steam32Id}`);
  };

  // Keyboard navigation handler (Arrows & Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatActionItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatActionItems.length) % Math.max(1, flatActionItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatActionItems[selectedIndex]) {
        flatActionItems[selectedIndex].action();
      } else if (query.trim()) {
        handleTrackPlayer(query);
      }
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 sm:pt-20 px-3 sm:px-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette & Quick Search"
        >
          {/* Modal Dialog Card with smooth spring motion */}
          <motion.div
            key="search-modal-card"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 340,
              mass: 0.8,
            }}
            className="w-full max-w-2xl rounded-xl border border-white/[0.12] bg-[#0E1017]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search Input Bar */}
            <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#0A0C11]">
              <Search className="h-5 w-5 text-rose-500 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setValidationError(null);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search players, matches, heroes..."
                className="flex-1 bg-transparent text-sm sm:text-base font-mono text-white placeholder-zinc-500 focus:outline-none"
                autoComplete="off"
                spellCheck="false"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setValidationError(null);
                    inputRef.current?.focus();
                  }}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/[0.12] bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden text-zinc-400 hover:text-white p-1"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border-b border-red-800/60 text-xs font-mono text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Results / Commands Scrollable Area */}
            <div className="max-h-[65dvh] sm:max-h-[60vh] overflow-y-auto p-2 space-y-4 divide-y divide-white/[0.04]">
              {flatActionItems.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  No matching commands, heroes, or players found for &quot;{query}&quot;.
                </div>
              ) : (
                (() => {
                  // Group flat items by category
                  const groups: Record<string, typeof flatActionItems> = {};
                  flatActionItems.forEach((item) => {
                    if (!groups[item.category]) groups[item.category] = [];
                    groups[item.category].push(item);
                  });

                  let runningIndex = 0;

                  return Object.entries(groups).map(([category, items]) => (
                    <div key={category} className="pt-2 first:pt-0">
                      <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                        <span>{category}</span>
                        {category === "GO TO" && (
                          <span className="text-[10px] font-normal text-zinc-600">PAGES</span>
                        )}
                      </div>

                      <div className="space-y-0.5 mt-1">
                        {items.map((item) => {
                          const itemIndex = runningIndex++;
                          const isSelected = itemIndex === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <div
                              key={item.id}
                              onClick={() => item.action()}
                              onMouseEnter={() => setSelectedIndex(itemIndex)}
                              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer select-none ${
                                isSelected
                                  ? "bg-rose-500/15 text-white border-l-2 border-rose-500 pl-2.5"
                                  : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {category === "HEROES" ? (
                                  <div className="h-6 w-8 rounded overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                    <Image
                                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${
                                        heroesList.find((h) => h.localized_name === item.title)?.shortName || "pudge"
                                      }.png`}
                                      alt={item.title}
                                      width={32}
                                      height={24}
                                      className="h-full w-full object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-sm shrink-0 transition-colors ${
                                      isSelected
                                        ? "bg-rose-500 text-white"
                                        : "bg-white/[0.06] text-zinc-400 group-hover:text-white"
                                    }`}
                                  >
                                    {category === "GO TO" ? (
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    ) : (
                                      <Icon className="h-3.5 w-3.5" />
                                    )}
                                  </div>
                                )}

                                <div className="min-w-0 flex flex-col">
                                  <span className="font-mono font-medium truncate text-white">
                                    {item.title}
                                  </span>
                                  {item.subtitle && (
                                    <span className="text-[11px] font-mono text-zinc-400 truncate">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                {category === "RECENT SEARCHES" && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveRecent(item.id.replace("recent-", ""), e)}
                                    title="Remove from recent"
                                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                                {isSelected && (
                                  <kbd className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/50 px-1.5 py-0.5 rounded">
                                    <CornerDownLeft className="h-2.5 w-2.5" />
                                    <span>SELECT</span>
                                  </kbd>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>

            {/* Tactical Footer / Keyboard Hints */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-[#0A0C11] text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400 text-[10px]">↑</kbd>
                  <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400 text-[10px]">↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 text-[10px]">↵</kbd>
                  <span>to select</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-1 text-rose-400">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                  </span>
                ) : (
                  <span>DotaTrack Command Palette</span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
