import { Target, Cpu, ShieldCheck, Terminal } from "lucide-react";

export function AboutSection() {
  const pillars = [
    {
      icon: <Target className="h-5 w-5 text-rose-500" />,
      tag: "COMPETITIVE_FOCUS",
      title: "Precision Matchmaking Insight",
      desc: "Designed to provide ranked players with uncompromised telemetry on item timings, lane stage efficiency, and teamfight execution.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-rose-500" />,
      tag: "PARSER_BACKBONE",
      title: "OpenDota Architecture",
      desc: "Architected to ingest combat logs and parse replay data using OpenDota's battle-tested open-source parser infrastructure.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-rose-500" />,
      tag: "DATA_INTEGRITY",
      title: "Public Match Privacy",
      desc: "Strictly adheres to player privacy by querying only matchmaking data made public through Dota 2 client settings.",
    },
  ];

  return (
    <section id="about" className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#08090C] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Platform Statement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
              ABOUT_PLATFORM // MISSION
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono leading-tight">
              An Analytics Suite Built for the Modern Dota 2 Competitor
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              DotaTrack was conceived to eliminate clutter. Whether you are grinding ranked MMR, mastering Patch 7.37e
              facets, or assessing lane trades, our mission is to deliver clean, actionable telemetry without marketing
              gimmicks.
            </p>
            <div className="pt-2">
              <a
                href="#search-section"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>&gt; Search an Account Now</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="tactical-panel rounded-sm p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-sm bg-rose-950/30 border border-rose-900/40">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 bg-black/50 px-1.5 py-0.5 rounded-sm">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
