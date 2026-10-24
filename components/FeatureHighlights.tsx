import Link from "next/link";
import { BookOpen, TrendingUp, LineChart, Trophy, ArrowRight, ShieldCheck, Database, RefreshCw } from "lucide-react";

export function FeatureHighlights() {
  const capabilities = [
    {
      icon: <BookOpen className="h-5 w-5 text-rose-400" aria-hidden="true" />,
      title: "Hero Compendium",
      description: "Complete 124-hero roster database featuring facet win rates, innate ability synergies, and item timing benchmarks.",
      href: "/heroes",
      cta: "Browse Heroes",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-amber-400" aria-hidden="true" />,
      title: "Bracket Meta Trends",
      description: "Hero win rate and pick rate divergence mapped across 8 skill brackets from Herald to Immortal.",
      href: "/meta-trends",
      cta: "Explore Tier List",
    },
    {
      icon: <LineChart className="h-5 w-5 text-emerald-400" aria-hidden="true" />,
      title: "Match Timelines & Curves",
      description: "Gold and experience advantage swings, Roshan kill markers, buyback timings, and CS@10 lane performance.",
      href: "/match-data",
      cta: "Inspect Match Data",
    },
    {
      icon: <Trophy className="h-5 w-5 text-cyan-400" aria-hidden="true" />,
      title: "Pro Tournament Circuit",
      description: "Premier and Major tournament playoff brackets, series scores, roster histories, and live match feeds.",
      href: "/tournaments",
      cta: "View Tournaments",
    },
  ];

  const dataPillars = [
    {
      icon: <Database className="h-4 w-4 text-zinc-400" />,
      title: "OpenDota & Valve APIs",
      description: "Public parsed replay logs and official Valve Steam Web API telemetry.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-zinc-400" />,
      title: "Multi-Format ID Resolution",
      description: "Instant lookup for 32-bit Account IDs, 64-bit Steam IDs, and vanity profile URLs.",
    },
    {
      icon: <RefreshCw className="h-4 w-4 text-zinc-400" />,
      title: "Patch 7.37e Baseline",
      description: "Continuous synchronization with recent hero facets, balance changes, and active meta shifts.",
    },
  ];

  return (
    <section className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#08090D]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 pb-5 border-b border-white/[0.06] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Platform Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-sans">
              Direct access to parsed replay telemetry, hero facet statistics, and pro tournament records.
            </p>
          </div>
        </div>

        {/* 4-Pillar Interactive Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {capabilities.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl bg-[#0C0E15] p-5 border border-white/[0.07] hover:border-white/[0.18] shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-white/[0.16] transition-colors">
                    {item.icon}
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>

                <h3 className="text-base font-bold text-white mb-2 font-sans group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.05] text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                {item.cta} →
              </div>
            </Link>
          ))}
        </div>

        {/* Data Architecture & Reliability Strip */}
        <div className="rounded-xl bg-[#0A0C13] border border-white/[0.06] p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataPillars.map((pillar) => (
              <div key={pillar.title} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 font-sans mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed font-sans text-pretty">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
