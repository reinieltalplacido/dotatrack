import { Shield, Zap, Brain, Sparkles } from "lucide-react";

export function HeroesSection() {
  const attributes = [
    {
      id: "str",
      name: "Strength",
      colorTag: "text-red-400",
      borderTag: "border-red-900/40",
      bgTag: "bg-red-950/20",
      badgeColor: "bg-red-950/70 text-red-300 border-red-800/40",
      icon: <Shield className="h-4 w-4 text-red-400" />,
      archetype: "Frontline, Initiator & Durability",
      heroes: ["Axe", "Pudge", "Tiny", "Earthshaker", "Centaur Warrunner", "Mars"],
      telemetry: "HP Scaling, Damage Soak, Stun Duration, BKB Engagement Window",
    },
    {
      id: "agi",
      name: "Agility",
      colorTag: "text-emerald-400",
      borderTag: "border-emerald-900/40",
      bgTag: "bg-emerald-950/20",
      badgeColor: "bg-emerald-950/70 text-emerald-300 border-emerald-800/40",
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      archetype: "Physical DPS, Carry & Mobility",
      heroes: ["Juggernaut", "Phantom Assassin", "Anti-Mage", "Sniper", "Morphling", "Faceless Void"],
      telemetry: "Attack Speed, Armor Scaling, CS/Min, Net Worth Acceleration",
    },
    {
      id: "int",
      name: "Intelligence",
      colorTag: "text-sky-400",
      borderTag: "border-sky-900/40",
      bgTag: "bg-sky-950/20",
      badgeColor: "bg-sky-950/70 text-sky-300 border-sky-800/40",
      icon: <Brain className="h-4 w-4 text-sky-400" />,
      archetype: "Spell Damage, Crowd Control & Utility",
      heroes: ["Invoker", "Crystal Maiden", "Rubick", "Storm Spirit", "Puck", "Witch Doctor"],
      telemetry: "Spell Amplification, Mana Efficiency, Neutral Camp Stacks, Ward Impact",
    },
    {
      id: "uni",
      name: "Universal",
      colorTag: "text-amber-400",
      borderTag: "border-amber-900/40",
      bgTag: "bg-amber-950/20",
      badgeColor: "bg-amber-950/70 text-amber-300 border-amber-800/40",
      icon: <Sparkles className="h-4 w-4 text-amber-400" />,
      archetype: "Multi-Attribute Scaling & Versatility",
      heroes: ["Windranger", "Vengeful Spirit", "Bane", "Clockwerk", "Enigma", "Techies"],
      telemetry: "Dynamic Attack Damage per Stat, Multi-Role Flex Rate, Facet Synergies",
    },
  ];

  return (
    <section id="heroes" className="relative py-14 sm:py-20 border-t border-white/[0.08] bg-[#0A0B10] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-white/[0.06]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold mb-1">
            HERO_MATRIX // ATTRIBUTE BENCHMARKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            Deep Analysis Across Every Hero Class
          </h2>
        </div>

        {/* Attribute Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {attributes.map((attr) => (
            <div
              key={attr.name}
              className={`rounded-sm border ${attr.borderTag} ${attr.bgTag} p-5 flex flex-col justify-between transition-all hover:border-white/[0.2]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {attr.icon}
                    <h3 className={`font-mono text-base font-bold ${attr.colorTag}`}>
                      {attr.name}
                    </h3>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${attr.badgeColor}`}>
                    {attr.id.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-medium mb-4">
                  {attr.archetype}
                </p>

                {/* Popular Heroes in this attribute */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-2">
                    Key Benchmark Heroes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {attr.heroes.map((hero) => (
                      <span
                        key={hero}
                        className="rounded-sm bg-black/60 border border-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                      >
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Telemetry Focus Area */}
              <div className="border-t border-white/[0.06] pt-3 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500 uppercase block text-[9px] tracking-wider mb-0.5">
                  Core Analytics Tracked:
                </span>
                <span className="text-zinc-300 leading-snug block">
                  {attr.telemetry}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
