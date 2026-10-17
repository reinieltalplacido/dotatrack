import { HeroInfo } from "./types";

export type PrimaryAttrType = "str" | "agi" | "int" | "all";

export interface RankBracketStat {
  bracketId: number;
  bracketName: string;
  picks: number;
  wins: number;
  winRate: number;
}

export interface EnrichedHeroSummary {
  id: number;
  name: string; // e.g. "npc_dota_hero_antimage"
  localized_name: string;
  primary_attr: PrimaryAttrType;
  attack_type: "Melee" | "Ranged" | string;
  roles: string[];
  legs: number;
  img: string; // full URL to CDN
  icon: string; // full URL to CDN
  
  // Base combat attributes
  base_health: number;
  base_health_regen: number;
  base_mana: number;
  base_mana_regen: number;
  base_armor: number;
  base_mr: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number;
  move_speed: number;
  turn_rate: number | null;
  cm_enabled: boolean;

  // Pub statistics
  pub_pick: number;
  pub_win: number;
  winRate: number;
  pickRate: number;

  // Pro statistics
  pro_pick: number;
  pro_win: number;
  pro_ban: number;
  proWinRate: number;

  // Turbo statistics
  turbo_picks: number;
  turbo_wins: number;
  turboWinRate: number;

  // Rank Brackets (1: Herald, 2: Guardian, ..., 7: Divine, 8: Immortal)
  brackets: RankBracketStat[];
}

export interface HeroOverviewMetrics {
  totalHeroes: number;
  strongestHero: {
    id: number;
    name: string;
    localized_name: string;
    winRate: number;
    picks: number;
    wins: number;
    img: string;
    primary_attr: PrimaryAttrType;
  } | null;
  mostPickedHero: {
    id: number;
    name: string;
    localized_name: string;
    pickRate: number;
    picks: number;
    winRate: number;
    img: string;
    primary_attr: PrimaryAttrType;
  } | null;
  mostBannedHero: {
    id: number;
    name: string;
    localized_name: string;
    bans: number;
    img: string;
    primary_attr: PrimaryAttrType;
  } | null;
  totalPubMatches: number;
  totalPubPicks: number;
  lastUpdated: string;
  source: string;
  isCachedFallback?: boolean;
}

export interface HeroCompendiumPayload {
  heroes: EnrichedHeroSummary[];
  metrics: HeroOverviewMetrics;
  fetchedAt: string;
  isCached: boolean;
  errorWarning?: string;
}

export interface HeroMatchup {
  hero_id: number;
  games_played: number;
  wins: number;
  winRate: number;
  opponentHero: HeroInfo;
}

export interface PopularItemDetail {
  id: number;
  name: string;
  img: string;
  cost?: number | null;
  count: number;
}

export interface HeroItemPopularityPhased {
  startGame: PopularItemDetail[];
  earlyGame: PopularItemDetail[];
  midGame: PopularItemDetail[];
  lateGame: PopularItemDetail[];
}

export interface HeroDetailDeepDive {
  hero: EnrichedHeroSummary;
  bestMatchups: HeroMatchup[];
  worstMatchups: HeroMatchup[];
  itemPopularity: HeroItemPopularityPhased | null;
  fetchedAt: string;
}
