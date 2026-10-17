import { PrimaryAttrType } from "./hero-types";
export type { PrimaryAttrType };

export type MetaRankBracket = "all" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export interface RankBracketDefinition {
  id: MetaRankBracket;
  numericId: number;
  name: string;
  badge: string;
  description: string;
  isAvailable: boolean;
  unavailabilityNotice?: string;
}

export type HeroTierCategory = "S" | "A" | "B" | "C" | "D";

export interface MetaHeroEntry {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: PrimaryAttrType;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  
  // Statistical performance in active filter
  picks: number;
  wins: number;
  winRate: number; // e.g. 52.41
  pickRate: number; // e.g. 14.85
  banCount?: number; // pro bans if pro mode
  
  // Normalized Bayesian confidence score (0 - 100)
  bayesianWinRate: number;
  metaScore: number;
  tier: HeroTierCategory;

  // Real 7-interval trend from OpenDota (if available)
  pickTrend: number[];
  winTrend: number[];
  winRateDelta: number | null; // delta over latest recorded intervals
  pickRateDelta: number | null;
}

export interface MetaOverviewStats {
  totalMatches: number;
  totalPicks: number;
  activeHeroesCount: number;
  selectedBracketName: string;
  selectedBracketId: MetaRankBracket;
  highestWinRateHero: {
    id: number;
    name: string;
    localized_name: string;
    winRate: number;
    picks: number;
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
  averageWinRate: number;
  averagePickRate: number;
  lastUpdated: string;
  source: string;
  isCached: boolean;
}

export interface PatchInfo {
  id: number;
  name: string;
  date: string;
  officialUrl: string;
}

export interface HistoricalMetaSnapshot {
  snapshotId: string;
  timestamp: string;
  patchVersion: string;
  totalPubMatches: number;
  heroMetrics: Record<
    number,
    {
      picks: number;
      wins: number;
      winRate: number;
      pickRate: number;
    }
  >;
}

export interface MetaTrendsPayload {
  overview: MetaOverviewStats;
  heroes: MetaHeroEntry[];
  availableBrackets: RankBracketDefinition[];
  currentPatch: PatchInfo;
  historicalSnapshotsCount: number;
  snapshotCollectionStartedAt: string;
  isSnapshotDeltaAvailable: boolean;
  deltaPeriodLabel: string;
  fetchedAt: string;
  isCached: boolean;
  errorNotice?: string;
}
