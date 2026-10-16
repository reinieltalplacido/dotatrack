import { KeyRound, DatabaseZap, LineChart, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <KeyRound className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "INPUT_RESOLVER",
      title: "Enter your Steam ID",
      description:
        "Input your numerical 32-bit Account ID, 64-bit Steam ID, or Steam community vanity URL in the search field.",
      spec: "Validates against Valve Steam format specs",
    },
    {
      step: "02",
      icon: <DatabaseZap className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "DATA_INGESTION",
      title: "Retrieve your available Dota 2 player data",
      description:
        "DotaTrack queries public Valve matchmaking records and parses match results via the OpenDota API protocol.",
      spec: "Public match history & combat logs ingestion",
    },
    {
      step: "03",
      icon: <LineChart className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      tag: "TELEMETRY_ENGINE",
      title: "Explore your statistics and recent matches",
      description:
        "Gain comprehensive insights across hero win rates, lane efficiency, KDA trajectories, and individual game performances.",
      spec: "GPM, XPM, hero facets & lane advantage metrics",
    },
  ];

  return (
    <section id="workflow" className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#08090C] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1">
              SYSTEM_PIPELINE // EXECUTION FLOW
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              How DotaTrack Works
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            INTEGRATION: <span className="text-zinc-200 font-semibold">VALVE PUBLIC MATCH DATA</span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="tactical-panel rounded-sm p-6 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-rose-950/30 border border-rose-900/40">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 bg-black/50 border border-white/[0.08] px-1.5 py-0.5 rounded-sm">
                      {item.tag}
                    </span>
                    <span className="font-mono text-xl font-black text-rose-500/40">
                      {item.step}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 font-mono">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400">
                {item.spec}
              </div>
            </div>
          ))}
        </div>

        {/* Development Status Notice */}
        <div className="mt-8 rounded-sm border border-white/[0.08] bg-[#0E1017] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-white">Phase 1 Status:</strong> Steam ID input validation active. Live match payload retrieval via OpenDota will be active in the next release.
            </span>
          </div>
          <span className="text-[11px] text-rose-400 font-semibold uppercase">
            [OpenDota Connector: Queued]
          </span>
        </div>
      </div>
    </section>
  );
}
