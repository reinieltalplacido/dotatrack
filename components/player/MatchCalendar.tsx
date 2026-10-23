"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Swords,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { DailyMatchActivity, PlayerMatchHistoryItem } from "@/lib/opendota/types";

interface MatchCalendarProps {
  dailyActivity?: Record<string, DailyMatchActivity>;
  matchHistory?: PlayerMatchHistoryItem[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MatchCalendar({ dailyActivity = {}, matchHistory = [] }: MatchCalendarProps) {
  // Determine initial month based on latest match date, or today
  const initialDate = useMemo(() => {
    if (matchHistory.length > 0 && matchHistory[0].startTime) {
      return new Date(matchHistory[0].startTime * 1000);
    }
    const dates = Object.keys(dailyActivity).sort();
    if (dates.length > 0) {
      const latest = dates[dates.length - 1];
      const [y, m, d] = latest.split("-").map(Number);
      return new Date(y, m - 1, d || 1);
    }
    return new Date();
  }, [dailyActivity, matchHistory]);

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(() => {
    if (matchHistory.length > 0 && matchHistory[0].dateStr) {
      return matchHistory[0].dateStr;
    }
    const dates = Object.keys(dailyActivity).sort();
    return dates.length > 0 ? dates[dates.length - 1] : null;
  });

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Jump to latest matches month
  const handleJumpToLatest = () => {
    setCurrentYear(initialDate.getFullYear());
    setCurrentMonth(initialDate.getMonth());
    if (matchHistory.length > 0) {
      setSelectedDateStr(matchHistory[0].dateStr);
    }
  };

  // Build calendar matrix for currentYear and currentMonth
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells: Array<{
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      activity?: DailyMatchActivity;
    }> = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 12 : currentMonth;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: false,
        activity: dailyActivity[dateStr],
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: true,
        activity: dailyActivity[dateStr],
      });
    }

    // Next month filler days to complete grid (42 cells: 6 rows of 7)
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextM = currentMonth === 11 ? 1 : currentMonth + 2;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: false,
        activity: dailyActivity[dateStr],
      });
    }

    return cells;
  }, [currentYear, currentMonth, dailyActivity]);

  // Aggregate monthly stats for current view
  const monthStats = useMemo(() => {
    let totalGames = 0;
    let wins = 0;
    let losses = 0;
    let activeDays = 0;

    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    for (const [dateStr, act] of Object.entries(dailyActivity)) {
      if (dateStr.startsWith(prefix)) {
        totalGames += act.total;
        wins += act.wins;
        losses += act.losses;
        activeDays += 1;
      }
    }

    const winRate = totalGames > 0 ? Number(((wins / totalGames) * 100).toFixed(1)) : 0;
    return { totalGames, wins, losses, winRate, activeDays };
  }, [currentYear, currentMonth, dailyActivity]);

  // Selected day data
  const selectedActivity = selectedDateStr ? dailyActivity[selectedDateStr] : null;

  return (
    <div className="tactical-panel p-5 rounded-sm border border-white/[0.08]">
      {/* Header with Month Navigation and Month Totals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="h-5 w-5 text-rose-500" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                Match Activity Calendar
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                100 Games Analyzed
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daily win & loss record tracked across match history
            </p>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleJumpToLatest}
            className="px-2.5 py-1 text-[11px] font-mono rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors"
            title="Jump to latest matches"
          >
            Latest
          </button>
          <div className="flex items-center rounded border border-white/[0.08] bg-black/40">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-zinc-200 min-w-[125px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Month Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 bg-black/40 border border-white/[0.04] p-2.5 rounded-sm text-xs font-mono">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">GAMES IN MONTH</span>
          <span className="text-sm font-bold text-white">
            {monthStats.totalGames} <span className="text-[11px] text-zinc-500 font-normal">across {monthStats.activeDays} days</span>
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">MONTHLY RECORD</span>
          <span className="text-sm font-bold">
            <span className="text-emerald-400">{monthStats.wins}W</span>
            <span className="text-zinc-500"> - </span>
            <span className="text-rose-400">{monthStats.losses}L</span>
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">MONTH WIN RATE</span>
          <span
            className={`text-sm font-bold ${
              monthStats.totalGames === 0
                ? "text-zinc-500"
                : monthStats.winRate >= 50
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {monthStats.totalGames > 0 ? `${monthStats.winRate}%` : "—"}
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">TOTAL RECORDED</span>
          <span className="text-sm font-bold text-zinc-300">
            {matchHistory.length} Matches
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* 7x6 Day Cells Matrix */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell) => {
            const hasActivity = Boolean(cell.activity && cell.activity.total > 0);
            const isSelected = selectedDateStr === cell.dateStr;
            const act = cell.activity;

            // Determine day performance status
            let cellStyle = "bg-[#0A0C12]/60 border-white/[0.04] text-zinc-500 hover:border-white/[0.15]";
            if (!cell.isCurrentMonth) {
              cellStyle = "bg-[#07080c]/30 border-white/[0.02] text-zinc-700 opacity-40";
            } else if (hasActivity && act) {
              if (act.wins > act.losses) {
                cellStyle = "bg-emerald-950/25 border-emerald-500/40 text-zinc-200 hover:border-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.06)]";
              } else if (act.losses > act.wins) {
                cellStyle = "bg-rose-950/25 border-rose-500/40 text-zinc-200 hover:border-rose-400 shadow-[inset_0_0_12px_rgba(225,29,72,0.06)]";
              } else {
                cellStyle = "bg-amber-950/20 border-amber-500/40 text-zinc-200 hover:border-amber-400";
              }
            }

            if (isSelected) {
              cellStyle += " ring-2 ring-rose-500 border-rose-400";
            }

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`relative flex flex-col justify-between p-1.5 sm:p-2 min-h-[58px] sm:min-h-[68px] rounded-sm border text-left transition-all ${cellStyle}`}
              >
                {/* Day number */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono ${
                      cell.isCurrentMonth
                        ? hasActivity
                          ? "font-bold text-white"
                          : "text-zinc-400"
                        : "text-zinc-700"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {hasActivity && act && (
                    <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                      {act.total} {act.total === 1 ? "game" : "games"}
                    </span>
                  )}
                </div>

                {/* Daily Win / Loss Pills */}
                {hasActivity && act ? (
                  <div className="mt-1 flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold">
                    {act.wins > 0 && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {act.wins}W
                      </span>
                    )}
                    {act.losses > 0 && (
                      <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {act.losses}L
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector */}
      {selectedDateStr && (
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Matches On {selectedDateStr}
              </h3>
            </div>
            {selectedActivity && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-zinc-400">
                  Total: <strong className="text-white">{selectedActivity.total} Games</strong>
                </span>
                <span className="text-emerald-400 font-bold">{selectedActivity.wins} Wins</span>
                <span className="text-rose-400 font-bold">{selectedActivity.losses} Losses</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/[0.08] text-amber-400 font-bold">
                  {selectedActivity.winRate}% Win Rate
                </span>
              </div>
            )}
          </div>

          {!selectedActivity || selectedActivity.matches.length === 0 ? (
            <div className="p-4 rounded-sm bg-black/20 border border-white/[0.04] text-center font-mono text-xs text-zinc-500">
              No matches recorded on {selectedDateStr} in the 100-match sample window.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedActivity.matches.map((m) => (
                <div
                  key={m.matchId}
                  className="flex items-center justify-between p-2.5 rounded-sm bg-black/40 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  {/* Hero & Outcome */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-7 w-12 overflow-hidden rounded bg-black border border-white/[0.08] shrink-0">
                      <Image
                        src={m.heroImageUrl}
                        alt={m.heroLocalizedName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {m.heroLocalizedName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border ${
                            m.isWin
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                              : "bg-rose-950/60 text-rose-400 border-rose-500/40"
                          }`}
                        >
                          {m.isWin ? (
                            <>
                              <CheckCircle2 className="h-2.5 w-2.5" /> WIN
                            </>
                          ) : (
                            <>
                              <XCircle className="h-2.5 w-2.5" /> LOSS
                            </>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {m.isRadiant ? "Radiant" : "Dire"}
                      </span>
                    </div>
                  </div>

                  {/* KDA & Duration */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">KDA</span>
                      <span className="font-bold text-amber-400">{m.kda}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-zinc-500 block">DURATION</span>
                      <span className="text-zinc-300">{m.durationFormatted}</span>
                    </div>
                    <a
                      href={`https://www.opendota.com/matches/${m.matchId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors"
                    >
                      Match #{m.matchId}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
