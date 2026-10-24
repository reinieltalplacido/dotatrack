export interface AttributeDetail {
  id: "str" | "agi" | "int" | "all";
  name: string;
  tagline: string;
  color: string;
  accentClass: string;
  badgeClass: string;
  glowClass: string;
  perPointBonuses: {
    stat: string;
    amount: string;
    description: string;
  }[];
  primaryPerks: string[];
  damageFormula: string;
  iconicHeroes: {
    id: number;
    name: string;
    role: string;
    img: string;
  }[];
  strategicAdvice: string;
}

export interface ItemCounter {
  itemId: number;
  itemName: string;
  itemImg: string;
  cost: number;
  type: "Hard Counter" | "Soft Counter" | "Kiting / Defensive" | "Pro Positioning";
  howToCounter: string;
}

export interface ThreatGuide {
  id: string;
  threatTitle: string;
  category: "defense" | "evasion" | "regen" | "magic" | "physical" | "passives" | "illusions" | "cc";
  enemyItemOrThreat: {
    name: string;
    img: string;
    description: string;
  };
  whyItIsDangerous: string;
  counterItems: ItemCounter[];
  counterHeroAbilities: {
    hero: string;
    ability: string;
    tip: string;
  }[];
  proTip: string;
}

export interface DispelRule {
  type: "Basic Dispel" | "Strong Dispel" | "Undispellable";
  description: string;
  removes: string[];
  cannotRemove: string[];
  sources: {
    name: string;
    isItem: boolean;
    costOrHero?: string;
  }[];
}

export interface DisableType {
  name: string;
  shortDesc: string;
  preventsActions: string[];
  allowsActions: string[];
  dispelRequired: "Basic Dispel" | "Strong Dispel" | "Death Only";
  exampleAbility: string;
  iconicItem: string;
}

export interface GameTiming {
  minute: string;
  title: string;
  type: "rune" | "objective" | "creeps" | "macro";
  description: string;
  impactLevel: "Critical" | "High" | "Medium";
  proExecution: string;
}

export const ATTRIBUTES_DATA: AttributeDetail[] = [
  {
    id: "str",
    name: "Strength",
    tagline: "Durability, Health Pools & Physical Might",
    color: "#EF4444",
    accentClass: "text-red-400 border-red-500/30 bg-red-950/20",
    badgeClass: "bg-red-950/70 border-red-800 text-red-300",
    glowClass: "from-red-500/20 via-transparent to-transparent",
    perPointBonuses: [
      {
        stat: "Maximum Health",
        amount: "+22 HP",
        description: "Directly increases maximum health pool, protecting against heavy burst damage.",
      },
      {
        stat: "Health Regeneration",
        amount: "+0.1 HP/s",
        description: "Boosts natural health recovery per second, aiding sustain during teamfights.",
      },
      {
        stat: "Magic Resistance (Str Heroes)",
        amount: "+0.1% Magic Resist",
        description: "Strength heroes gain inherent magic resistance per point of Strength.",
      },
      {
        stat: "Base Attack Damage",
        amount: "+1 Damage",
        description: "Strength heroes gain +1 base attack damage per point of Strength.",
      },
    ],
    primaryPerks: [
      "Frontline initiator and tank archetype",
      "Synergizes with %-based HP items like Heart of Tarrasque",
      "High resilience against high burst and magical pick-offs",
    ],
    damageFormula: "+1 Attack Damage per Strength point for Strength heroes",
    iconicHeroes: [
      {
        id: 96,
        name: "Centaur Warrunner",
        role: "Offlane Initiator",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/centaur.png",
      },
      {
        id: 2,
        name: "Axe",
        role: "Blink Call Initiator",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png",
      },
      {
        id: 14,
        name: "Pudge",
        role: "Meat Shield Roamer",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png",
      },
      {
        id: 99,
        name: "Bristleback",
        role: "Attrition Tank",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bristleback.png",
      },
    ],
    strategicAdvice:
      "Strength itemization prioritizes resistance and crowd control. Sange derivatives (Halberd, Sange & Yasha) grant status resistance and health amplification, while Armlet provides early-game burst survivability through toggle mechanics.",
  },
  {
    id: "agi",
    name: "Agility",
    tagline: "Physical Armor, Attack Velocity & Swiftness",
    color: "#10B981",
    accentClass: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
    badgeClass: "bg-emerald-950/70 border-emerald-800 text-emerald-300",
    glowClass: "from-emerald-500/20 via-transparent to-transparent",
    perPointBonuses: [
      {
        stat: "Physical Armor",
        amount: "+0.167 Armor",
        description: "Every 6 points of Agility provides approximately +1 Physical Armor, reducing physical attack and tower damage taken.",
      },
      {
        stat: "Attack Speed",
        amount: "+1 Attack Speed",
        description: "Accelerates attack animation intervals, enabling faster DPS and faster proc triggers.",
      },
      {
        stat: "Movement Speed (Agi Heroes)",
        amount: "+0.05% Movement Speed",
        description: "Agility heroes gain bonus movement speed scaling with total agility.",
      },
      {
        stat: "Base Attack Damage",
        amount: "+1 Damage",
        description: "Agility heroes gain +1 base attack damage per point of Agility.",
      },
    ],
    primaryPerks: [
      "Hard late-game physical DPS carries",
      "Natural high armor makes them resistant to physical right-clicks",
      "Multiplies exponentially with critical strike and on-hit modifiers",
    ],
    damageFormula: "+1 Attack Damage per Agility point for Agility heroes",
    iconicHeroes: [
      {
        id: 44,
        name: "Phantom Assassin",
        role: "Burst Critical Carry",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png",
      },
      {
        id: 1,
        name: "Anti-Mage",
        role: "Blink Split-Pusher",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png",
      },
      {
        id: 8,
        name: "Juggernaut",
        role: "Spin & Slash Carry",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png",
      },
      {
        id: 93,
        name: "Slark",
        role: "Essence Shift Skirmisher",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/slark.png",
      },
    ],
    strategicAdvice:
      "Agility heroes naturally scale with armor and attack speed, meaning raw health (like Skadi, Manta, or BKB) increases their Effective HP (EHP) far more than adding flat armor items.",
  },
  {
    id: "int",
    name: "Intelligence",
    tagline: "Mana Reservoirs, Spellcasting & Mystic Reserves",
    color: "#38BDF8",
    accentClass: "text-sky-400 border-sky-500/30 bg-sky-950/20",
    badgeClass: "bg-sky-950/70 border-sky-800 text-sky-300",
    glowClass: "from-sky-500/20 via-transparent to-transparent",
    perPointBonuses: [
      {
        stat: "Maximum Mana",
        amount: "+12 Mana",
        description: "Expands the mana pool, allowing repeated rotations of expensive spells and active items.",
      },
      {
        stat: "Mana Regeneration",
        amount: "+0.05 Mana/s",
        description: "Enhances baseline mana regeneration, reducing downtime between engagements.",
      },
      {
        stat: "Magic Resistance (Int Heroes)",
        amount: "+0.1% Magic Resist",
        description: "Intelligence heroes gain +0.1% magic resistance per point of Intelligence.",
      },
      {
        stat: "Base Attack Damage",
        amount: "+1 Damage",
        description: "Intelligence heroes gain +1 base attack damage per point of Intelligence.",
      },
    ],
    primaryPerks: [
      "Spellcasters, controllers, and tempo controllers",
      "High early-to-mid game kill threat with burst combos",
      "Enables heavy active-item rotations (Hex, Shiva's, Dagon, Eul's)",
    ],
    damageFormula: "+1 Attack Damage per Intelligence point for Intelligence heroes",
    iconicHeroes: [
      {
        id: 74,
        name: "Invoker",
        role: "10-Spell Arsenal",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png",
      },
      {
        id: 17,
        name: "Storm Spirit",
        role: "Ball Lightning Ganker",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/storm_spirit.png",
      },
      {
        id: 86,
        name: "Rubick",
        role: "Spell Steal Playmaker",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/rubick.png",
      },
      {
        id: 22,
        name: "Zeus",
        role: "Global Thunder Burst",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/zuus.png",
      },
    ],
    strategicAdvice:
      "Kaya and its upgrades provide Spell Amplification and Mana Cost/Loss Reduction. On Intelligence heroes, cooldown reduction (Octarine Core) and hard disables (Scythe of Vyse) turn spellcasters into devastating late-game teamfight controllers.",
  },
  {
    id: "all",
    name: "Universal",
    tagline: "The 4th Dimension: 0.7 Damage from EVERY Attribute",
    color: "#C084FC",
    accentClass: "text-purple-400 border-purple-500/30 bg-purple-950/20",
    badgeClass: "bg-purple-950/70 border-purple-800 text-purple-300",
    glowClass: "from-purple-500/20 via-transparent to-transparent",
    perPointBonuses: [
      {
        stat: "Attack Damage Scaling",
        amount: "+0.7 Damage per ANY stat",
        description: "Universal heroes gain +0.7 attack damage for EVERY point of Strength, Agility, and Intelligence combined! (10 Str + 10 Agi + 10 Int = +21 Damage).",
      },
      {
        stat: "Strength Benefit",
        amount: "+22 HP & +0.1 HP/s",
        description: "Receives full standard Strength durability bonuses.",
      },
      {
        stat: "Agility Benefit",
        amount: "+0.167 Armor & +1 AS",
        description: "Receives full standard Agility armor and attack speed scaling.",
      },
      {
        stat: "Intelligence Benefit",
        amount: "+12 Mana & +0.05 MP/s",
        description: "Receives full standard Intelligence mana pool and sustain bonuses.",
      },
    ],
    primaryPerks: [
      "Highest raw auto-attack scaling from all-stat items",
      "Supreme build flexibility across hybrid utility and carry roles",
      "Items like Eye of Skadi, Linken's Sphere, and Harpoon provide massive damage spikes",
    ],
    damageFormula: "Total Damage = 0.7 × (Strength + Agility + Intelligence)",
    iconicHeroes: [
      {
        id: 21,
        name: "Windranger",
        role: "Focus Fire Assassin",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/windrunner.png",
      },
      {
        id: 102,
        name: "Abaddon",
        role: "Unholy Curse Bruiser",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/abaddon.png",
      },
      {
        id: 126,
        name: "Void Spirit",
        role: "Astral Step Elusive",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/void_spirit.png",
      },
      {
        id: 97,
        name: "Magnus",
        role: "Shockwave & Skewer",
        img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/magnataur.png",
      },
    ],
    strategicAdvice:
      "Prioritize all-attribute items over single-stat items. An Ultimate Orb (+15 to all stats) provides 45 total attributes = +31.5 Damage, +330 HP, +2.5 Armor, and +180 Mana! Eye of Skadi gives +22 to all stats = +46.2 raw damage plus the slowing modifier.",
  },
];

export const ITEM_THREATS_DATA: ThreatGuide[] = [
  {
    id: "bkb-debuff-immunity",
    threatTitle: "Black King Bar (Debuff Immunity & Magic Resistance)",
    category: "defense",
    enemyItemOrThreat: {
      name: "Black King Bar",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/black_king_bar.png",
      description: "Grants Debuff Immunity and +50% Magic Resistance. Prevents most target spells, stuns, and crowd control from applying.",
    },
    whyItIsDangerous:
      "Allows carries and initiators (like PA, Sven, Enigma) to run uninterrupted through your team without fearing disables or magical burst.",
    counterItems: [
      {
        itemId: 208,
        itemName: "Abyssal Blade",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/abyssal_blade.png",
        cost: 6250,
        type: "Hard Counter",
        howToCounter: "Overwhelm stuns the target for 2.0 seconds directly through BKB Debuff Immunity. Crucial lockdown for melee carries.",
      },
      {
        itemId: 100,
        itemName: "Heaven's Halberd",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/heavens_halberd.png",
        cost: 3550,
        type: "Pro Positioning",
        howToCounter: "CRITICAL MECHANIC: If you disarm the enemy hero BEFORE they press BKB, activating BKB DOES NOT dispel the disarm! They will waste their BKB duration unable to attack.",
      },
      {
        itemId: 102,
        itemName: "Force Staff / Hurricane Pike",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/force_staff.png",
        cost: 2200,
        type: "Kiting / Defensive",
        howToCounter: "BKB durations decrease from 9s down to 6s. Force Staff allows your supports and backliners to push themselves out of reach and waste the BKB duration.",
      },
      {
        itemId: 37,
        itemName: "Ghost Scepter",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/ghost.png",
        cost: 1500,
        type: "Kiting / Defensive",
        howToCounter: "Renders you completely immune to physical attacks for 4 seconds, shutting down right-clicking BKB carries like Sven, Ursa, or Phantom Assassin.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Bane", ability: "Fiend's Grip", tip: "Channels a 6-second disable that pierces Debuff Immunity." },
      { hero: "Beastmaster", ability: "Primal Roar", tip: "Instant ranged 3.5s stun that ignores BKB." },
      { hero: "Axe", ability: "Berserker's Call", tip: "Forces the BKB unit to attack Axe, piercing spell immunity." },
      { hero: "Legion Commander", ability: "Duel", tip: "Forces a duel that completely pierces BKB." },
    ],
    proTip: "Do not panic when enemy BKB pops. Disengage, kite backwards using terrain and mobility items, then re-engage when the golden avatar wears off.",
  },
  {
    id: "ghost-ethereal-immunity",
    threatTitle: "Ghost Scepter & Ethereal Blade (Physical Attack Immunity)",
    category: "defense",
    enemyItemOrThreat: {
      name: "Ghost Scepter",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/ghost.png",
      description: "Enter ethereal state for 4.0 seconds. Immune to physical attacks, but unable to attack and takes +40% extra magic damage.",
    },
    whyItIsDangerous:
      "Support heroes (or Necrophos Ghost Shroud / Pugna Decrepify) use this to survive physical carries who cannot finish them off with right-clicks.",
    counterItems: [
      {
        itemId: 250,
        itemName: "Nullifier",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/nullifier.png",
        cost: 4375,
        type: "Hard Counter",
        howToCounter: "Applies a continuous purge for 5.0 seconds. The instant the target activates Ghost Scepter, Ethereal Blade, or Eul's, it is immediately dispelled, allowing you to hit them.",
      },
      {
        itemId: 263,
        itemName: "Revenant's Brooch",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/revenants_brooch.png",
        cost: 4700,
        type: "Hard Counter",
        howToCounter: "Consumes mana to convert your physical auto-attacks into magical damage. You can directly attack and kill ethereal units through Ghost Scepter!",
      },
      {
        itemId: 104,
        itemName: "Dagon",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/dagon.png",
        cost: 2850,
        type: "Soft Counter",
        howToCounter: "Units in ethereal form take +40% increased magical damage! Instant magical burst items and nukes will obliterate them.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Invoker", ability: "Deafening Blast / Sun Strike", tip: "Sun Strike deals Pure damage and bypasses ethereal physical immunity." },
      { hero: "Shadow Demon", ability: "Demonic Purge", tip: "Continuously dispels positive buffs from the target." },
      { hero: "Lina", ability: "Laguna Blade", tip: "Massive magical nuke that benefits from their ethereal magic amp." },
    ],
    proTip: "Nullifier is the premier anti-support item for physical carries in the late game. It completely neutralizes Ghost Scepter, Glimmer Cape, Eul's, and Force Staff.",
  },
  {
    id: "evasion-miss-chance",
    threatTitle: "Butterfly, Radiance & Natural Evasion (PA Blur, Windrun)",
    category: "evasion",
    enemyItemOrThreat: {
      name: "Butterfly",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/butterfly.png",
      description: "Grants +35% passive evasion. Physical attacks have a high probability of missing, dealing 0 damage.",
    },
    whyItIsDangerous:
      "Physical carries miss up to half their attacks against Phantom Assassin, Butterfly carriers, or inside Radiance/Brewmaster blind zones, drastically cutting your DPS.",
    counterItems: [
      {
        itemId: 135,
        itemName: "Monkey King Bar (MKB)",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/monkey_king_bar.png",
        cost: 4975,
        type: "Hard Counter",
        howToCounter: "Grants 80% Pierce (True Strike) chance on hit, ignoring evasion and blind entirely, while dealing +70 bonus magical damage.",
      },
      {
        itemId: 249,
        itemName: "Silver Edge (Break)",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/silver_edge.png",
        cost: 5450,
        type: "Hard Counter",
        howToCounter: "Attacking out of Shadow Walk applies BREAK for 5.0 seconds, disabling passive evasion abilities like Phantom Assassin Blur and Bristleback.",
      },
      {
        itemId: 245,
        itemName: "Bloodthorn",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/bloodthorn.png",
        cost: 6800,
        type: "Hard Counter",
        howToCounter: "Soul Rend silences the target and causes ALL allied attacks on that target to have True Strike (cannot miss) + 60 bonus magic damage per hit.",
      },
      {
        itemId: 267,
        itemName: "Mage Slayer / Gleipnir",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/gungir.png",
        cost: 5650,
        type: "Soft Counter",
        howToCounter: "Chain lightning procs and magical area-of-effect roots bypass physical evasion completely.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Viper", ability: "Nethertoxin", tip: "Creates a pool that applies Break, disabling all passive evasion." },
      { hero: "Lion / Lina", ability: "Finger / Laguna", tip: "Spells and magical nukes are completely unaffected by evasion." },
      { hero: "Doom", ability: "Doom (with Aghanim's Scepter)", tip: "Applies Mute, Silence, and Break, turning off Butterfly and passives." },
    ],
    proTip: "Check enemy inventory before buying MKB: if their evasion comes from a PASSIVE skill (PA Blur), Silver Edge breaks it. If it comes from an ITEM (Butterfly), buy MKB or Bloodthorn.",
  },
  {
    id: "high-hp-regen-lifesteal",
    threatTitle: "Heart of Tarrasque, Satanic & High HP Regen / Lifesteal",
    category: "regen",
    enemyItemOrThreat: {
      name: "Heart of Tarrasque",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/heart.png",
      description: "Massive health pool + 1.6% max HP regeneration per second. Amplified by Satanic unholy lifesteal or Morphling/Alchemist.",
    },
    whyItIsDangerous:
      "Tanks and high-sustain carries regenerate hundreds of HP per second in combat, rendering sustained damage meaningless unless anti-heal is applied.",
    counterItems: [
      {
        itemId: 267,
        itemName: "Spirit Vessel",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/spirit_vessel.png",
        cost: 2980,
        type: "Hard Counter",
        howToCounter: "Reduces enemy HP regen, healing, and lifesteal by 45%! Deals 4% of target's current HP as damage per second. Melts Morphling and Pudge.",
      },
      {
        itemId: 160,
        itemName: "Eye of Skadi",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/skadi.png",
        cost: 5300,
        type: "Hard Counter",
        howToCounter: "Cold Attack reduces enemy health regeneration, healing, and lifesteal by 40% on hit (melee & ranged) while slowing attack/move speed.",
      },
      {
        itemId: 119,
        itemName: "Shiva's Guard",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/shivas_guard.png",
        cost: 5175,
        type: "Soft Counter",
        howToCounter: "Aura reduces enemy health regen and lifesteal by 25% in a 1200 radius, and active Arctic Blast deals AoE damage + 45 attack speed slow.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Ancient Apparition", ability: "Ice Blast", tip: "Global ultimate that REDUCES HEALING TO 0% (total anti-heal) and shatters low-health targets." },
      { hero: "Necrophos", ability: "Reaper's Scythe", tip: "Executes targets based on missing health; counters tanks once brought to 40% HP." },
      { hero: "Doom", ability: "Doom", tip: "Prevents items and inflicts continuous pure damage that outpaces regeneration." },
    ],
    proTip: "If playing against Morphling, Alchemist, Bristleback, or Necrophos, one person on your team MUST rush Spirit Vessel before the 15-minute mark.",
  },
  {
    id: "linkens-spell-block",
    threatTitle: "Linken's Sphere (Targeted Spell Block Shield)",
    category: "defense",
    enemyItemOrThreat: {
      name: "Linken's Sphere",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/sphere.png",
      description: "Passively blocks a single-target spell every 14 seconds (can also be cast on allies as a protective bubble).",
    },
    whyItIsDangerous:
      "Blocks fight-deciding single-target ultimates like Doom, Legion Commander Duel, Batrider Flaming Lasso, or Bane Fiend's Grip.",
    counterItems: [
      {
        itemId: 102,
        itemName: "Force Staff / Hurricane Pike",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/force_staff.png",
        cost: 2200,
        type: "Pro Positioning",
        howToCounter: "Force Staff is an offensive targeted item! Cast Force Staff onto the enemy hero: it pops their Linken's shield at long range so your carry can land the lethal spell.",
      },
      {
        itemId: 100,
        itemName: "Heaven's Halberd",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/heavens_halberd.png",
        cost: 3550,
        type: "Soft Counter",
        howToCounter: "Targeted active disarm with long range that can be used to pop Linken's safely.",
      },
      {
        itemId: 196,
        itemName: "Diffusal Blade / Disperser",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/diffusal_blade.png",
        cost: 2500,
        type: "Soft Counter",
        howToCounter: "Inexpensive, low-cooldown target slow that strips the Linken's bubble instantly.",
      },
      {
        itemId: 36,
        itemName: "Eul's Scepter of Divinity",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/cyclone.png",
        cost: 2625,
        type: "Soft Counter",
        howToCounter: "Cast on the enemy to pop Linken's. When they land, your main disables are ready to chain.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Bounty Hunter", ability: "Track", tip: "4-second cooldown targeted spell that removes Linken's from extreme range." },
      { hero: "Phantom Assassin", ability: "Stifling Dagger", tip: "Spam dagger from 1200 range to break their shield before jumping in." },
      { hero: "Ogre Magi", ability: "Ignite", tip: "Cheap targeted spell with multi-target multicast." },
    ],
    proTip: "Never initiate with your primary ultimate on a hero with a floating white orb above them. Communicate: 'Support, pop their Linken's, I will Doom them!'.",
  },
  {
    id: "invisibility-sneak-ganks",
    threatTitle: "Shadow Blade, Silver Edge, Glimmer & Invisible Heroes",
    category: "defense",
    enemyItemOrThreat: {
      name: "Shadow Blade",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/invis_sword.png",
      description: "Grants invisibility and +20% movement speed for 14 seconds. Attacking breaks invis for +175 bonus physical damage.",
    },
    whyItIsDangerous:
      "Allows heroes (Riki, Clinkz, Nyx, Shadow Blade carries) to flank your backline, escape bad trades, or scout objectives undetected.",
    counterItems: [
      {
        itemId: 40,
        itemName: "Dust of Appearance",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/dust.png",
        cost: 80,
        type: "Hard Counter",
        howToCounter: "Reveals all invisible units in a 1050 area for 12 seconds and slows them by 20% (preventing haste escapes). Keep 1 charge on every core and support.",
      },
      {
        itemId: 43,
        itemName: "Sentry Ward",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/ward_sentry.png",
        cost: 50,
        type: "Hard Counter",
        howToCounter: "Provides 1000 True Sight radius for 7 minutes. Place around high-ground choke points, Roshan pit, and mid lane.",
      },
      {
        itemId: 30,
        itemName: "Gem of True Sight",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/gem.png",
        cost: 900,
        type: "Hard Counter",
        howToCounter: "Permanent mobile True Sight aura. Drops on death, so carry it on your tankiest frontline hero (e.g. Centaur, Tidehunter, Medusa).",
      },
    ],
    counterHeroAbilities: [
      { hero: "Slardar", ability: "Corrosive Haze", tip: "Applies True Sight and strips massive physical armor for 25 seconds." },
      { hero: "Bounty Hunter", ability: "Track", tip: "Provides True Sight, movement speed boost, and bonus gold upon kill." },
      { hero: "Zeus", ability: "Lightning Bolt / Thundergod's Wrath", tip: "Reveals a 750 radius of True Sight around the target or strike location." },
    ],
    proTip: "Invisibility does not mean invulnerability. If an enemy buys Shadow Blade, spending 80 gold on Dust will turn their 3,000-gold item into a death trap.",
  },
  {
    id: "illusion-armies",
    threatTitle: "Illusion Swarms (Phantom Lancer, Naga Siren, Chaos Knight, Manta)",
    category: "illusions",
    enemyItemOrThreat: {
      name: "Manta Style",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/manta.png",
      description: "Creates 2 illusions that deal damage and dispels negative effects. Amplified on illusion heroes who create 8+ duplicates.",
    },
    whyItIsDangerous:
      "Overwhelms single-target spellcasters, burns mana, tanks tower shots, and confuses targeting in chaotic teamfights.",
    counterItems: [
      {
        itemId: 24,
        itemName: "Maelstrom / Mjollnir",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/mjollnir.png",
        cost: 5500,
        type: "Hard Counter",
        howToCounter: "Chain lightning bounces through all illusions. Mjollnir Static Charge active retaliates with lightning shocks whenever illusions hit you.",
      },
      {
        itemId: 145,
        itemName: "Battle Fury",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/bfury.png",
        cost: 4100,
        type: "Hard Counter",
        howToCounter: "Cleave damage deals 70% physical splash damage to all units behind the primary target, instantly vaporizing illusion swarms.",
      },
      {
        itemId: 137,
        itemName: "Radiance",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/radiance.png",
        cost: 4700,
        type: "Soft Counter",
        howToCounter: "Burns all illusions within 700 radius for 60 magic damage per second, and causes illusions to miss 15% of their attacks.",
      },
      {
        itemId: 119,
        itemName: "Shiva's Guard",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/shivas_guard.png",
        cost: 5175,
        type: "Soft Counter",
        howToCounter: "Arctic Blast expands 900 radius, dealing 200 magic damage, slowing attack speed by 45, and giving you +16 armor against their physical attacks.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Earthshaker", ability: "Echo Slam", tip: "Deals additional damage for EVERY unit in the area. An illusion army amplifies Echo Slam into a team wipe." },
      { hero: "Leshrac", ability: "Pulse Nova", tip: "Continuous AoE magic explosions melt illusions immediately." },
      { hero: "Lion", ability: "Mana Drain (Shard/Talent)", tip: "Instantly destroys any non-strong illusion upon contact." },
    ],
    proTip: "Look at the enemy health bars when fighting illusions: the REAL hero takes less damage and deals more damage. Illusion items like Maelstrom or Radiance make spotting the real hero easy.",
  },
  {
    id: "heavy-physical-right-click",
    threatTitle: "Heavy Physical Right-Click Carries (Sven, Ursa, PA, Troll)",
    category: "physical",
    enemyItemOrThreat: {
      name: "Daedalus",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/greater_crit.png",
      description: "Grants +88 attack damage and a 30% chance for a devastating 225% critical strike.",
    },
    whyItIsDangerous:
      "Can kill squishy supports in 1–2 hits and shred through under-armored cores during Black King Bar or stun durations.",
    counterItems: [
      {
        itemId: 100,
        itemName: "Heaven's Halberd",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/heavens_halberd.png",
        cost: 3550,
        type: "Hard Counter",
        howToCounter: "Disarms melee carries for 3.0 seconds and ranged carries for 5.0 seconds. They cannot attack at all! (Cannot be dispelled by BKB if applied first).",
      },
      {
        itemId: 127,
        itemName: "Blade Mail",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/blade_mail.png",
        cost: 2100,
        type: "Hard Counter",
        howToCounter: "Reflects 100% of damage taken back to the attacker. If Sven or PA crits you for 1200 damage, they take 1200 damage straight back.",
      },
      {
        itemId: 242,
        itemName: "Crimson Guard",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/crimson_guard.png",
        cost: 3725,
        type: "Soft Counter",
        howToCounter: "Grants all nearby allies a barrier that blocks up to 75 physical damage per attack instance plus a damage shield based on the caster's max HP.",
      },
      {
        itemId: 114,
        itemName: "Assault Cuirass",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/assault.png",
        cost: 5125,
        type: "Soft Counter",
        howToCounter: "Grants +10 armor to yourself, +5 armor aura to all allies, and strips -5 armor from enemy heroes.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Winter Wyvern", ability: "Winter's Curse", tip: "Forces their ultra-farmed carry to attack and instantly kill their own teammates!" },
      { hero: "Razor", ability: "Static Link", tip: "Steals up to 220 attack damage from the enemy carry and gives it to Razor." },
      { hero: "Bane", ability: "Enfeeble", tip: "Reduces enemy attack damage by up to 70% and casts range." },
    ],
    proTip: "Armor has diminishing returns after 30 armor. If you are dying to physical crits, pair armor with evasion (Halberd / Solar Crest) or raw health (Heart / Skadi).",
  },
  {
    id: "heavy-magic-burst",
    threatTitle: "Heavy Magic Burst Nukers (Zeus, Lina, Skywrath, Tinker)",
    category: "magic",
    enemyItemOrThreat: {
      name: "Ethereal Blade / Dagon",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/ethereal_blade.png",
      description: "Combines magic damage amplification, slow, and instant 800+ magic damage nukes to erase heroes in 0.5 seconds.",
    },
    whyItIsDangerous:
      "Can delete heroes from fog of war or 100-to-0 cores before they have time to press BKB, Satanic, or defensive abilities.",
    counterItems: [
      {
        itemId: 90,
        itemName: "Pipe of Insight",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/pipe.png",
        cost: 3375,
        type: "Hard Counter",
        howToCounter: "Barrier absorbs 450 magic damage on all nearby teammates and gives a passive +10% magic resistance aura.",
      },
      {
        itemId: 269,
        itemName: "Mage Slayer",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/mage_slayer.png",
        cost: 2625,
        type: "Hard Counter",
        howToCounter: "Every attack places a debuff that REDUCES the target's total spell damage output by 35% for 6 seconds! Destroys Leshrac and Storm Spirit.",
      },
      {
        itemId: 271,
        itemName: "Eternal Shroud",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/eternal_shroud.png",
        cost: 3600,
        type: "Hard Counter",
        howToCounter: "Converts 25% of incoming spell damage directly into mana, while stacking up to +34% magic resistance. Makes tanks nearly immune to magic.",
      },
      {
        itemId: 254,
        itemName: "Glimmer Cape",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/glimmer_cape.png",
        cost: 2150,
        type: "Soft Counter",
        howToCounter: "Grants 300 magic damage absorption shield + invisibility + 40 bonus movement speed. Essential support save item.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Anti-Mage", ability: "Counterspell", tip: "Grants 65% passive magic resistance and reflects targeted magic nukes right back at the caster." },
      { hero: "Pugna", ability: "Nether Ward", tip: "Zaps magic casters with damage proportional to the mana spent on their spells." },
      { hero: "Silencer", ability: "Global Silence", tip: "Instantly mutes the entire enemy team from across the map, preventing spell combos." },
    ],
    proTip: "Mage Slayer is one of the most cost-effective items in Dota 2. Buying it on agility or universal offlaners can single-handedly shut down magical midlaners.",
  },
  {
    id: "silences-and-roots",
    threatTitle: "Orchid, Bloodthorn, Rod of Atos & Disabling Debuffs",
    category: "cc",
    enemyItemOrThreat: {
      name: "Orchid Malevolence",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/orchid.png",
      description: "Silences the target for 5 seconds and inflicts 30% of all damage taken during the silence as a bonus burst at the end.",
    },
    whyItIsDangerous:
      "Shuts down elusive escape heroes (Storm Spirit, Queen of Pain, Weaver, Ember) who rely on instant spells to escape death.",
    counterItems: [
      {
        itemId: 147,
        itemName: "Manta Style",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/manta.png",
        cost: 4600,
        type: "Hard Counter",
        howToCounter: "Activating Manta Style performs an instant Basic Dispel, removing silences, roots, and slows immediately while disjointing projectiles.",
      },
      {
        itemId: 226,
        itemName: "Lotus Orb",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/lotus_orb.png",
        cost: 3850,
        type: "Hard Counter",
        howToCounter: "Applies an instant Basic Dispel to yourself OR an ally, removing Orchid, Atos, and slows, while echoing incoming spells back to the attacker.",
      },
      {
        itemId: 36,
        itemName: "Eul's Scepter of Divinity",
        itemImg: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/cyclone.png",
        cost: 2625,
        type: "Hard Counter",
        howToCounter: "Self-cyclone dispels Orchid and Atos, granting 2.5 seconds of total invulnerability.",
      },
    ],
    counterHeroAbilities: [
      { hero: "Abaddon", ability: "Aphotic Shield", tip: "Strong Dispel on a low cooldown that removes stuns, silences, and roots from allies." },
      { hero: "Legion Commander", ability: "Press the Attack", tip: "Strong Dispel + massive HP regen and movement speed buff." },
      { hero: "Slark", ability: "Dark Pact", tip: "Pulses 10 mini strong dispels, purging Orchid within 0.1 seconds of application." },
    ],
    proTip: "If you are playing an elusive mid hero and the enemy Clinkz or Storm is building Orchid, do not wait until they kill you: start building your Manta, Eul's, or BKB immediately.",
  },
];

export const DISPEL_RULES_DATA: DispelRule[] = [
  {
    type: "Basic Dispel",
    description:
      "Removes standard negative status effects such as Silences, Roots, Slows, and item debuffs (Orchid, Diffusal, Atos). CANNOT remove hard Stuns, Hexes, or Taunts.",
    removes: ["Silences (Orchid, Bloodthorn, Drow Silence)", "Roots (Rod of Atos, Frostbite)", "Slows & Blind effects", "Tracking buffs (Track, Corrosive Haze)"],
    cannotRemove: ["Stuns (Magic Missile, Fissure, Storm Hammer)", "Hex (Lion Hex, Scythe of Vyse)", "Taunt (Axe Call, Duel)", "Break", "Doom"],
    sources: [
      { name: "Manta Style", isItem: true, costOrHero: "4,600g" },
      { name: "Lotus Orb", isItem: true, costOrHero: "3,850g" },
      { name: "Eul's Scepter", isItem: true, costOrHero: "2,625g" },
      { name: "Guardian Greaves", isItem: true, costOrHero: "5,000g" },
      { name: "Black King Bar (On Cast)", isItem: true, costOrHero: "4,050g" },
      { name: "Satanic (On Cast)", isItem: true, costOrHero: "5,050g" },
    ],
  },
  {
    type: "Strong Dispel",
    description:
      "The highest tier of in-game purge. Capable of REMOVING HARD STUNS, Sleep, Taunts, and nearly all basic and advanced crowd control effects from disabled allies.",
    removes: [
      "ALL Stuns (e.g. Beastmaster Roar, Sven Hammer)",
      "Sleep (Naga Song, Bane Nightmare)",
      "All Silences & Roots",
      "Most non-permanent debuffs",
    ],
    cannotRemove: ["Disruptor Static Storm (with Aghanim's)", "Doom", "Faceless Void Chronosphere", "Enigma Black Hole", "Bane Fiend's Grip"],
    sources: [
      { name: "Abaddon (Aphotic Shield)", isItem: false, costOrHero: "Hero Skill" },
      { name: "Legion Commander (Press the Attack)", isItem: false, costOrHero: "Hero Skill" },
      { name: "Slark (Dark Pact)", isItem: false, costOrHero: "Hero Skill (Self only)" },
      { name: "Oracle (False Promise)", isItem: false, costOrHero: "Hero Ultimate" },
      { name: "Ursa (Enrage with Shard)", isItem: false, costOrHero: "Hero Skill" },
      { name: "Aeon Disk (Auto Trigger)", isItem: true, costOrHero: "3,000g" },
    ],
  },
  {
    type: "Undispellable",
    description:
      "Status effects so powerful that even a Strong Dispel cannot cleanse them. Only expiration of the duration or hero death will end the effect.",
    removes: [],
    cannotRemove: [
      "Doom (Mute, Silence & Damage)",
      "Ancient Apparition (Ice Blast 100% Anti-Heal)",
      "Faceless Void (Chronosphere Time Lock)",
      "Legion Commander (Duel Lockdown)",
      "Necrophos (Reaper's Scythe Stun)",
    ],
    sources: [
      { name: "Doom (Doom)", isItem: false, costOrHero: "Ultimate" },
      { name: "Ancient Apparition (Ice Blast)", isItem: false, costOrHero: "Ultimate" },
      { name: "Silencer (Last Word with Scepter)", isItem: false, costOrHero: "Skill" },
      { name: "Axe (Culling Blade)", isItem: false, costOrHero: "Instant Execution" },
    ],
  },
];

export const DISABLE_TYPES_DATA: DisableType[] = [
  {
    name: "Stun",
    shortDesc: "Complete incapacitation. The affected unit cannot move, attack, cast spells, or use items.",
    preventsActions: ["Moving", "Attacking", "Casting Spells", "Using Items", "Channeling"],
    allowsActions: ["Passive abilities (unless broken)"],
    dispelRequired: "Strong Dispel",
    exampleAbility: "Sven Storm Hammer, Dragon Knight Dragon Tail",
    iconicItem: "Abyssal Blade, Skull Basher",
  },
  {
    name: "Hex",
    shortDesc: "Transforms the unit into a critter. Mutes items, silences spells, disables evasion, and caps move speed at 140.",
    preventsActions: ["Moving at normal speed", "Attacking", "Casting Spells", "Using Items", "Evasion"],
    allowsActions: ["Turning, slow movement"],
    dispelRequired: "Strong Dispel",
    exampleAbility: "Shadow Shaman Hex, Lion Hex",
    iconicItem: "Scythe of Vyse (Guinsoo)",
  },
  {
    name: "Silence",
    shortDesc: "Prevents casting any active spells or abilities. Items and basic attacks remain fully functional.",
    preventsActions: ["Casting Spells", "Channeling Spells"],
    allowsActions: ["Moving", "Attacking", "Using Items (e.g. Manta, BKB, Eul's)"],
    dispelRequired: "Basic Dispel",
    exampleAbility: "Drow Ranger Gust, Silencer Global Silence",
    iconicItem: "Orchid Malevolence, Bloodthorn",
  },
  {
    name: "Root",
    shortDesc: "Immobilizes the target and cancels/prevents all movement-based spells (Blinks, Teleports, Leaps).",
    preventsActions: ["Moving", "Blink spells (Anti-Mage, Queen of Pain)", "Town Portal Scroll / Boots of Travel"],
    allowsActions: ["Attacking (within range)", "Casting non-movement spells", "Using items (except TP)"],
    dispelRequired: "Basic Dispel",
    exampleAbility: "Crystal Maiden Frostbite, Treant Overgrowth",
    iconicItem: "Rod of Atos, Gleipnir",
  },
  {
    name: "Break",
    shortDesc: "Completely disables passive skills and innate passive benefits for the duration.",
    preventsActions: ["Passive abilities (PA Blur, Bristleback Spine, Spectre Dispersion, Huskar Blood)"],
    allowsActions: ["Moving", "Attacking", "Casting active spells", "Using items"],
    dispelRequired: "Basic Dispel",
    exampleAbility: "Viper Nethertoxin, Hoodwink Sharpshooter",
    iconicItem: "Silver Edge",
  },
  {
    name: "Mute",
    shortDesc: "Prevents the activation of all active items in the inventory.",
    preventsActions: ["Activating any item (BKB, Satanic, Manta, Blink, TP)"],
    allowsActions: ["Moving", "Attacking", "Casting Spells", "Passive item stats remain active"],
    dispelRequired: "Basic Dispel",
    exampleAbility: "Disruptor Static Storm (with Scepter), Doom",
    iconicItem: "Nullifier (also dispels continuously)",
  },
  {
    name: "Disarm",
    shortDesc: "Prevents the unit from executing physical basic attacks.",
    preventsActions: ["Physical auto-attacks"],
    allowsActions: ["Moving", "Casting Spells", "Using items"],
    dispelRequired: "Basic Dispel",
    exampleAbility: "Invoker Deafening Blast, Huskar Inner Fire",
    iconicItem: "Heaven's Halberd",
  },
];

export const GAME_TIMINGS_DATA: GameTiming[] = [
  {
    minute: "0:00",
    title: "Initial Bounty Runes & Creep Blocking",
    type: "rune",
    description: "4 Bounty Runes spawn simultaneously at river edge pools. Each provides +40 team gold.",
    impactLevel: "High",
    proExecution: "Contest at least 2 or 3 runes with your team. Mid laners must block creep waves to secure high-ground equilibrium.",
  },
  {
    minute: "2:00 & 4:00",
    title: "River Water Runes",
    type: "rune",
    description: "Two Water Runes spawn in both river spots at 2:00 and 4:00. Each restores 80 HP and 80 Mana, and refills 2 bottle charges.",
    impactLevel: "Critical",
    proExecution: "Midlaners push out the 1:45 wave to gain rune priority. Supports (Pos 4) rotate to secure the opposite water rune.",
  },
  {
    minute: "3:00 & 6:00",
    title: "Bounty Runes (Secondary Cycle)",
    type: "rune",
    description: "Spawns every 3 minutes at the designated Bounty Rune spots near edge camps.",
    impactLevel: "Medium",
    proExecution: "Safe lane and offlane supports should snag the 3-minute rune right before stacking neutral camps.",
  },
  {
    minute: "6:00+",
    title: "First Power Rune (Spawns Every 2 Minutes)",
    type: "rune",
    description: "Randomly spawns in ONE river location (Double Damage, Haste, Invisibility, Arcane, Regeneration, Shield).",
    impactLevel: "Critical",
    proExecution: "Wards should be placed on river high grounds by 5:30. A midlaner with a Haste or Double Damage rune will immediately gank the sidelanes.",
  },
  {
    minute: "7:00, 14:00, 21:00",
    title: "Wisdom Runes (Massive Team XP)",
    type: "objective",
    description: "Spawns at the edge of each team's base perimeter every 7 minutes. Grants massive experience to the lowest level heroes.",
    impactLevel: "Critical",
    proExecution: "Never let the enemy steal your 7:00 Wisdom Rune! Roam at 6:45 to defend your rune or steal the enemy's if they are absent.",
  },
  {
    minute: "10:00",
    title: "Outposts Unlock & Siege Creep Wave",
    type: "creeps",
    description: "Catapult/Siege creeps spawn on both sides. Sidelane Outposts become capturable.",
    impactLevel: "High",
    proExecution: "Group with your team's catapult to knock down Tier 1 safelane towers. Capturing outposts grants teleports and vision control.",
  },
  {
    minute: "20:00",
    title: "Tormentor Spawns",
    type: "objective",
    description: "Spawns at both bases' dedicated Tormentor arenas. Grants an Aghanim's Shard (worth 1400 gold) to the lowest net-worth hero upon death.",
    impactLevel: "Critical",
    proExecution: "Tormentor has a heavy damage reflection shield. 2 or 3 heroes must group together with minus-armor or lifesteal to take it down quickly.",
  },
  {
    minute: "Dynamic (8–11m Respawn)",
    title: "Roshan Cycle & Day/Night Pit Swap",
    type: "objective",
    description: "Roshan swaps pits based on the Day/Night cycle (South/Radiant pit during Day, North/Dire pit during Night). Respawns 8 to 11 minutes after death.",
    impactLevel: "Critical",
    proExecution: "Death 1: Drops Aegis of the Immortal. Death 2: Drops Aegis + Cheese. Death 3+: Drops Aegis, Cheese, Aghanim's Blessing/Shard, and Refresher Shard.",
  },
];
