export default function Loading() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="border-b border-white/[0.08] bg-[#0A0C13] pt-6 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 w-36 bg-zinc-800 rounded-sm" />
            <div className="h-7 w-40 bg-zinc-800 rounded-sm" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded bg-zinc-800 border border-white/[0.08]" />
              <div className="space-y-2">
                <div className="h-7 w-48 bg-zinc-800 rounded" />
                <div className="h-4 w-36 bg-zinc-800/80 rounded" />
                <div className="h-6 w-32 bg-zinc-800/60 rounded" />
              </div>
            </div>

            <div className="h-20 w-72 bg-zinc-900 border border-white/[0.06] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Tabs Bar Skeleton */}
      <div className="border-b border-white/[0.08] bg-[#0A0C13] py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-2">
          <div className="h-8 w-24 bg-rose-900/50 rounded-sm" />
          <div className="h-8 w-24 bg-zinc-800 rounded-sm" />
          <div className="h-8 w-24 bg-zinc-800 rounded-sm" />
          <div className="h-8 w-24 bg-zinc-800 rounded-sm" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-900/80 rounded-sm border border-white/[0.04]" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-64 bg-zinc-900/80 rounded-sm border border-white/[0.04]" />
          <div className="lg:col-span-5 h-64 bg-zinc-900/80 rounded-sm border border-white/[0.04]" />
        </div>

        <div className="h-48 bg-zinc-900/80 rounded-sm border border-white/[0.04]" />
      </main>
    </div>
  );
}
