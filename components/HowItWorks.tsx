import { KeyRound, DatabaseZap, LineChart, Info } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <KeyRound className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      title: "Enter your Steam ID",
      description:
        "Input your numerical 32-bit Account ID, 64-bit Steam ID, or Steam community vanity URL in the search field.",
    },
    {
      step: "02",
      icon: <DatabaseZap className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      title: "Retrieve your available Dota 2 player data",
      description:
        "DotaTrack queries public Valve matchmaking records and parses match results via the OpenDota API protocol.",
    },
    {
      step: "03",
      icon: <LineChart className="h-5 w-5 text-rose-500" aria-hidden="true" />,
      title: "Explore your statistics and recent matches",
      description:
        "Gain comprehensive insights across hero win rates, lane efficiency, KDA trajectories, and individual game performances.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 border-t border-white/[0.06] bg-[#090A0F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono tracking-widest text-rose-500 font-bold">
            TRACKING WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            How DotaTrack Works
          </h2>
          <p className="mt-3 text-sm text-zinc-300">
            A frictionless three-step process to inspect your performance history.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connector line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-[1px] bg-gradient-to-r from-transparent via-rose-600/30 to-transparent -translate-y-8 pointer-events-none" />

          {steps.map((item) => (
            <div
              key={item.step}
              className="relative dota-card rounded-xl p-6 sm:p-7 flex flex-col items-start z-10"
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between w-full mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950/40 border border-rose-800/40">
                  {item.icon}
                </div>
                <span className="font-mono text-2xl font-black text-rose-600/30">
                  {item.step}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Developmental Status Notice */}
        <div className="mt-12 mx-auto max-w-2xl rounded-lg border border-white/[0.08] bg-[#12141C]/80 p-4 flex items-start gap-3 text-xs text-zinc-400">
          <Info className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <span className="font-semibold text-zinc-300">Phase 1 Status:</span> The search field is active with local
            Steam ID validation. Live player data synchronization will be connected in the subsequent development step
            using the OpenDota API.
          </p>
        </div>
      </div>
    </section>
  );
}
