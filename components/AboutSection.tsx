import { ShieldCheck, Cpu, Flame, Target } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: <Target className="h-5 w-5 text-rose-500" />,
      title: "Precision Matchmaking Insight",
      desc: "Built to provide serious Dota 2 players with actionable data on item timings, lane efficiency, and teamfight impact.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-rose-500" />,
      title: "OpenDota Architecture",
      desc: "Designed to interface directly with OpenDota's battle-tested parser infrastructure for match replays and combat logs.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-rose-500" />,
      title: "Privacy First",
      desc: "DotaTrack only accesses publicly available match data exposed via your Steam matchmaking settings.",
    },
  ];

  return (
    <section id="about" className="relative py-16 sm:py-24 border-t border-white/[0.06] bg-[#090A0F] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-rose-500 font-bold">
              ABOUT DOTATRACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              An Analytics Platform Crafted for the Modern Dota 2 Competitor
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              DotaTrack was conceived to cut through the noise. Whether you are grinding ranked MMR, refining your hero
              pool, or analyzing your lane stage execution, our objective is to bring clear, honest telemetry to your
              games.
            </p>
            <div className="pt-2">
              <a
                href="#search-section"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
              >
                Track an account now →
              </a>
            </div>
          </div>

          {/* Right Column: Key Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.08] bg-[#12141D] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 inline-flex p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
