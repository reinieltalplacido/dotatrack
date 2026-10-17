export type TournamentStatus = "live" | "upcoming" | "completed";
export type TournamentTier = "premium" | "professional" | "amateur";

export interface TournamentSummary {
  id: number;
  name: string;
  tier: TournamentTier;
  status: TournamentStatus;
  startDate: string | null;
  endDate: string | null;
  prizePool: string | null;
  numericPrizePool?: number;
  region: string;
  teamsCount: number;
  matchesCount: number;
  banner: string | null;
  logo: string | null;
  organizer: string;
  officialWebsite?: string;
  isFeatured?: boolean;
  description?: string;
}

export interface TournamentTeam {
  team_id: number;
  name: string;
  tag: string;
  rating: number;
  wins: number;
  losses: number;
  logo_url: string | null;
}

export interface TournamentMatch {
  match_id: number;
  radiant_win: boolean;
  start_time: number;
  duration: number;
  radiant_score: number;
  dire_score: number;
  radiant_team_id: number;
  radiant_team_name: string;
  radiant_team_logo: string | null;
  dire_team_id: number;
  dire_team_name: string;
  dire_team_logo: string | null;
  series_id?: number;
  series_type?: number;
  series_name?: string;
  status: "completed" | "live" | "upcoming";
}

export interface TournamentStanding {
  rank: number;
  team: TournamentTeam;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface TournamentDetail {
  tournament: TournamentSummary;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  standings: TournamentStanding[];
  bracketAvailable: boolean;
  fetchedAt: string;
}

export interface LiveOrRecentProMatch {
  match_id: string | number;
  league_id: number;
  league_name: string;
  is_live: boolean;
  start_time: number;
  game_time?: number;
  radiant_team: {
    id: number;
    name: string;
    tag?: string;
    logo: string | null;
    score: number;
  };
  dire_team: {
    id: number;
    name: string;
    tag?: string;
    logo: string | null;
    score: number;
  };
  radiant_lead?: number;
  spectators?: number;
  radiant_win?: boolean;
  duration?: number;
  series_type?: string;
}

export interface TournamentsCatalogPayload {
  featured: TournamentSummary | null;
  tournaments: TournamentSummary[];
  liveAndRecentMatches: LiveOrRecentProMatch[];
  metrics: {
    totalTournaments: number;
    liveTournamentsCount: number;
    upcomingCount: number;
    completedCount: number;
    liveMatchesCount: number;
  };
  source: string;
  fetchedAt: string;
  isCached: boolean;
}
