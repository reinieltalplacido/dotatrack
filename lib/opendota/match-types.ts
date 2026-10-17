import { PrimaryAttrType } from "./hero-types";

export interface MatchPlayerItem {
  id: number;
  name: string;
  img: string;
  cost?: number | null;
}

export interface MatchPlayerPurchaseEvent {
  time: number; // in seconds (can be negative for starting items)
  timeFormatted: string; // e.g. "-01:27" or "14:20"
  key: string;
  name: string;
  img: string;
  cost?: number;
  isStartingItem: boolean;
}

export interface MatchPlayerAbilityUpgrade {
  level: number;
  time?: number;
  abilityId: number;
  abilityName: string;
  img: string;
  isTalent: boolean;
}

export interface MatchPlayerDetailed {
  playerSlot: number;
  accountId: number | null;
  personaName: string;
  isRadiant: boolean;
  heroId: number;
  heroName: string;
  heroLocalizedName: string;
  heroImg: string;
  heroIcon: string;
  primaryAttr: PrimaryAttrType;
  
  // Combat stats
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  level: number;
  
  // Economy & Farm
  lastHits: number;
  denies: number;
  goldPerMin: number;
  xpPerMin: number;
  netWorth: number;
  goldSpent: number;

  // Damage & Utility
  heroDamage: number;
  towerDamage: number;
  heroHealing: number;
  damageShare: number; // percentage of team total
  killParticipation: number; // percentage of team total kills
  goldShare: number; // percentage of team total net worth

  // Items
  items: (MatchPlayerItem | null)[];
  backpack: (MatchPlayerItem | null)[];
  neutralItem: MatchPlayerItem | null;
  hasAghsScepter: boolean;
  hasAghsShard: boolean;
  hasMoonshard: boolean;

  // Laning telemetry
  lane: number | null; // 1: bot, 2: mid, 3: top
  laneRole: number | null; // 1: core/safe, 2: mid, 3: offlane, 4: support, 5: hard support
  laneName: string;
  laneDescription: string; // e.g. "Bottom (Safe)", "Top (Off)", "Top (Safe)", "Bottom (Off)", "Middle"
  laneOutcome: "Won" | "Lost" | "Drew" | "Unavailable";
  roleName: "Carry" | "Support" | "Offlane" | "Mid" | "Roaming";
  isRoaming: boolean;
  lhAt5: number | null;
  lhAt10: number | null;
  lhAt15: number | null;
  netWorthAt5: number | null;
  netWorthAt10: number | null;
  netWorthAt15: number | null;
  earlyDeaths: number; // deaths before 10 min
  networthTimeline: number[]; // minute by minute net worth [m0, m1, m2...]
  lhTimeline: number[]; // minute by minute last hits

  // Advanced parsed logs
  purchaseLog: MatchPlayerPurchaseEvent[];
  abilityUpgrades: MatchPlayerAbilityUpgrade[];
  stunsDuration: number;
  obsPlaced: number;
  senPlaced: number;
  campsStacked: number;
  pings?: number;
}

export interface MatchLanePairing {
  laneName: string;
  mapLocation: string; // e.g. "Bottom Lane", "Top Lane", "Middle Lane"
  radiantRoleLabel: string; // e.g. "Radiant Safelane (Carry + Support)"
  direRoleLabel: string; // e.g. "Dire Offlane (Offlaner + Support)"
  radiantPlayers: MatchPlayerDetailed[];
  direPlayers: MatchPlayerDetailed[];
  verdict: "Radiant Favored" | "Dire Favored" | "Even" | "Unavailable";
  netWorthDiffAt10: number | null; // Positive = Radiant ahead
  lhDiffAt10: number | null; // Positive = Radiant ahead
  reason: string;
}

export interface MatchKillEvent {
  time: number;
  timeFormatted: string;
  killerHeroId?: number;
  killerName?: string;
  killerImg?: string;
  killerIsRadiant?: boolean;
  victimHeroId: number;
  victimName: string;
  victimImg: string;
  victimIsRadiant: boolean;
  assists: {
    heroId: number;
    name: string;
    img: string;
  }[];
}

export interface MatchTeamfight {
  fightId: number;
  startTime: number;
  endTime: number;
  startFormatted: string;
  endFormatted: string;
  durationSeconds: number;
  deaths: {
    heroId: number;
    name: string;
    img: string;
    isRadiant: boolean;
  }[];
  radiantDeaths: number;
  direDeaths: number;
  goldDelta: number; // positive = radiant gained
  xpDelta: number; // positive = radiant gained
  outcome: "Radiant Victory" | "Dire Victory" | "Even Trade";
}

export interface MatchObjectiveEvent {
  time: number;
  timeFormatted: string;
  type: "tower" | "barracks" | "roshan" | "aegis" | "tormentor" | "other";
  description: string;
  team: "Radiant" | "Dire" | "Neutral";
  playerSlot?: number;
  unit?: string;
}

export interface NormalizedMatchData {
  matchId: string;
  startTime: number;
  startTimeFormatted: string;
  durationSeconds: number;
  durationFormatted: string;
  radiantWin: boolean;
  radiantScore: number;
  direScore: number;
  gameMode: string;
  lobbyType: string;
  region: string;
  patch: string;
  skillBracket: string;
  isParsed: boolean;
  replayUrl?: string | null;

  // Teams
  radiantTeamName: string;
  direTeamName: string;
  radiantTeamTotalNetWorth: number;
  direTeamTotalNetWorth: number;
  radiantTeamTotalDamage: number;
  direTeamTotalDamage: number;

  // Players
  radiantPlayers: MatchPlayerDetailed[];
  direPlayers: MatchPlayerDetailed[];
  allPlayers: MatchPlayerDetailed[];

  // Analysis sections (available when parsed)
  lanePairings: MatchLanePairing[];
  killEvents: MatchKillEvent[];
  teamfights: MatchTeamfight[];
  objectives: MatchObjectiveEvent[];
  
  // Time-series advantage
  goldAdvantageTimeline: { minute: number; advantage: number }[]; // Positive = Radiant
  xpAdvantageTimeline: { minute: number; advantage: number }[]; // Positive = Radiant
}
