"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, KeyRound, Database, LineChart, Lock } from "lucide-react";

export function PipelineArchitecture() {
  const steps = [
    {
      num: "01",
      title: "Identity Resolution",
      desc: "Validates numerical 32-bit Account IDs, 64-bit Steam IDs, or Steam Community URLs against official Valve identity specifications.",
      icon: KeyRound,
      color: "text-amber-400",
      bg: "bg-amber-950/30 border-amber-800/40",
    },
    {
      num: "02",
      title: "OpenDota Match Parser",
      desc: "Connects to public matchmaking databases and ingests combat replay logs without requiring third-party authentication or credentials.",
      icon: Database,
      color: "text-rose-400",
      bg: "bg-rose-950/30 border-rose-800/40",
    },
    {
      num: "03",
      title: "Tactical Metrics Compilation",
      desc: "Synthesizes win rates, KDA ratios, lane phase CS@10 trading, net worth swings, and Patch 7.37e facet synergies into clean dashboards.",
      icon: LineChart,
      color: "text-emerald-400",
      bg: "bg-emerald-950/30 border-emerald-800/40",
    },
  ];

  return (
    <section id="pipeline" className="relative py-16 sm:py-24 border-t border-white/[0.08] bg-[#08090D] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Platform Mission & Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-500 font-bold block mb-2">
                OPEN ECOSYSTEM &amp; INTEGRITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
                Built on Open Standards. Zero Account Access Required.
              </h2>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              DotaTrack was built to eliminate bloated ads and aggressive paywalls. Everything is powered by the open-source OpenDota parser network and public Valve matchmaking data.
            </p>

            {/* Privacy & Trust Safeguards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-sm bg-white/[0.02] border border-white/[0.06]">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Public Matchmaking Privacy
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    We strictly respect Steam privacy settings. Only matches set to public by players in their Dota 2 client are parsed and queried.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-sm bg-white/[0.02] border border-white/[0.06]">
                <Lock className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Zero Credentials or Logins
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    You never have to log in with Steam, connect your Steam wallet, or provide personal credentials. Just enter any public Steam ID.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-sm bg-white/[0.02] border border-white/[0.06]">
                <Cpu className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    High-Performance Parser Core
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Combat event streams, gold swings, and item timings are parsed directly from official replay files (.dem) via OpenDota infrastructure.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#search-section"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-semibold text-zinc-200 transition-all"
              >
                <span>Track an Account Now</span>
                <span className="text-rose-400">↑</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Execution Flow Steps */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-2">
              DATA PIPELINE &amp; EXECUTION
            </span>

            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="tactical-panel rounded-sm p-6 border border-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${item.bg}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-base font-bold text-white font-sans">{item.title}</h3>
                        <span className="text-xs font-mono font-black text-zinc-500">{item.num}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Development Architecture Callout */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 p-4 text-xs font-mono text-zinc-300 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Live Status:</strong> OpenDota API protocol &amp; Valve matchmaking connector fully operational.
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold shrink-0">[ONLINE]</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
