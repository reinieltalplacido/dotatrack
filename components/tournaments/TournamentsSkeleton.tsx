export function TournamentsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-white/[0.08] flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-3 w-48 bg-zinc-800 rounded" />
          <div className="h-9 w-64 bg-zinc-800 rounded" />
          <div className="h-4 w-96 bg-zinc-800/60 rounded" />
        </div>
        <div className="h-8 w-44 bg-zinc-800 rounded" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-sm bg-zinc-900/60 border border-white/[0.04] p-4" />
        ))}
      </div>

      {/* Featured Banner Skeleton */}
      <div className="h-64 rounded-sm bg-zinc-900/40 border border-white/[0.04]" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-sm bg-zinc-900/60 border border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
