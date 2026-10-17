export function HeroCompendiumSkeleton() {
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

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-sm bg-zinc-900/60 border border-white/[0.04] p-4" />
        ))}
      </div>

      {/* Controls Bar Skeleton */}
      <div className="h-20 rounded-sm bg-zinc-900/40 border border-white/[0.04]" />

      {/* Hero Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="h-44 rounded-sm bg-zinc-900/60 border border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
