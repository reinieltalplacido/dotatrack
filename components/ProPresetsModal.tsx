"use client";

import { useState, useEffect, useMemo, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  X,
  Search,
  Trophy,
  Swords,
  ArrowRight,
  Sparkles,
  Check,
  Copy,
  Loader2,
} from "lucide-react";
import { ALL_PRO_PRESETS, ProPresetPlayer } from "@/lib/pro-players-presets";

const emptySubscribe = () => () => {};

interface ProPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (accountId: string) => void;
}

export function ProPresetsModal({
  isOpen,
  onClose,
  onSelectPlayer,
}: ProPresetsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [players, setPlayers] = useState<ProPresetPlayer[]>(ALL_PRO_PRESETS);
  const [isLoadingPros, setIsLoadingPros] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleClose = useCallback(() => {
    setSearchQuery("");
    setSelectedRole("all");
    onClose();
  }, [onClose]);

  // Fetch live pro profiles from OpenDota when opened
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    setIsLoadingPros(true);

    fetch("/api/pro-players")
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && data?.players && Array.isArray(data.players) && data.players.length > 0) {
          setPlayers(data.players);
        }
      })
      .catch((err) => {
        console.error("Failed to load live pro profiles:", err);
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoadingPros(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen]);

  // Autofocus input on open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // Guarantee unique players by ID
    const uniqueMap = new Map<string, ProPresetPlayer>();
    for (const p of players) {
      if (!uniqueMap.has(p.id)) {
        uniqueMap.set(p.id, p);
      }
    }

    return Array.from(uniqueMap.values()).filter((player) => {
      // Role filter
      if (selectedRole !== "all") {
        if (selectedRole === "carry" && player.role !== "Carry") return false;
        if (selectedRole === "mid" && player.role !== "Midlane") return false;
        if (selectedRole === "offlane" && player.role !== "Offlane") return false;
        if (selectedRole === "support" && player.role !== "Support" && player.role !== "Hard Support") return false;
      }

      // Text query
      if (q) {
        const nameMatch = player.name.toLowerCase().includes(q);
        const personaMatch = player.personaname ? player.personaname.toLowerCase().includes(q) : false;
        const roleMatch = player.role ? player.role.toLowerCase().includes(q) : false;
        const idMatch = player.id.includes(q);
        const countryMatch = player.country ? player.country.toLowerCase().includes(q) : false;
        return nameMatch || personaMatch || roleMatch || idMatch || countryMatch;
      }

      return true;
    });
  }, [players, searchQuery, selectedRole]);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-presets-title"
    >
      {/* Dark backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-xl border border-white/[0.1] bg-[#0A0B10] shadow-2xl shadow-black/80 overflow-hidden font-sans"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0D0F16]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="pro-presets-title" className="text-sm sm:text-base font-bold text-white tracking-tight font-mono">
                  PRO PLAYER DIRECTORY
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-400">
                  <Sparkles className="w-2.5 h-2.5" />
                  Verified Pro Profiles
                </span>
                {isLoadingPros && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                    Fetching profiles...
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Click any pro player to instantly load their competitive analytics, signature heroes, and match history.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Role Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#08090E]/60 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pro player handle, Steam name, role, or Account ID..."
              className="w-full rounded-lg border border-white/[0.1] bg-black/40 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-500/80 focus:outline-none focus:ring-1 focus:ring-rose-500/80 transition-all font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-[11px] text-zinc-500 uppercase shrink-0 mr-1 flex items-center gap-1">
              <Swords className="w-3 h-3" /> Role:
            </span>
            {[
              { id: "all", label: "All Roles" },
              { id: "carry", label: "Pos 1 Carry" },
              { id: "mid", label: "Pos 2 Midlane" },
              { id: "offlane", label: "Pos 3 Offlane" },
              { id: "support", label: "Pos 4 / 5 Support" },
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`shrink-0 rounded px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                  selectedRole === role.id
                    ? "bg-rose-600 text-white font-bold shadow-xs"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Players List / Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-h-[52vh] space-y-2">
          {filteredPlayers.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              <p>No pro players found matching &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("all");
                }}
                className="mt-3 text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPlayers.map((player) => {
                const isCopied = copiedId === player.id;
                return (
                  <div
                    key={player.id}
                    onClick={() => {
                      onSelectPlayer(player.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectPlayer(player.id);
                        onClose();
                      }
                    }}
                    className="group relative flex items-center justify-between p-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-rose-500/40 transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      {/* Live Steam Avatar */}
                      <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.1] group-hover:border-rose-500/50 transition-colors shadow-inner">
                        {player.avatar ? (
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono font-bold text-xs text-rose-400">
                            P{player.pos}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate group-hover:text-rose-400 transition-colors">
                            {player.name}
                          </span>
                          {player.country && (
                            <span className="text-[10px] text-zinc-400 font-mono px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] shrink-0">
                              {player.country.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Clean Position & Role */}
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-rose-400 font-semibold whitespace-nowrap">
                            Pos {player.pos}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-300 font-medium whitespace-nowrap">
                            {player.role}
                          </span>
                          {player.personaname && player.personaname.toLowerCase() !== player.name.toLowerCase() && (
                            <>
                              <span className="text-zinc-600">•</span>
                              <span
                                className="text-zinc-500 truncate max-w-[120px]"
                                title={`Steam Handle: ${player.personaname}`}
                              >
                                &quot;{player.personaname}&quot;
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: ID & Inspect Action */}
                    <div className="flex flex-col items-end gap-1 shrink-0 pl-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-semibold text-zinc-400 group-hover:text-white transition-colors">
                          {player.id}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(e, player.id)}
                          title="Copy Account ID"
                          className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/[0.08] transition-colors"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Inspect <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-[#0D0F16] text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Showing {filteredPlayers.length} of {players.length} competitive accounts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">Press ESC to exit</span>
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
