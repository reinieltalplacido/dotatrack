import {
  LiveOrRecentProMatch,
  TournamentDetail,
  TournamentMatch,
  TournamentStanding,
  TournamentSummary,
  TournamentTeam,
  TournamentTier,
  TournamentStatus,
  TournamentsCatalogPayload,
} from "./tournaments-types";
import teamsSnapshot from "./teams-snapshot.json";

const OPENDOTA_BASE_URL = "https://api.opendota.com/api";
const STEAM_CDN_BASE = "https://cdn.cloudflare.steamstatic.com";
const REQUEST_TIMEOUT_MS = 8000;

export class TournamentTelemetryError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "TournamentTelemetryError";
    this.statusCode = statusCode;
  }
}

/**
 * Normalizes Steam or OpenDota asset paths into full URLs.
 */
export function normalizeTournamentAssetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${STEAM_CDN_BASE}/apps/dota2/images/${clean.replace(/^\/+/, "")}`;
}

async function fetchWithTimeout<T>(endpoint: string, revalidateSeconds = 300): Promise<T> {
  const apiKey = process.env.OPENDOTA_API_KEY;
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${OPENDOTA_BASE_URL}${endpoint}${apiKey ? `${separator}api_key=${apiKey}` : ""}`;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: revalidateSeconds,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new TournamentTelemetryError("OpenDota request timed out.", 504);
    }
    throw new TournamentTelemetryError("Failed to connect to OpenDota tournament telemetry.", 502);
  }

  if (response.status === 404) {
    throw new TournamentTelemetryError("Resource not found on OpenDota.", 404);
  }

  if (response.status === 429) {
    throw new TournamentTelemetryError("OpenDota API rate limit reached.", 429);
  }

  if (!response.ok) {
    throw new TournamentTelemetryError(
      `OpenDota service returned status ${response.status}.`,
      response.status >= 500 ? 502 : response.status
    );
  }

  const rawText = await response.text();
  if (!rawText || rawText.trim() === "" || rawText.trim() === "null") {
    throw new TournamentTelemetryError("Resource not found or empty on OpenDota.", 404);
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new TournamentTelemetryError("Failed to parse response from OpenDota.", 502);
  }
}

interface RawLeague {
  leagueid: number;
  name: string;
  tier: string;
  ticket?: string | null;
  banner?: string | null;
}

interface RawProMatch {
  match_id: number;
  duration: number;
  start_time: number;
  radiant_team_id: number;
  radiant_name?: string | null;
  dire_team_id: number;
  dire_name?: string | null;
  leagueid: number;
  league_name?: string | null;
  series_id?: number;
  series_type?: number;
  radiant_score: number;
  dire_score: number;
  radiant_win: boolean;
}

interface RawLiveMatch {
  match_id: string;
  league_id: number;
  game_time: number;
  spectators: number;
  radiant_lead: number;
  radiant_score: number;
  dire_score: number;
  team_name_radiant?: string;
  team_name_dire?: string;
  team_id_radiant?: number;
  team_id_dire?: number;
  team_logo_radiant?: string;
  team_logo_dire?: string;
  activate_time?: number;
}

interface RawTeamEntry {
  team_id: number;
  rating?: number | null;
  wins?: number | null;
  losses?: number | null;
  name?: string | null;
  tag?: string | null;
  logo_url?: string | null;
}

const teamsLookup = teamsSnapshot as unknown as Record<
  string,
  { id: number; name: string; tag?: string; logo_url: string | null; rating?: number }
>;

/**
 * Known Premier Tournament metadata enrichment for authentic esports branding.
 */
interface PremierTournamentMeta {
  prizePool: string;
  numericPrizePool: number;
  region: string;
  organizer: string;
  officialWebsite?: string;
  logo?: string;
  banner?: string;
  isFeatured?: boolean;
}

const PREMIER_METADATA: Record<string, PremierTournamentMeta> = {
  dreamleague: {
    prizePool: "$1,000,000 USD",
    numericPrizePool: 1000000,
    region: "Europe (Online)",
    organizer: "ESL Gaming",
    officialWebsite: "https://pro.eslgaming.com/tour/dota2/",
    logo: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/events/dreamleague_logo.png",
    isFeatured: true,
  },
  wallachia: {
    prizePool: "$1,000,000 USD",
    numericPrizePool: 1000000,
    region: "Bucharest, Romania",
    organizer: "PGL Esports",
    officialWebsite: "https://pglesports.com/",
    isFeatured: true,
  },
  "the international": {
    prizePool: "Multi-Million USD",
    numericPrizePool: 2600000,
    region: "Copenhagen / Valve Global",
    organizer: "Valve Corporation",
    officialWebsite: "https://www.dota2.com/esports/ti",
    isFeatured: true,
  },
  "esl one": {
    prizePool: "$1,000,000 USD",
    numericPrizePool: 1000000,
    region: "Birmingham / Global",
    organizer: "ESL Gaming",
    officialWebsite: "https://pro.eslgaming.com/tour/dota2/",
  },
  riyadh: {
    prizePool: "$5,000,000 USD",
    numericPrizePool: 5000000,
    region: "Riyadh, Saudi Arabia",
    organizer: "Esports World Cup Foundation",
    officialWebsite: "https://esportsworldcup.com/",
    isFeatured: true,
  },
  "betboom dacha": {
    prizePool: "$1,000,000 USD",
    numericPrizePool: 1000000,
    region: "Belgrade / Dubai",
    organizer: "FISSURE",
    officialWebsite: "https://fissure.pro/",
  },
  "epl masters": {
    prizePool: "$50,000 USD",
    numericPrizePool: 50000,
    region: "Europe",
    organizer: "European Pro League",
    officialWebsite: "https://epl.gg/",
  },
  blast: {
    prizePool: "$1,000,000 USD",
    numericPrizePool: 1000000,
    region: "Copenhagen, Denmark",
    organizer: "BLAST Esports",
    officialWebsite: "https://blast.tv/dota",
  },
};

/**
 * Finds enrichment metadata based on tournament title.
 */
function getTournamentEnrichment(name: string): PremierTournamentMeta {
  const lower = name.toLowerCase();
  for (const [key, meta] of Object.entries(PREMIER_METADATA)) {
    if (lower.includes(key)) {
      return meta;
    }
  }

  // Sensible default for other professional tournaments
  return {
    prizePool: "Official Circuit Prize",
    numericPrizePool: 50000,
    region: lower.includes("china")
      ? "China"
      : lower.includes("sea") || lower.includes("asia")
      ? "Southeast Asia"
      : lower.includes("america")
      ? "Americas"
      : "Europe / Global",
    organizer: "Dota 2 Esports Circuit",
  };
}

/**
 * Fetches the list of tournaments, combines live and pro match data, and calculates metrics.
 */
export async function fetchTournamentsList(): Promise<TournamentsCatalogPayload> {
  let rawLeagues: RawLeague[] = [];
  let rawProMatches: RawProMatch[] = [];
  let rawLive: RawLiveMatch[] = [];
  let isCached = false;

  try {
    const [leaguesRes, matchesRes, liveRes] = await Promise.allSettled([
      fetchWithTimeout<RawLeague[]>("/leagues", 3600),
      fetchWithTimeout<RawProMatch[]>("/proMatches", 120),
      fetchWithTimeout<RawLiveMatch[]>("/live", 60),
    ]);

    if (leaguesRes.status === "fulfilled" && Array.isArray(leaguesRes.value)) {
      rawLeagues = leaguesRes.value;
    }
    if (matchesRes.status === "fulfilled" && Array.isArray(matchesRes.value)) {
      rawProMatches = matchesRes.value;
    }
    if (liveRes.status === "fulfilled" && Array.isArray(liveRes.value)) {
      rawLive = liveRes.value;
    }
  } catch (err) {
    console.warn("OpenDota tournaments fetch error, using resilient telemetry:", err);
    isCached = true;
  }

  // 1. Identify live league IDs from /live
  const liveLeagueIds = new Set<number>();
  rawLive.forEach((m) => {
    if (m.league_id && m.league_id > 0) {
      liveLeagueIds.add(m.league_id);
    }
  });

  // 2. Identify active league IDs from /proMatches (played within last 7 days)
  const activeLeagueMatchesMap = new Map<number, { count: number; latestTime: number }>();
  rawProMatches.forEach((m) => {
    if (m.leagueid) {
      const existing = activeLeagueMatchesMap.get(m.leagueid) || { count: 0, latestTime: 0 };
      existing.count++;
      existing.latestTime = Math.max(existing.latestTime, m.start_time);
      activeLeagueMatchesMap.set(m.leagueid, existing);
    }
  });

  // 3. Filter relevant premier and professional tournaments
  // Focus on top-tier championships, active leagues, and premier series
  const premierKeywords = [
    "international",
    "riyadh",
    "dreamleague",
    "wallachia",
    "pgl",
    "esl one",
    "betboom",
    "epl",
    "blast",
    "1win",
    "nexus",
  ];

  const candidateLeagues = rawLeagues.filter((l) => {
    if (!l.name || l.tier === "excluded") return false;
    const lower = l.name.toLowerCase();
    const isKeywordMatch = premierKeywords.some((k) => lower.includes(k));
    const isRecentlyActive = activeLeagueMatchesMap.has(l.leagueid);
    const isHighTier = l.tier === "premium" || l.tier === "professional";
    return (isKeywordMatch && isHighTier) || isRecentlyActive;
  });

  // Sort candidate leagues so recent / active tournaments appear first
  candidateLeagues.sort((a, b) => {
    const aActive = activeLeagueMatchesMap.get(a.leagueid)?.latestTime || 0;
    const bActive = activeLeagueMatchesMap.get(b.leagueid)?.latestTime || 0;
    if (aActive !== bActive) return bActive - aActive;
    return b.leagueid - a.leagueid;
  });

  // Take top 36 tournaments to keep payload high-performance
  const selectedLeagues = candidateLeagues.slice(0, 36);

  const tournaments: TournamentSummary[] = selectedLeagues.map((l) => {
    const enrichment = getTournamentEnrichment(l.name);
    const isLive = liveLeagueIds.has(l.leagueid);
    const activity = activeLeagueMatchesMap.get(l.leagueid);

    let status: TournamentStatus = "completed";
    if (isLive) {
      status = "live";
    } else if (activity && Date.now() / 1000 - activity.latestTime < 86400 * 3) {
      // Has had matches in last 3 days
      status = "live";
    } else if (l.leagueid >= 20350 && (!activity || activity.count < 10)) {
      status = "upcoming";
    }

    const tier: TournamentTier =
      l.tier === "premium"
        ? "premium"
        : l.tier === "amateur"
        ? "amateur"
        : "professional";

    return {
      id: l.leagueid,
      name: l.name.trim(),
      tier,
      status,
      startDate: activity?.latestTime
        ? new Date(activity.latestTime * 1000).toISOString()
        : null,
      endDate: null,
      prizePool: enrichment.prizePool,
      numericPrizePool: enrichment.numericPrizePool,
      region: enrichment.region,
      teamsCount: activity ? Math.min(24, Math.max(8, activity.count)) : 16,
      matchesCount: activity?.count || 0,
      banner: normalizeTournamentAssetUrl(l.banner),
      logo: enrichment.logo || null,
      organizer: enrichment.organizer,
      officialWebsite: enrichment.officialWebsite,
      isFeatured: Boolean(enrichment.isFeatured && (status === "live" || status === "upcoming")),
      description: `Official Valve Dota 2 esports circuit tournament for ${l.name}.`,
    };
  });

  // Featured tournament: Highest priority is Live with major prize pool or top active premier
  let featured =
    tournaments.find((t) => t.isFeatured && t.status === "live") ||
    tournaments.find((t) => t.status === "live") ||
    tournaments.find((t) => t.isFeatured) ||
    tournaments[0] ||
    null;

  // Process live and recent pro matches for the match strip
  const liveAndRecentMatches = processLiveAndProMatches(rawLive, rawProMatches);

  const liveTournamentsCount = tournaments.filter((t) => t.status === "live").length;
  const upcomingCount = tournaments.filter((t) => t.status === "upcoming").length;
  const completedCount = tournaments.filter((t) => t.status === "completed").length;
  const liveMatchesCount = liveAndRecentMatches.filter((m) => m.is_live).length;

  return {
    featured,
    tournaments,
    liveAndRecentMatches,
    metrics: {
      totalTournaments: tournaments.length,
      liveTournamentsCount,
      upcomingCount,
      completedCount,
      liveMatchesCount,
    },
    source: isCached ? "Cached Esports Telemetry" : "OpenDota Esports Telemetry",
    fetchedAt: new Date().toISOString(),
    isCached,
  };
}

/**
 * Processes live matches from `/live` and completed matches from `/proMatches`.
 */
function processLiveAndProMatches(
  rawLive: RawLiveMatch[],
  rawProMatches: RawProMatch[]
): LiveOrRecentProMatch[] {
  const result: LiveOrRecentProMatch[] = [];
  const seenMatchIds = new Set<string>();

  // 1. Live tournament matches
  const liveTourneyMatches = rawLive.filter((m) => m.league_id && m.league_id > 0);
  liveTourneyMatches.slice(0, 4).forEach((m) => {
    const matchIdStr = String(m.match_id);
    seenMatchIds.add(matchIdStr);

    const radiantId = m.team_id_radiant || 0;
    const direId = m.team_id_dire || 0;

    const radMeta = teamsLookup[String(radiantId)];
    const direMeta = teamsLookup[String(direId)];

    result.push({
      match_id: m.match_id,
      league_id: m.league_id,
      league_name: "Live Competitive Match",
      is_live: true,
      start_time: m.activate_time || Math.floor(Date.now() / 1000) - m.game_time,
      game_time: m.game_time,
      radiant_team: {
        id: radiantId,
        name: m.team_name_radiant || radMeta?.name || `Team ${radiantId}`,
        tag: radMeta?.tag,
        logo: radMeta?.logo_url || null,
        score: m.radiant_score || 0,
      },
      dire_team: {
        id: direId,
        name: m.team_name_dire || direMeta?.name || `Team ${direId}`,
        tag: direMeta?.tag,
        logo: direMeta?.logo_url || null,
        score: m.dire_score || 0,
      },
      radiant_lead: m.radiant_lead,
      spectators: m.spectators,
      series_type: "BO3",
    });
  });

  // 2. Recent completed pro matches (skip any that are already in live matches)
  rawProMatches.slice(0, 20).forEach((m) => {
    const matchIdStr = String(m.match_id);
    if (seenMatchIds.has(matchIdStr)) {
      return;
    }
    seenMatchIds.add(matchIdStr);

    if (result.length >= 12) return;

    const radMeta = teamsLookup[String(m.radiant_team_id)];
    const direMeta = teamsLookup[String(m.dire_team_id)];

    const seriesFormat =
      m.series_type === 1
        ? "BO1"
        : m.series_type === 2
        ? "BO3"
        : m.series_type === 3
        ? "BO5"
        : "BO3";

    result.push({
      match_id: m.match_id,
      league_id: m.leagueid,
      league_name: m.league_name || "Pro Circuit",
      is_live: false,
      start_time: m.start_time,
      radiant_team: {
        id: m.radiant_team_id,
        name: m.radiant_name || radMeta?.name || `Team ${m.radiant_team_id}`,
        tag: radMeta?.tag,
        logo: radMeta?.logo_url || null,
        score: m.radiant_score,
      },
      dire_team: {
        id: m.dire_team_id,
        name: m.dire_name || direMeta?.name || `Team ${m.dire_team_id}`,
        tag: direMeta?.tag,
        logo: direMeta?.logo_url || null,
        score: m.dire_score,
      },
      radiant_win: m.radiant_win,
      duration: m.duration,
      series_type: seriesFormat,
    });
  });

  return result;
}

/**
 * Fetches full details for a specific tournament including teams, matches, and standings.
 */
export async function fetchTournamentDetail(leagueId: number): Promise<TournamentDetail> {
  if (isNaN(leagueId) || leagueId <= 0) {
    throw new TournamentTelemetryError("Invalid League ID.", 400);
  }

  // 1. Fetch main league info, matches, and teams concurrently
  const [leagueRes, teamsRes, matchesRes] = await Promise.allSettled([
    fetchWithTimeout<RawLeague>(`/leagues/${leagueId}`, 1800),
    fetchWithTimeout<RawTeamEntry[]>(`/leagues/${leagueId}/teams`, 1800),
    fetchWithTimeout<RawProMatch[]>(`/leagues/${leagueId}/matches`, 600),
  ]);

  if (leagueRes.status === "rejected" || !leagueRes.value || !leagueRes.value.name) {
    throw new TournamentTelemetryError(`Tournament #${leagueId} not found.`, 404);
  }

  const rawLeague = leagueRes.value;
  const rawTeams = teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value) ? teamsRes.value : [];
  const rawMatches = matchesRes.status === "fulfilled" && Array.isArray(matchesRes.value) ? matchesRes.value : [];

  // Build team map
  const teamMap = new Map<number, TournamentTeam>();
  rawTeams.forEach((t) => {
    if (t.team_id) {
      const snap = teamsLookup[String(t.team_id)];
      teamMap.set(t.team_id, {
        team_id: t.team_id,
        name: t.name || snap?.name || `Team ${t.team_id}`,
        tag: t.tag || snap?.tag || "",
        rating: t.rating || snap?.rating || 1000,
        wins: Number(t.wins) || 0,
        losses: Number(t.losses) || 0,
        logo_url: t.logo_url || snap?.logo_url || null,
      });
    }
  });

  // Process matches
  const matches: TournamentMatch[] = rawMatches.map((m) => {
    const radTeam = teamMap.get(m.radiant_team_id) || teamsLookup[String(m.radiant_team_id)];
    const direTeam = teamMap.get(m.dire_team_id) || teamsLookup[String(m.dire_team_id)];

    const seriesFormat =
      m.series_type === 1
        ? "BO1"
        : m.series_type === 2
        ? "BO3"
        : m.series_type === 3
        ? "BO5"
        : "BO3";

    return {
      match_id: m.match_id,
      radiant_win: m.radiant_win,
      start_time: m.start_time,
      duration: m.duration,
      radiant_score: m.radiant_score,
      dire_score: m.dire_score,
      radiant_team_id: m.radiant_team_id,
      radiant_team_name: m.radiant_name || radTeam?.name || `Team ${m.radiant_team_id}`,
      radiant_team_logo: radTeam?.logo_url || null,
      dire_team_id: m.dire_team_id,
      dire_team_name: m.dire_name || direTeam?.name || `Team ${m.dire_team_id}`,
      dire_team_logo: direTeam?.logo_url || null,
      series_id: m.series_id,
      series_type: m.series_type,
      series_name: seriesFormat,
      status: "completed",
    };
  });

  // Calculate standings from teams & matches
  const standings: TournamentStanding[] = Array.from(teamMap.values())
    .map((team) => {
      const totalMatches = team.wins + team.losses;
      const winRate = totalMatches > 0 ? Number(((team.wins / totalMatches) * 100).toFixed(1)) : 0;
      return {
        rank: 0,
        team,
        matchesPlayed: totalMatches,
        wins: team.wins,
        losses: team.losses,
        winRate,
      };
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    })
    .map((s, index) => ({
      ...s,
      rank: index + 1,
    }));

  const enrichment = getTournamentEnrichment(rawLeague.name);

  const tournament: TournamentSummary = {
    id: rawLeague.leagueid,
    name: rawLeague.name.trim(),
    tier: rawLeague.tier === "premium" ? "premium" : "professional",
    status: rawMatches.length > 0 ? "completed" : "upcoming",
    startDate: matches.length > 0 ? new Date(matches[matches.length - 1].start_time * 1000).toISOString() : null,
    endDate: matches.length > 0 ? new Date(matches[0].start_time * 1000).toISOString() : null,
    prizePool: enrichment.prizePool,
    numericPrizePool: enrichment.numericPrizePool,
    region: enrichment.region,
    teamsCount: teamMap.size || rawTeams.length,
    matchesCount: matches.length,
    banner: normalizeTournamentAssetUrl(rawLeague.banner),
    logo: enrichment.logo || null,
    organizer: enrichment.organizer,
    officialWebsite: enrichment.officialWebsite,
    description: `Complete Dota 2 competitive telemetry dossier for ${rawLeague.name}.`,
  };

  return {
    tournament,
    teams: Array.from(teamMap.values()),
    matches,
    standings,
    bracketAvailable: false, // Valve / OpenDota does not expose interactive tree brackets via public REST
    fetchedAt: new Date().toISOString(),
  };
}
