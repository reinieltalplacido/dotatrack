export interface MechanicItem {
  id: string;
  category: "main" | "abilities" | "attack" | "buildings" | "items";
  subcategory: string;
  title: string;
  shortDesc: string;
  inDepthExplanation: string;
  formulaOrRule?: string;
  proExecutionTip: string;
  keyExamples?: string[];
  tags: string[];
}

export const MECHANICS_CATEGORIES = [
  { id: "all", label: "All Mechanics" },
  { id: "main", label: "Core Stats & Physics" },
  { id: "abilities", label: "Abilities & Casting" },
  { id: "attack", label: "Attack, Damage & Orbs" },
  { id: "buildings", label: "Map & Neutral Buildings" },
  { id: "items", label: "Economy & Item Rules" },
] as const;

export const MECHANICS_DATA: MechanicItem[] = [
  // --- CORE STATS & PHYSICS ---
  {
    id: "turn-rate",
    category: "main",
    subcategory: "Movement & Physics",
    title: "Turn Rate & Facing Direction",
    shortDesc: "The speed at which a unit rotates to face a new target or direction before moving, attacking, or casting.",
    inDepthExplanation:
      "Unlike most MOBAs where heroes turn instantaneously, Dota 2 heroes have realistic turn rates measured in radians per second. A hero must face within 11.5 degrees of their target to cast a directed spell or begin an auto-attack. Slowing turn rate makes dodging skillshots or escaping impossible.",
    formulaOrRule: "Turn Time = (Turn Angle in radians) / (Turn Rate × 30)",
    proExecutionTip:
      "Batrider's Sticky Napalm reduces turn rate by up to 70%. When facing Sticky Napalm, turning back to fight takes nearly a full second. Heroes like Pangolier and Io are unique: Io can attack and cast in any direction without turning!",
    keyExamples: ["Batrider (Sticky Napalm)", "Io (Zero Turn Requirement)", "Force Staff (Pushes in direction facing)"],
    tags: ["turn rate", "movement", "facing", "rotation", "physics"],
  },
  {
    id: "status-slow-resistance",
    category: "main",
    subcategory: "Defensive Stats",
    title: "Status Resistance & Slow Resistance",
    shortDesc: "Reduces the duration of incoming crowd-control debuffs and the magnitude of movement/attack speed slows.",
    inDepthExplanation:
      "Status Resistance reduces the DURATION of most debuffs (stuns, silences, disarms, roots). Slow Resistance specifically reduces the INTENSITY of movement and attack slows (e.g. a 50% slow against 40% slow resistance only slows by 30%).",
    formulaOrRule: "New Debuff Duration = Original Duration × (1 - Status Resistance)",
    proExecutionTip:
      "Sange and its upgrades (Sange & Yasha, Heaven's Halberd) grant Status Resistance. Heroes like Ursa (Enrage grants 50% Status Resistance) and Spirit Breaker can shrug off 4-second stuns in under 2 seconds.",
    keyExamples: ["Sange / Sange & Yasha", "Ursa (Enrage)", "Tiny (Grow Slow Resistance)"],
    tags: ["status resistance", "slow resistance", "debuffs", "durations"],
  },
  {
    id: "armor-and-ehp",
    category: "main",
    subcategory: "Defensive Stats",
    title: "Armor & Effective HP (EHP)",
    shortDesc: "Every point of armor increases a hero's Effective HP against physical attacks by 6% of their maximum health.",
    inDepthExplanation:
      "Armor does not scale linearly in percentage reduction, but it SCALES LINEARLY in Effective HP (EHP). Having 10 armor means you can survive 60% more physical damage than your raw health pool. After 25-30 armor, buying raw health (Heart, Skadi) yields far more EHP than buying more armor.",
    formulaOrRule: "Physical EHP = Max Health × (1 + 0.06 × Armor)",
    proExecutionTip:
      "Minus armor items (Desolator, Assault Cuirass, Corrosive Haze) become deadlier the closer enemy armor is to zero. Taking an enemy from 5 armor down to -5 armor increases your physical damage amp by over 45%!",
    keyExamples: ["Slardar (Corrosive Haze)", "Desolator", "Assault Cuirass", "Shiva's Guard"],
    tags: ["armor", "effective hp", "ehp", "physical damage", "minus armor"],
  },
  {
    id: "vision-and-fog",
    category: "main",
    subcategory: "Information & Vision",
    title: "Vision, Fog of War & High-Ground Advantage",
    shortDesc: "Day/night vision ranges, uphill miss chance (25%), and tree fogging mechanics.",
    inDepthExplanation:
      "Most heroes have 1800 Day Vision and 800 Night Vision. High-ground cliffs block vision from low ground unless you place an Observer Ward or cast a flying vision spell. When ranged heroes attack uphill from low ground into high ground, their attacks suffer a 25% MISS CHANCE.",
    formulaOrRule: "Standard Day Vision: 1800 | Standard Night Vision: 800 | Uphill Miss Chance: 25%",
    proExecutionTip:
      "When defending high-ground Tier 3 towers, the attacking enemy ranged carries will miss 1 out of every 4 auto-attacks if they stand below the ramp. Never fight from the river into high ground without vision.",
    keyExamples: ["Observer Ward", "Night Stalker (Dark Ascension Flying Vision)", "Slark (Shadow Dance Vision Passive)"],
    tags: ["vision", "fog of war", "high ground", "miss chance", "uphill"],
  },

  // --- ABILITIES & CASTING ---
  {
    id: "cast-point-and-backswing",
    category: "abilities",
    subcategory: "Casting Mechanics",
    title: "Cast Point & Animation Backswing Canceling",
    shortDesc: "The delay before a spell releases vs. the cosmetic recovery animation you must immediately cancel.",
    inDepthExplanation:
      "Every spell has two phases: (1) Cast Point: the windup before the spell fires. If stunned or interrupted during cast point, the spell fails and doesn't cost mana or cooldown. (2) Cast Backswing: the cosmetic recovery pose AFTER the spell fires. You can CANCEL the backswing instantly by issuing a move or attack order!",
    formulaOrRule: "Total Animation = Cast Point (Mandatory) + Cast Backswing (Cancelable via Move)",
    proExecutionTip:
      "Leshrac, Lina, and Earthshaker have long cast backswings. Pros issue a right-click movement command the exact millisecond the stun fires to cancel the 0.5s backswing delay, gaining free movement steps.",
    keyExamples: ["Lina (Light Strike Array)", "Earthshaker (Fissure)", "Jakiro (Dual Breath Backswing)"],
    tags: ["cast point", "backswing", "animation canceling", "micro", "casting"],
  },
  {
    id: "motion-buffer-range",
    category: "abilities",
    subcategory: "Casting Mechanics",
    title: "Motion Buffer Range",
    shortDesc: "A +250 unit leeway buffer that guarantees targeted spells still land if the target runs out of range during cast point.",
    inDepthExplanation:
      "If you begin casting a targeted spell with 600 cast range, and the enemy blinks or runs away during your 0.3s cast point, the spell will NOT cancel as long as they remain within 600 + 250 = 850 range of you. If they escape beyond the motion buffer, the cast aborts.",
    formulaOrRule: "Max Spell Completion Distance = Cast Range + 250 (Motion Buffer)",
    proExecutionTip:
      "Understanding motion buffer explains why targeted stuns (like Sven Storm Hammer or Vengeful Spirit Magic Missile) still hit you even if you took a step away while they were winding up.",
    keyExamples: ["Sven (Storm Hammer)", "Vengeful Spirit (Magic Missile)", "Bane (Brain Sap)"],
    tags: ["motion buffer", "cast range", "buffer", "targeting", "leeway"],
  },
  {
    id: "vector-targeting",
    category: "abilities",
    subcategory: "Targeting Systems",
    title: "Vector Targeting",
    shortDesc: "Click to set the origin point, then drag to determine the direction and trajectory of the ability.",
    inDepthExplanation:
      "Vector targeted spells require two inputs in one smooth drag: first click sets where the spell starts, and dragging the arrow sets where the spell aims or pushes enemies. This allows aiming independent of your hero's facing angle.",
    formulaOrRule: "Input: [Origin Click] $\\rightarrow$ [Drag Angle Direction] $\\rightarrow$ [Release]",
    proExecutionTip:
      "Vector targeting on Pangolier's Swashbuckle lets you jump sideways or backwards while thrusting your sword forwards. On Marci's Rebound, you can bounce off an ally and direct your landing stun in any 360-degree direction.",
    keyExamples: ["Pangolier (Swashbuckle)", "Marci (Rebound)", "Dark Seer (Wall of Replica)", "Void Spirit (Astral Step)"],
    tags: ["vector targeting", "swashbuckle", "targeting", "aiming"],
  },

  // --- ATTACK, DAMAGE & ORBS ---
  {
    id: "damage-types",
    category: "attack",
    subcategory: "Damage Formulas",
    title: "Damage Types: Physical vs Magical vs Pure vs HP Removal",
    shortDesc: "The 4 damage classifications that determine which defensive shields and resistances apply.",
    inDepthExplanation:
      "1. Physical Damage: Reduced by Armor and Damage Block. Blocked by Ghost Scepter. 2. Magical Damage: Reduced by Magic Resistance (base 25%). Blocked by Pipe, Glimmer, and BKB Debuff Immunity (grants 50% magic resist). 3. Pure Damage: Completely ignores Armor and Magic Resistance! Dealt in full, but still mitigated by flat % reduction (e.g. Spectre Dispersion). 4. HP Removal: Directly decrements health without registering as a damage event — does NOT break Blink Dagger or Healing Salve!",
    formulaOrRule: "Pure ignores Armor & Magic Resist | HP Removal never cancels Blink or Salves",
    proExecutionTip:
      "Necrophos Heartstopper Aura and Bane Enfeeble deal HP Removal, meaning enemies standing in it will not have their Blink Daggers disabled. Sun Strike and Timber Chain deal Pure damage, making them devastating against high-armor agility carries like Terrorblade.",
    keyExamples: ["Invoker Sun Strike (Pure)", "Necrophos Aura (HP Removal)", "Zeus Lightning (Magic)", "PA Crits (Physical)"],
    tags: ["damage types", "physical", "magical", "pure", "hp removal"],
  },
  {
    id: "orb-walking",
    category: "attack",
    subcategory: "Micro Techniques",
    title: "Orb Walking (Creep Aggro Immunity)",
    shortDesc: "Manually casting unique attack modifier spells on enemy heroes avoids drawing creep aggro entirely.",
    inDepthExplanation:
      "In Dota 2, right-clicking an enemy hero within 500 range of enemy creeps triggers the creep aggro rule, causing creeps to attack you. HOWEVER, if you manually press the hotkey for an attack modifier spell (e.g., press 'Q' on Drow Frost Arrows or Viper Poison Attack and click the hero), the game treats it as a SPELL CAST rather than an auto-attack, so creeps WILL NOT AGGRO YOU!",
    formulaOrRule: "Auto-attack = Draws Aggro | Manual Cast Hotkey on Target = ZERO Creep Aggro",
    proExecutionTip:
      "Mastering Orb Walking is how Viper, Drow Ranger, Silencer, and Huskar dominate mid and sidelanes. You can harass the enemy hero directly in their creep wave without ever taking minion damage or disrupting lane creep equilibrium.",
    keyExamples: ["Drow Ranger (Frost Arrows)", "Viper (Poison Attack)", "Huskar (Burning Spear)", "Silencer (Glaives of Wisdom)"],
    tags: ["orb walking", "creep aggro", "attack modifiers", "laning", "harass"],
  },
  {
    id: "cleave-vs-splash",
    category: "attack",
    subcategory: "Area Damage",
    title: "Cleave vs. Splash Damage",
    shortDesc: "Cleave deals physical damage based on primary attacker damage and IGNORES the armor of secondary targets.",
    inDepthExplanation:
      "Cleave (Battle Fury, Sven Great Cleave, Tidehunter Anchor Smash) radiates in a trapezoidal cone behind the hit target. The cleaved units take physical damage calculated from the attacker's raw damage, but REDUCED ONLY BY THEIR OWN ARMOR TYPE, ignoring flat armor values! Splash damage (Dragon Knight Elder Dragon, Magnus Empower) radiates in a circular radius around the target.",
    formulaOrRule: "Cleave Damage = Attacker Attack Damage × Cleave % (Bypasses armor of secondary units)",
    proExecutionTip:
      "When playing Sven or carrying a Battle Fury against a high-armor target like Terrorblade or Timbersaw, hit a low-armor creep standing next to them. The cleave splashing onto the high-armor hero will deal more damage than hitting the hero directly!",
    keyExamples: ["Battle Fury", "Sven (Great Cleave)", "Tidehunter (Anchor Smash)", "Dragon Knight (Elder Dragon Form)"],
    tags: ["cleave", "splash", "battle fury", "sven", "armor bypass"],
  },
  {
    id: "pseudo-random-distribution",
    category: "attack",
    subcategory: "RNG & Probability",
    title: "Pseudo-Random Distribution (PRD)",
    shortDesc: "How proc chances (Bash, Crit, Stout Block) are rigged to prevent streaks of bad luck or extreme lucky bursts.",
    inDepthExplanation:
      "Dota 2 rarely uses true random number generation. Instead, procs use Pseudo-Random Distribution (PRD). If an item has a 25% proc chance (e.g. Daedalus Crit or Skull Basher), your first hit starts with only ~8% chance. Every time you miss a proc, the chance increases. When it procs, the chance resets back down. This prevents heroes from getting 4 bashes in a row.",
    formulaOrRule: "Proc Chance = C × Current Number of Non-Proc Swings",
    proExecutionTip:
      "Pros 'prime' their crits or bashes on jungle creeps. Hit jungle creeps 4 or 5 times without a proc. Your next hit on an enemy hero now has a statistically massive ~60-70% chance to immediately crit or bash on the opening strike!",
    keyExamples: ["Skull Basher / Abyssal Blade", "Phantom Assassin (Coup de Grace)", "Slardar (Bash of the Deep uses strict 4-hit counter)"],
    tags: ["prd", "pseudo random", "rng", "bash", "crit", "priming"],
  },

  // --- MAP & NEUTRAL BUILDINGS ---
  {
    id: "twin-gates",
    category: "buildings",
    subcategory: "Map Features",
    title: "Twin Gates (Instant Cross-Map Teleportation)",
    shortDesc: "Portals located at the corners of both sidelanes allowing instant cross-map channel rotations.",
    inDepthExplanation:
      "Twin Gates connect the top-left and bottom-right corners of the New Frontiers expanded map. Channeling the gate for 3.0 seconds teleports your hero directly across the map to the opposite lane. Consumes 75 mana.",
    formulaOrRule: "Channel Time: 3.0 Seconds | Mana Cost: 75 Mana | Cooldown: None",
    proExecutionTip:
      "Twin Gates allow the offlane and safelane supports to execute instant 4-man dive ganks in the opposite lane. Always keep a sentry or ward near your sidelane Twin Gate to spot incoming enemy cross-map teleports.",
    keyExamples: ["Top Corner (Near Roshan / Safelane)", "Bottom Corner (Near Lotus Pool / Safelane)"],
    tags: ["twin gates", "portals", "teleport", "map", "rotations"],
  },
  {
    id: "lotus-pools",
    category: "buildings",
    subcategory: "Map Features",
    title: "Lotus Pools & Healing Fruit",
    shortDesc: "Neutral fruit shrines in the sidelanes that spawn healing lotuses every 3 minutes.",
    inDepthExplanation:
      "A Healing Lotus spawns in the Lotus Pool at 3:00, 6:00, 9:00, etc. Each lotus provides 125 Health and 125 Mana. 3 Healing Lotuses combine into a Great Lotus (400 HP/Mana), 2 Great Lotuses combine into a Greater Lotus (900 HP/Mana + 400 Shield), and 2 Greater Lotuses + Cheese combine into the Block of Cheese (permanent 500 shield)!",
    formulaOrRule: "Spawns every 3 Minutes | Combines: 3 Small $\\rightarrow$ Great $\\rightarrow$ Greater $\\rightarrow$ Block of Cheese",
    proExecutionTip:
      "Channeling the Lotus Pool takes only 1.0 second per fruit. Sidelane supports should contest the 3:00 and 6:00 lotuses to give their carry free burst sustain without spending gold on Salves or Clarity potions.",
    keyExamples: ["Healing Lotus", "Great Lotus", "Block of Cheese"],
    tags: ["lotus pools", "healing fruit", "sustain", "shield", "sidelane"],
  },
  {
    id: "tormentor-arena",
    category: "buildings",
    subcategory: "Neutral Objectives",
    title: "Tormentor Arena (Free Aghanim's Shard)",
    shortDesc: "Deadly reflective miniboss that spawns at 20:00, granting an Aghanim's Shard to the lowest net-worth hero.",
    inDepthExplanation:
      "Spawns at 20:00 near each team's base perimeter. Tormentor has 2500 Health, 55 Health Regen, and a 2500 Damage Barrier, but CANNOT attack. Instead, it reflects 90% of all damage taken as physical damage split equally among all heroes within 1200 range! Defeating it grants an Aghanim's Shard (worth 1400 gold) and 250 gold to the team.",
    formulaOrRule: "Spawns: 20:00 | Respawn: 10m after death | Reflection: 90% physical damage reflected in 1200 AoE",
    proExecutionTip:
      "NEVER try to solo the Tormentor with pure single-target burst unless you have immense lifesteal (Ursa, Troll) or minus armor, because the 90% reflection will kill you. Group with 3 heroes so the reflected damage is divided harmlessly among everyone.",
    keyExamples: ["Free Aghanim's Shard", "Damage Reflection Shield", "Minus-Armor Synergy (Slardar, Dazzle)"],
    tags: ["tormentor", "shard", "aghanims shard", "objective", "reflection"],
  },
  {
    id: "watchers-vision-beacons",
    category: "buildings",
    subcategory: "Map Features",
    title: "Watchers (Neutral Vision Beacons)",
    shortDesc: "Interactive map statues that grant 7 minutes of unobstructed area vision when captured.",
    inDepthExplanation:
      "Watchers are scattered across neutral camps and objective corridors. Channeling a neutral Watcher for 1.5 seconds turns it friendly, granting 800 flying vision for 7 minutes. Enemies can channel a friendly Watcher to disable it for 2 minutes.",
    formulaOrRule: "Channel Time: 1.5s | Vision Duration: 7 Minutes | Enemy Sabotage: 2m Disabled",
    proExecutionTip:
      "Watchers provide free wards! Capture the Watchers near the Roshan pit and Tormentor before starting the objective so you can see enemy smoke-ganks approaching over walls.",
    keyExamples: ["Roshan Pit Watchers", "Tormentor Gate Watchers", "Jungle Triangle Watchers"],
    tags: ["watchers", "vision", "beacons", "fog", "map control"],
  },

  // --- ECONOMY & ITEM RULES ---
  {
    id: "buyback-mechanics",
    category: "items",
    subcategory: "Economy Rules",
    title: "Buyback Formula, Cooldown & Death Tax",
    shortDesc: "The ultimate safety net: instant revival at base with an 8-minute cooldown and a respawn penalty on your next death.",
    inDepthExplanation:
      "Buying back revives your hero immediately in the fountain. However, it imposes serious costs: (1) 8-minute cooldown (480s). (2) Adds +25 seconds to your respawn timer on your next death. (3) Any gold earned while buyback death penalty is active is reduced.",
    formulaOrRule: "Buyback Cost = 200 + Floor(Net Worth / 13) | Cooldown: 480 Seconds (8 Minutes)",
    proExecutionTip:
      "Always monitor your 'Buyback Status' gold indicator in the bottom right corner of your HUD. Carries must save buyback gold before pushing high ground or starting late-game Roshan fights. Dying without buyback after minute 35 can end the game immediately.",
    keyExamples: ["Dieback (Dying right after buyback)", "8-minute Cooldown", "High-Ground Defense"],
    tags: ["buyback", "economy", "gold", "net worth", "respawn"],
  },
  {
    id: "reliable-vs-unreliable-gold",
    category: "items",
    subcategory: "Economy Rules",
    title: "Reliable vs. Unreliable Gold",
    shortDesc: "Reliable gold cannot be lost on death; Unreliable gold is deducted whenever you die.",
    inDepthExplanation:
      "Dota 2 tracks two gold balances: (1) Reliable Gold: Earned from Hero Kills, Bounty Runes, Hand of Midas, and Roshan kills. It is 100% PROTECTED and never lost upon death. (2) Unreliable Gold: Earned from creep farming, lane creeps, and passive gold generation. When you die, gold is lost ONLY from your Unreliable Gold pool.",
    formulaOrRule: "Death Gold Loss = 30 × Hero Level (Deducted exclusively from Unreliable Gold)",
    proExecutionTip:
      "When buying items, the game always spends your Unreliable Gold first to protect your gold before you die. If you know you are about to die to a gank, spend your unreliable gold on consumables (TP scrolls, wards, components) before the death animation completes!",
    keyExamples: ["Hand of Midas", "Bounty Runes", "Death Gold Penalty", "Quickbuy Panic"],
    tags: ["reliable gold", "unreliable gold", "economy", "farming", "death penalty"],
  },
  {
    id: "disassembling-items",
    category: "items",
    subcategory: "Item Management",
    title: "Disassembling Items & Item Transmutation",
    shortDesc: "Breaking complex items apart to reuse their expensive components for higher-tier late-game items.",
    inDepthExplanation:
      "Certain items can be right-clicked and 'Disassembled' at any time in the match, dropping their components on the ground to be recombined into other items. For example, Arcane Boots can be disassembled to recover the 900g Energy Booster to build Aether Lens or Lotus Orb, while the Boots of Speed are upgraded into Tranquil Boots or Boots of Travel!",
    formulaOrRule: "Right-click item $\\rightarrow$ Disassemble $\\rightarrow$ Re-use components for second item",
    proExecutionTip:
      "Common pro disassembles: (1) Arcane Boots $\\rightarrow$ Aether Lens / Lotus Orb + Tranquil Boots. (2) Vanguard $\\rightarrow$ Octarine Core / Lotus Orb + Bloodstone. (3) Echo Sabre $\\rightarrow$ Harpoon + BKB.",
    keyExamples: ["Arcane Boots", "Vanguard", "Echo Sabre", "Mask of Madness (into Satanic + Butterfly)"],
    tags: ["disassemble", "components", "energy booster", "arcane boots", "item tricks"],
  },
];
