import { Swords, BarChart3, Sparkles, TrendingUp, Compass, ShieldAlert } from "lucide-react";

export function FeatureHighlights() {
  const highlights = [
    {
      icon: <Swords className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "COMBAT_TELEMETRY",
      title: "Match History",
      description: "Review your recent games, results, and match performance.",
      details: [
        { label: "Game Modes", val: "Ranked & Turbo" },
        { label: "Side Tracking", val: "Radiant / Dire" },
        { label: "Timings", val: "Roshan & Gold Swings" },
      ],
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "PERFORMANCE_INDICES",
      title: "Player Analytics",
      description: "Understand your win rate, KDA, and performance trends.",
      details: [
        { label: "Winrate Ratio", val: "Calculated by Patch" },
        { label: "Lane Impact", val: "CS@10 & Denies" },
        { label: "Efficiency", val: "GPM / XPM Curves" },
      ],
    },
    {
      icon: <Sparkles className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "FACET_HERO_MASTERY",
      title: "Hero Insights",
      description: "Discover your most-played heroes and their results.",
      details: [
        { label: "Role Specialization", val: "Pos 1 through Pos 5" },
        { label: "Facet Winrates", val: "7.37e Build Synergy" },
        { label: "Itemization", val: "Core Purchase Timings" },
      ],
    },
  ];

  return (
    <section className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#090A0E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1">
              PLATFORM_CAPABILITIES // TELEMETRY MODULES
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              Designed for Competitive Dota 2 Players
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            PARSING ENGINE: <span className="text-zinc-200 font-semibold">OPENDOTA V1 SPEC</span>
          </div>
        </div>

        {/* Tactical 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="tactical-panel rounded-sm p-6 relative flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#151219] border border-rose-900/40 text-rose-500 group-hover:border-rose-600/50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-black/50 border border-white/[0.08] text-zinc-400">
                    {item.tag}
                  </span>
                </div>

                {/* Feature Title */}
                <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>

                {/* Feature Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Telemetry Breakdown Details */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                {item.details.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">{detail.label}:</span>
                    <span className="text-zinc-200 font-medium">{detail.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
