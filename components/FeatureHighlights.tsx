import { Swords, BarChart3, Sparkles } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  metrics: string[];
}

function FeatureCard({ icon, title, description, badge, metrics }: FeatureCardProps) {
  return (
    <div className="dota-card rounded-xl p-6 relative flex flex-col justify-between group">
      <div>
        {/* Card Header & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#181119] border border-rose-900/40 text-rose-500 group-hover:text-rose-400 group-hover:border-rose-600/50 transition-colors">
            {icon}
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-white/[0.08] bg-zinc-900/60 text-zinc-400">
            {badge}
          </span>
        </div>

        {/* Feature Title */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-rose-100 transition-colors">
          {title}
        </h3>

        {/* Feature Description */}
        <p className="text-sm text-zinc-300 leading-relaxed mb-5">
          {description}
        </p>
      </div>

      {/* Pill Metrics preview */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
        {metrics.map((m) => (
          <span
            key={m}
            className="inline-flex items-center text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.05] rounded px-2 py-0.5"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeatureHighlights() {
  const features = [
    {
      icon: <Swords className="h-5 w-5" aria-hidden="true" />,
      title: "Match History",
      description: "Review your recent games, results, and match performance.",
      badge: "Games",
      metrics: ["Radiant vs Dire", "Duration", "Win/Loss", "Game Mode"],
    },
    {
      icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
      title: "Player Analytics",
      description: "Understand your win rate, KDA, and performance trends.",
      badge: "Metrics",
      metrics: ["Win Rate %", "KDA Ratio", "GPM & XPM", "Impact Score"],
    },
    {
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
      title: "Hero Insights",
      description: "Discover your most-played heroes and their results.",
      badge: "Mastery",
      metrics: ["Most Played", "Hero Winrate", "Role Fit", "Lane Outcomes"],
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 border-t border-white/[0.06] bg-[#0A0B10]/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-mono tracking-widest text-rose-500 font-bold mb-2">
            CORE CAPABILITIES
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Designed for Competitive Dota 2 Players
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              metrics={feature.metrics}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
