export interface OpenDotaProfile {
  account_id: number;
  personaname: string | null;
  name: string | null;
  plus: boolean | null;
  cheese: number | null;
  steamid: string | null;
  avatar: string | null;
  avatarmedium: string | null;
  avatarfull: string | null;
  profileurl: string | null;
  last_login: string | null;
  loccountrycode: string | null;
  status: string | null;
  is_contributor?: boolean;
  is_subscriber?: boolean;
}

export interface OpenDotaPlayerResponse {
  tracked_until?: string | null;
  solo_competitive_rank?: number | null;
  competitive_rank?: number | null;
  rank_tier?: number | null;
  leaderboard_rank?: number | null;
  mmr_estimate?: {
    estimate?: number | null;
  };
  profile?: OpenDotaProfile | null;
  error?: string;
}

export interface OpenDotaWinLoss {
  win: number;
  lose: number;
}

export interface OpenDotaRecentMatch {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  hero_id: number;
  start_time: number;
  duration: number;
  game_mode: number;
  lobby_type: number;
  version?: number | null;
  kills: number;
  deaths: number;
  assists: number;
  average_rank?: number | null;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage?: number | null;
  tower_damage?: number | null;
  hero_healing?: number | null;
  last_hits?: number | null;
  lane?: number | null;
  lane_role?: number | null;
  is_roaming?: boolean | null;
  cluster?: number | null;
  leaver_status?: number | null;
  party_size?: number | null;
}

export interface OpenDotaPlayerHero {
  hero_id: number | string;
  last_played: number;
  games: number;
  win: number;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
}

export interface OpenDotaTotal {
  field: string;
  n: number;
  sum: number;
}

export interface HeroInfo {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: "str" | "agi" | "int" | "all" | string;
  img: string;
  icon?: string;
}

export interface EnrichedRecentMatch {
  matchId: number;
  heroId: number;
  heroName: string;
  heroLocalizedName: string;
  heroImageUrl: string;
  isRadiant: boolean;
  isWin: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  durationFormatted: string;
  durationSeconds: number;
  startTime: number;
  timeAgo: string;
  gpm: number;
  xpm: number;
  heroDamage: number;
  towerDamage: number;
  lastHits: number;
  gameModeName: string;
  lobbyTypeName: string;
}

export interface EnrichedHeroStat {
  heroId: number;
  heroName: string;
  heroLocalizedName: string;
  heroImageUrl: string;
  primaryAttr: string;
  games: number;
  win: number;
  loss: number;
  winRate: number;
  lastPlayed: number;
  lastPlayedAgo: string;
}

export interface RankInfo {
  name: string;
  subtext: string;
  color: string;
  medal: string;
  stars?: number;
}

export interface PlayerDashboardData {
  accountId: number;
  steamId64: string | null;
  personaname: string;
  proName: string | null;
  avatarUrl: string;
  profileUrl: string | null;
  countryCode: string | null;
  rankTier: number | null;
  leaderboardRank: number | null;
  rankFormatted: RankInfo;
  plus: boolean;

  lifetime: {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
  };

  recentSummary: {
    sampleSize: number;
    wins: number;
    losses: number;
    winRate: number;
    avgKills: number;
    avgDeaths: number;
    avgAssists: number;
    kdaRatio: number;
    avgGpm: number;
    avgXpm: number;
    lastMatchTime: number | null;
    lastMatchAgo: string | null;
  };

  lifetimeTotals?: {
    killsAvg: number;
    deathsAvg: number;
    assistsAvg: number;
    kdaRatio: number;
    gpmAvg: number;
    xpmAvg: number;
    sampleSize: number;
  } | null;

  recentMatches: EnrichedRecentMatch[];
  topHeroes: EnrichedHeroStat[];
  allHeroes: EnrichedHeroStat[];

  isPartial: boolean;
  warningMessage?: string;
  fetchedAt: string;
}

export interface ApiErrorResponse {
  error: string;
  statusCode: number;
  details?: string;
}
