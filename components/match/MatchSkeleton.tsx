"use client";

export function MatchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse font-mono">
      {/* Search Header Skeleton */}
      <div className="tactical-panel p-6 sm:p-8 rounded-sm mb-8 border border-white/[0.08]">
        <div className="h-6 w-48 bg-zinc-800 rounded-sm mb-2" />
        <div className="h-8 w-72 bg-zinc-700 rounded-sm mb-4" />
        <div className="h-10 w-full max-w-2xl bg-zinc-900 rounded-sm" />
      </div>

      {/* Overview Banner Skeleton */}
      <div className="tactical-panel p-6 rounded-sm mb-8 border border-white/[0.08]">
        <div className="h-5 w-64 bg-zinc-800 rounded-xs mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-zinc-900/60 rounded-sm" />
          <div className="h-28 bg-zinc-900/60 rounded-sm" />
          <div className="h-28 bg-zinc-900/60 rounded-sm" />
        </div>
      </div>

      {/* Scoreboard Skeleton */}
      <div className="tactical-panel p-6 rounded-sm border border-white/[0.08] mb-8">
        <div className="h-6 w-40 bg-zinc-800 rounded-xs mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-zinc-900/60 rounded-xs" />
          ))}
        </div>
      </div>
    </div>
  );
}
