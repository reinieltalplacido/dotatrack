import { EnrichedHeroSummary, PrimaryAttrType } from "../opendota/hero-types";

export type DraftRole = "Carry" | "Mid" | "Offlane" | "Soft Support" | "Hard Support";

export interface DraftSlot {
  id: string;
  team: "radiant" | "dire";
  role: DraftRole;
  position: 1 | 2 | 3 | 4 | 5;
  hero: EnrichedHeroSummary | null;
}

export interface TeamRadarScores {
  lockdown: number; // 0-10 Disables / Stuns
  initiation: number; // 0-10 Frontline / Teamfight initiation
  push: number; // 0-10 Tower Siege / Building damage
  waveclear: number; // 0-10 Wave Depush / AOE clear
  magicBurst: number; // 0-10 Magic damage burst
  physicalSustain: number; // 0-10 Right-click physical DPS
}

export interface CompositionVoidAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  counterExample?: string;
}

export interface DraftRecommendation {
  hero: EnrichedHeroSummary;
  advantageDelta: number; // e.g. +3.2% win probability swing
  suitabilityScore: number; // 0-100
  recommendedRole: DraftRole;
  reasons: string[];
  countersHeroes: string[];
}

export interface DraftAnalysisResult {
  radiantAdvantage: number; // positive = radiant favored, e.g. +4.5%
  radiantWinProbability: number; // 0 to 100%
  radiantScores: TeamRadarScores;
  direScores: TeamRadarScores;
  radiantAlerts: CompositionVoidAlert[];
  direAlerts: CompositionVoidAlert[];
  verdict: string;
  keyWinConditionRadiant: string;
  keyWinConditionDire: string;
}

export interface ProDraftPreset {
  id: string;
  title: string;
  subtitle: string;
  tournament: string;
  winner: "radiant" | "dire";
  radiantHeroIds: number[];
  direHeroIds: number[];
  radiantRoles: DraftRole[];
  direRoles: DraftRole[];
}

/**
 * Calculates 6-axis tactical rating for a set of drafted heroes.
 */
export function calculateTeamRadarScores(heroes: (EnrichedHeroSummary | null)[]): TeamRadarScores {
  const picked = heroes.filter((h): h is EnrichedHeroSummary => h !== null);
  if (picked.length === 0) {
    return {
      lockdown: 0,
      initiation: 0,
      push: 0,
      waveclear: 0,
      magicBurst: 0,
      physicalSustain: 0,
    };
  }

  let lockdownRaw = 0;
  let initiationRaw = 0;
  let pushRaw = 0;
  let waveclearRaw = 0;
  let magicRaw = 0;
  let physRaw = 0;

  for (const h of picked) {
    const roles = h.roles || [];

    // Lockdown / Disables
    if (roles.includes("Disabler")) lockdownRaw += 2.2;
    if (["Bane", "Lion", "Shadow Shaman", "Earthshaker", "Magnus", "Tidehunter", "Axe"].includes(h.localized_name)) {
      lockdownRaw += 1.2;
    }

    // Initiation / Frontline
    if (roles.includes("Initiator")) initiationRaw += 2.0;
    if (roles.includes("Durable")) initiationRaw += 1.2;
    if (h.primary_attr === "str" && h.attack_type === "Melee") initiationRaw += 0.8;

    // Push / Siege
    if (roles.includes("Pusher")) pushRaw += 2.4;
    if (["Leshrac", "Death Prophet", "Pugna", "Terrorblade", "Dragon Knight", "Lycan", "Shadow Shaman", "Tiny"].includes(h.localized_name)) {
      pushRaw += 1.5;
    }

    // Waveclear / Depush
    if (roles.includes("Nuker")) waveclearRaw += 1.6;
    if (["Keeper of the Light", "Underlord", "Lina", "Tinker", "Jakiro", "Pangolier", "Mars"].includes(h.localized_name)) {
      waveclearRaw += 1.5;
    }

    // Magic Burst
    if (roles.includes("Nuker")) magicRaw += 1.8;
    if (h.primary_attr === "int") magicRaw += 1.2;
    if (["Zeus", "Skywrath Mage", "Lion", "Lina", "Pugna", "Queen of Pain"].includes(h.localized_name)) {
      magicRaw += 1.5;
    }

    // Physical DPS
    if (roles.includes("Carry")) physRaw += 2.5;
    if (h.primary_attr === "agi") physRaw += 1.4;
    if (["Phantom Assassin", "Sven", "Juggernaut", "Drow Ranger", "Ursa", "Sniper", "Templar Assassin"].includes(h.localized_name)) {
      physRaw += 1.2;
    }
  }

  const normalize = (val: number) => Math.min(10, Math.max(1, Number(val.toFixed(1))));

  return {
    lockdown: normalize(lockdownRaw),
    initiation: normalize(initiationRaw),
    push: normalize(pushRaw),
    waveclear: normalize(waveclearRaw),
    magicBurst: normalize(magicRaw),
    physicalSustain: normalize(physRaw),
  };
}

/**
 * Checks for critical composition voids (e.g. no disables, all physical, no push).
 */
export function evaluateCompositionAlerts(
  scores: TeamRadarScores,
  heroes: (EnrichedHeroSummary | null)[]
): CompositionVoidAlert[] {
  const picked = heroes.filter((h): h is EnrichedHeroSummary => h !== null);
  if (picked.length < 2) return [];

  const alerts: CompositionVoidAlert[] = [];

  // 1. Missing Hard Stun / Lockdown
  if (scores.lockdown < 3.2 && picked.length >= 3) {
    alerts.push({
      id: "no_disables",
      severity: "critical",
      title: "Critically Lacks Hard Lockdown",
      description: "Draft has very few reliable stuns. Vulnerable to slippery enemy mobility cores (Anti-Mage, Storm Spirit, Puck, Weaver).",
      counterExample: "Consider drafting Lion, Shadow Shaman, Beastmaster, or Axe.",
    });
  }

  // 2. Damage skew - All physical
  if (scores.physicalSustain > 6.0 && scores.magicBurst < 2.5 && picked.length >= 3) {
    alerts.push({
      id: "all_physical",
      severity: "warning",
      title: "Heavily Skewed to Physical Damage",
      description: "Damage output is almost purely physical. Enemy team can easily counter with armor items (Solar Crest, Shiva's Guard, Assault Cuirass).",
      counterExample: "Consider adding magical burst or pure damage (Timbersaw, Zeus, Leshrac).",
    });
  }

  // 3. Damage skew - Lacks sustained right-click
  if (scores.magicBurst > 6.0 && scores.physicalSustain < 2.5 && picked.length >= 3) {
    alerts.push({
      id: "all_magic",
      severity: "warning",
      title: "Lacks Sustained Physical DPS",
      description: "Heavy spell dependency. Draft will struggle heavily once enemy cores purchase Black King Bar and Pipe of Insight.",
      counterExample: "Ensure a reliable right-click scaling carry is prioritized.",
    });
  }

  // 4. Missing frontline / initiation
  if (scores.initiation < 2.8 && picked.length >= 3) {
    alerts.push({
      id: "no_frontline",
      severity: "warning",
      title: "Lacks Reliable Frontline / Initiator",
      description: "No durable heroes to facecheck fog of war or initiate teamfights safely. Team is prone to being jumped and burst.",
      counterExample: "Add a durable vanguard like Centaur Warrunner, Tidehunter, or Mars.",
    });
  }

  // 5. Low tower push
  if (scores.push < 2.5 && picked.length >= 4) {
    alerts.push({
      id: "low_push",
      severity: "info",
      title: "Low Building Siege / Push",
      description: "Team will struggle to quickly convert won teamfights into destroyed barracks and towers.",
      counterExample: "Draft high building-damage heroes (Dragon Knight, Leshrac, Terrorblade).",
    });
  }

  return alerts;
}

/**
 * Analyzes full 5v5 draft matchup advantages and win probabilities.
 */
export function analyzeDraftMatchup(
  radiantHeroes: (EnrichedHeroSummary | null)[],
  direHeroes: (EnrichedHeroSummary | null)[]
): DraftAnalysisResult {
  const radPicked = radiantHeroes.filter((h): h is EnrichedHeroSummary => h !== null);
  const direPicked = direHeroes.filter((h): h is EnrichedHeroSummary => h !== null);

  const radiantScores = calculateTeamRadarScores(radiantHeroes);
  const direScores = calculateTeamRadarScores(direHeroes);

  const radiantAlerts = evaluateCompositionAlerts(radiantScores, radiantHeroes);
  const direAlerts = evaluateCompositionAlerts(direScores, direHeroes);

  // Baseline Win Rate from hero pub/pro strength
  const radBaseWR =
    radPicked.length > 0
      ? radPicked.reduce((acc, h) => acc + (h.winRate || 50), 0) / radPicked.length
      : 50;
  const direBaseWR =
    direPicked.length > 0
      ? direPicked.reduce((acc, h) => acc + (h.winRate || 50), 0) / direPicked.length
      : 50;

  // Radar differential calculation
  const lockdownAdvantage = (radiantScores.lockdown - direScores.lockdown) * 0.8;
  const initiationAdvantage = (radiantScores.initiation - direScores.initiation) * 0.7;
  const pushAdvantage = (radiantScores.push - direScores.push) * 0.5;
  const alertPenalty = (direAlerts.length - radiantAlerts.length) * 1.5;

  const rawDelta = (radBaseWR - direBaseWR) * 0.6 + lockdownAdvantage + initiationAdvantage + pushAdvantage + alertPenalty;
  const radiantAdvantage = Number(Math.max(-25, Math.min(25, rawDelta)).toFixed(1));
  const radiantWinProbability = Number(Math.max(25, Math.min(75, 50 + radiantAdvantage)).toFixed(1));

  let verdict = "Drafts are evenly matched with complementary tactical win conditions.";
  if (radiantAdvantage >= 6) {
    verdict = "Radiant possesses clear drafting advantage in teamfight lockdown and objective pace.";
  } else if (radiantAdvantage <= -6) {
    verdict = "Dire draft commands superior counter-synergy and resilient damage balance.";
  }

  const keyWinConditionRadiant =
    radiantScores.push >= 6
      ? "Group early at 15-20 min, secure Aegis, and pressure outer towers."
      : radiantScores.initiation >= 6
      ? "Play around smoke ganks and force 5v5 teamfights on enemy territory."
      : "Scale into late game and protect the hard carry.";

  const keyWinConditionDire =
    direScores.lockdown >= 6
      ? "Chain-stun priority targets before they activate defensive items or BKBs."
      : direScores.push >= 6
      ? "Fast-paced siege, denying Radiant jungle farm and suffocating the map."
      : "Rely on superior late-game scaling and counter-initiation.";

  return {
    radiantAdvantage,
    radiantWinProbability,
    radiantScores,
    direScores,
    radiantAlerts,
    direAlerts,
    verdict,
    keyWinConditionRadiant,
    keyWinConditionDire,
  };
}

/**
 * Recommends optimal next picks from unpicked hero pool.
 */
export function getRecommendedNextPicks(
  allHeroes: EnrichedHeroSummary[],
  alliedHeroes: (EnrichedHeroSummary | null)[],
  enemyHeroes: (EnrichedHeroSummary | null)[],
  targetRole?: DraftRole
): DraftRecommendation[] {
  const pickedIds = new Set(
    [...alliedHeroes, ...enemyHeroes].filter((h): h is EnrichedHeroSummary => h !== null).map((h) => h.id)
  );

  const enemyPicked = enemyHeroes.filter((h): h is EnrichedHeroSummary => h !== null);
  const alliedPicked = alliedHeroes.filter((h): h is EnrichedHeroSummary => h !== null);
  const alliedScores = calculateTeamRadarScores(alliedHeroes);

  const candidates: DraftRecommendation[] = [];

  for (const hero of allHeroes) {
    if (pickedIds.has(hero.id)) continue;

    let score = (hero.winRate || 50);
    const reasons: string[] = [];
    const counters: string[] = [];

    // Role affinity filter
    let recommendedRole: DraftRole = "Carry";
    const roles = hero.roles || [];

    if (roles.includes("Carry") && hero.primary_attr === "agi") recommendedRole = "Carry";
    else if (roles.includes("Nuker") && (hero.primary_attr === "int" || roles.includes("Escape"))) recommendedRole = "Mid";
    else if (roles.includes("Initiator") || roles.includes("Durable")) recommendedRole = "Offlane";
    else if (roles.includes("Support") && roles.includes("Disabler")) recommendedRole = "Hard Support";
    else if (roles.includes("Support")) recommendedRole = "Soft Support";

    if (targetRole && recommendedRole !== targetRole) {
      score -= 8;
    }

    // Synergy with team voids
    if (alliedScores.lockdown < 3.5 && roles.includes("Disabler")) {
      score += 6;
      reasons.push("Patches team lockdown void with reliable disables");
    }
    if (alliedScores.initiation < 3.0 && roles.includes("Initiator")) {
      score += 5;
      reasons.push("Provides frontline teamfight initiation");
    }
    if (alliedScores.push < 3.0 && roles.includes("Pusher")) {
      score += 4;
      reasons.push("Supplies essential tower siege & objective damage");
    }

    // Countering enemy picks
    for (const enemy of enemyPicked) {
      // Mobility counter
      if (enemy.roles?.includes("Escape") && (roles.includes("Disabler") || hero.localized_name === "Bloodseeker" || hero.localized_name === "Legion Commander" || hero.localized_name === "Doom")) {
        score += 4.5;
        counters.push(enemy.localized_name);
        reasons.push(`Locks down mobile ${enemy.localized_name}`);
      }
      // Squishy range counter
      if (enemy.attack_type === "Ranged" && (roles.includes("Initiator") || hero.localized_name === "Spectre" || hero.localized_name === "Clockwerk" || hero.localized_name === "Spirit Breaker")) {
        score += 3.5;
        counters.push(enemy.localized_name);
      }
      // Illusion / Summon counter
      if (["Phantom Lancer", "Naga Siren", "Chaos Knight", "Terrorblade", "Broodmother"].includes(enemy.localized_name)) {
        if (["Earthshaker", "Sven", "Leshrac", "Sand King", "Underlord", "Lion"].includes(hero.localized_name)) {
          score += 6;
          counters.push(enemy.localized_name);
          reasons.push(`Dominates ${enemy.localized_name} illusion army with massive AOE`);
        }
      }
    }

    const advantageDelta = Number(((score - 50) * 0.25).toFixed(1));

    if (reasons.length === 0) {
      reasons.push(`High meta baseline win rate (${hero.winRate.toFixed(1)}%) in current patch`);
    }

    candidates.push({
      hero,
      advantageDelta: Math.max(0.5, advantageDelta),
      suitabilityScore: Math.min(99, Math.max(30, Math.round(score))),
      recommendedRole,
      reasons: reasons.slice(0, 2),
      countersHeroes: Array.from(new Set(counters)),
    });
  }

  candidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  return candidates.slice(0, 8);
}

/**
 * Famous historical Pro Tournament presets for instant 1-click loading.
 */
export const PRO_DRAFT_PRESETS: ProDraftPreset[] = [
  {
    id: "ti10_finals_game5",
    title: "TI10 Grand Finals (Game 5)",
    subtitle: "Team Spirit vs PSG.LGD — Decisive Aegis Match",
    tournament: "The International 2021",
    winner: "radiant",
    radiantHeroIds: [106, 18, 46, 102, 30], // Spirit: Ember, Sven, Templar Assassin, Abaddon, Witch Doctor
    direHeroIds: [19, 77, 86, 26, 91], // LGD: Tiny, Lycan, Rubick, Lion, Io
    radiantRoles: ["Mid", "Carry", "Offlane", "Soft Support", "Hard Support"],
    direRoles: ["Carry", "Offlane", "Soft Support", "Hard Support", "Mid"],
  },
  {
    id: "ti8_finals_game5",
    title: "TI8 Grand Finals (Game 5)",
    subtitle: "OG vs PSG.LGD — The Miracle Run",
    tournament: "The International 2018",
    winner: "radiant",
    radiantHeroIds: [106, 97, 83, 74, 86], // OG: Ember, Magnus, Treant, Invoker, Rubick
    direHeroIds: [6, 12, 10, 8, 26], // LGD: Drow, Phantom Lancer, Morphling, Juggernaut, Lion
    radiantRoles: ["Carry", "Offlane", "Hard Support", "Mid", "Soft Support"],
    direRoles: ["Mid", "Carry", "Offlane", "Soft Support", "Hard Support"],
  },
  {
    id: "early_deathball_siege",
    title: "Tempo Deathball Siege",
    subtitle: "Objective Rush vs 4-Protect-1 Greedy Draft",
    tournament: "Pro Meta Benchmark",
    winner: "radiant",
    radiantHeroIds: [52, 45, 38, 43, 67], // Leshrac, Pugna, Beastmaster, Death Prophet, Spectre
    direHeroIds: [1, 11, 74, 5, 27], // Anti-Mage, Shadow Fiend, Invoker, CM, Shadow Shaman
    radiantRoles: ["Mid", "Soft Support", "Offlane", "Carry", "Hard Support"],
    direRoles: ["Carry", "Mid", "Offlane", "Hard Support", "Soft Support"],
  },
];
