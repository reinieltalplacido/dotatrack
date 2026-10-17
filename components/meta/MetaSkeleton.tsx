"use client";

export function MetaSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse font-mono">
      {/* Header Skeleton */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm mb-8 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-36 bg-zinc-800 rounded-sm" />
            <div className="h-6 w-24 bg-zinc-850 rounded-sm" />
          </div>
          <div className="h-6 w-32 bg-zinc-800 rounded-sm" />
        </div>

        <div className="h-8 w-72 bg-zinc-700 rounded-sm mb-3" />
        <div className="h-4 w-full max-w-xl bg-zinc-800 rounded-sm mb-6" />

        {/* Bracket tabs skeleton */}
        <div className="border-t border-white/[0.06] pt-4 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-zinc-800 rounded-sm" />
          ))}
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="tactical-panel p-5 rounded-sm border border-white/[0.08] h-32 flex flex-col justify-between">
            <div className="h-4 w-28 bg-zinc-800 rounded-xs" />
            <div className="h-8 w-36 bg-zinc-700 rounded-xs" />
            <div className="h-3 w-40 bg-zinc-850 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8 h-96 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 bg-zinc-800 rounded-xs" />
          <div className="h-6 w-40 bg-zinc-850 rounded-xs" />
        </div>
        <div className="flex-1 my-4 bg-black/40 border border-white/[0.04] rounded-sm" />
        <div className="h-4 w-32 bg-zinc-800 rounded-xs" />
      </div>

      {/* Tier List Skeleton */}
      <div className="tactical-panel p-6 rounded-sm border border-white/[0.08]">
        <div className="h-6 w-48 bg-zinc-800 rounded-xs mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900/60 border border-white/[0.04] rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
