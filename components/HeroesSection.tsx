import { Shield, Zap, Brain, Sparkles, Crosshair } from "lucide-react";

export function HeroesSection() {
  const attributes = [
    {
      name: "Strength",
      tagline: "Durability & Frontline Impact",
      color: "from-red-600/20 to-red-950/20",
      borderColor: "border-red-900/30",
      accentText: "text-red-400",
      icon: <Shield className="h-4 w-4 text-red-400" />,
      heroSamples: ["Axe", "Pudge", "Tiny", "Earthshaker"],
      trackedStats: "HP Scaling, Damage Soak, Stun Duration",
    },
    {
      name: "Agility",
      tagline: "Late Game DPS & Mobility",
      color: "from-emerald-600/20 to-emerald-950/20",
      borderColor: "border-emerald-900/30",
      accentText: "text-emerald-400",
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      heroSamples: ["Juggernaut", "Phantom Assassin", "Anti-Mage", "Sniper"],
      trackedStats: "Attack Speed, Armor, Last Hits / Min",
    },
    {
      name: "Intelligence",
      tagline: "Spell Amplification & Utility",
      color: "from-sky-600/20 to-sky-950/20",
      borderColor: "border-sky-900/30",
      accentText: "text-sky-400",
      icon: <Brain className="h-4 w-4 text-sky-400" />,
      heroSamples: ["Invoker", "Crystal Maiden", "Rubick", "Storm Spirit"],
      trackedStats: "Mana Regen, Spell Damage, Ward Efficiency",
    },
    {
      name: "Universal",
      tagline: "Dynamic Stat Scaling",
      color: "from-amber-600/20 to-amber-950/20",
      borderColor: "border-amber-900/30",
      accentText: "text-amber-400",
      icon: <Sparkles className="h-4 w-4 text-amber-400" />,
      heroSamples: ["Windranger", "Vengeful Spirit", "Invoker", "Bane"],
      trackedStats: "Multi-stat Efficiency, Flexible Role Versatility",
    },
  ];

  return (
    <section id="heroes" className="relative py-16 sm:py-24 border-t border-white/[0.06] bg-[#0A0C12] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-rose-500 font-bold">
            HERO BENCHMARKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Deep Analysis Across Every Hero Class
          </h2>
          <p className="mt-2 text-sm text-zinc-300">
            DotaTrack evaluates your hero performances categorized by primary attribute, role mastery, and item timings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {attributes.map((attr) => (
            <div
              key={attr.name}
              className={`rounded-xl border ${attr.borderColor} bg-gradient-to-b ${attr.color} p-5 flex flex-col justify-between transition-all hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {attr.icon}
                    <h3 className={`text-base font-bold tracking-tight ${attr.accentText}`}>
                      {attr.name}
                    </h3>
                  </div>
                  <Crosshair className="h-3.5 w-3.5 text-zinc-400" />
                </div>

                <p className="text-xs text-zinc-300 mb-4">{attr.tagline}</p>

                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                    Notable Heroes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {attr.heroSamples.map((hero) => (
                      <span
                        key={hero}
                        className="text-[11px] font-medium text-zinc-300 bg-black/40 border border-white/[0.05] rounded px-2 py-0.5"
                      >
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400">
                <span className="text-zinc-400 font-medium">Metrics:</span> {attr.trackedStats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
