import {
  OpenDotaPlayerResponse,
  OpenDotaWinLoss,
  OpenDotaRecentMatch,
  OpenDotaPlayerHero,
  OpenDotaTotal,
  PlayerDashboardData,
  EnrichedRecentMatch,
  EnrichedHeroStat,
  PlayerHeroMatchup,
  OpenDotaPeer,
  EnrichedTeammate,
  PlayerMatchHistoryItem,
  DailyMatchActivity,
} from "./types";
import { getHeroById, formatGameMode, formatLobbyType, formatDuration, formatTimeAgo } from "./heroes";
import { formatRank } from "./rank";

const OPENDOTA_BASE_URL = "https://api.opendota.com/api";
const REQUEST_TIMEOUT_MS = 8000;

export class OpenDotaError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "OpenDotaError";
    this.statusCode = statusCode;
  }
}

/**
 * Executes a fetch request with timeout and error handling.
 */
async function fetchWithTimeout<T>(
  endpoint: string,
  revalidateSeconds = 120,
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<T> {
  const apiKey = process.env.OPENDOTA_API_KEY;
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${OPENDOTA_BASE_URL}${endpoint}${apiKey ? `${separator}api_key=${apiKey}` : ""}`;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: revalidateSeconds,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new OpenDotaError("Request to OpenDota timed out. Please try again.", 504);
    }
    throw new OpenDotaError("Failed to connect to OpenDota match data service.", 502);
  }

  if (response.status === 404) {
    throw new OpenDotaError("Player not found on OpenDota.", 404);
  }

  if (response.status === 429) {
    throw new OpenDotaError("OpenDota API rate limit reached. Please wait a moment and try again.", 429);
  }

  if (!response.ok) {
    throw new OpenDotaError(
      `OpenDota upstream service responded with status ${response.status}.`,
      response.status >= 500 ? 502 : response.status
    );
  }

  return (await response.json()) as T;
}

/**
 * Fetches and aggregates all available OpenDota data for an account ID.
 * Gracefully tolerates failure of optional statistic endpoints.
 */
export async function fetchOpenDotaPlayerData(accountId: string | number): Promise<PlayerDashboardData> {
  const numericId = typeof accountId === "string" ? parseInt(accountId, 10) : accountId;

  if (isNaN(numericId) || numericId <= 0 || numericId > 4294967295) {
    throw new OpenDotaError(
      "Invalid Account ID. Must be a positive 32-bit integer (e.g. 70388657).",
      400
    );
  }

  // 1. Fetch main player profile (critical endpoint)
  let playerRes: OpenDotaPlayerResponse;
  try {
    playerRes = await fetchWithTimeout<OpenDotaPlayerResponse>(`/players/${numericId}`);
  } catch (err) {
    if (err instanceof OpenDotaError) throw err;
    throw new OpenDotaError("Could not retrieve player profile from OpenDota.", 502);
  }

  // Check if profile exists
  if (!playerRes || playerRes.error === "Not Found") {
    throw new OpenDotaError(
      `No Dota 2 profile found for Account ID ${numericId}. Ensure the ID is correct and match data is public.`,
      404
    );
  }

  // 2. Concurrently fetch optional statistical endpoints
  const [wlResult, matchesResult, heroesResult, totalsResult, historyResult] = await Promise.allSettled([
    fetchWithTimeout<OpenDotaWinLoss>(`/players/${numericId}/wl`),
    fetchWithTimeout<OpenDotaRecentMatch[]>(`/players/${numericId}/recentMatches`),
    fetchWithTimeout<OpenDotaPlayerHero[]>(`/players/${numericId}/heroes`),
    fetchWithTimeout<OpenDotaTotal[]>(`/players/${numericId}/totals`),
    fetchWithTimeout<OpenDotaRecentMatch[]>(`/players/${numericId}/matches?limit=100`),
  ]);

  let isPartial = false;
  let warningMessage: string | undefined = undefined;

  // Handle Win/Loss
  const wlData: OpenDotaWinLoss =
    wlResult.status === "fulfilled" && wlResult.value && typeof wlResult.value.win === "number"
      ? wlResult.value
      : { win: 0, lose: 0 };
  if (wlResult.status === "rejected") {
    isPartial = true;
  }

  // Handle Recent Matches
  const rawMatches: OpenDotaRecentMatch[] =
    matchesResult.status === "fulfilled" && Array.isArray(matchesResult.value)
      ? matchesResult.value
      : [];
  if (matchesResult.status === "rejected") {
    isPartial = true;
  }

  // Handle Heroes
  const rawHeroes: OpenDotaPlayerHero[] =
    heroesResult.status === "fulfilled" && Array.isArray(heroesResult.value)
      ? heroesResult.value
      : [];
  if (heroesResult.status === "rejected") {
    isPartial = true;
  }

  // Handle Totals
  const rawTotals: OpenDotaTotal[] =
    totalsResult.status === "fulfilled" && Array.isArray(totalsResult.value)
      ? totalsResult.value
      : [];
  if (totalsResult.status === "rejected") {
    isPartial = true;
  }

  if (isPartial) {
    warningMessage = "Some secondary stats were temporarily unavailable. Main stats are displayed.";
  }

  // Validate that we have at least profile or some matches
  const hasProfile = Boolean(
    playerRes.profile && (playerRes.profile.personaname || playerRes.profile.avatarfull || playerRes.profile.name)
  );
  if (!hasProfile && rawMatches.length === 0 && wlData.win === 0 && wlData.lose === 0) {
    throw new OpenDotaError(
      `Account ID ${numericId} has no public Dota 2 profile or match history recorded on OpenDota.`,
      404
    );
  }

  // 3. Process Lifetime Win/Loss
  const totalMatches = wlData.win + wlData.lose;
  const lifetimeWinRate =
    totalMatches > 0 ? Number(((wlData.win / totalMatches) * 100).toFixed(2)) : 0;

  // 4. Process Recent Matches
  let recentWins = 0;
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalGpm = 0;
  let totalXpm = 0;

  const enrichedMatches: EnrichedRecentMatch[] = rawMatches.map((m) => {
    const isRadiant = m.player_slot < 128;
    const isWin = isRadiant ? Boolean(m.radiant_win) : !m.radiant_win;
    if (isWin) recentWins++;

    totalKills += m.kills;
    totalDeaths += m.deaths;
    totalAssists += m.assists;
    totalGpm += m.gold_per_min || 0;
    totalXpm += m.xp_per_min || 0;

    const hero = getHeroById(m.hero_id);

    return {
      matchId: m.match_id,
      heroId: m.hero_id,
      heroName: hero.name,
      heroLocalizedName: hero.localized_name,
      heroImageUrl: hero.img,
      isRadiant,
      isWin,
      kills: m.kills,
      deaths: m.deaths,
      assists: m.assists,
      kda: `${m.kills} / ${m.deaths} / ${m.assists}`,
      durationFormatted: formatDuration(m.duration),
      durationSeconds: m.duration,
      startTime: m.start_time,
      timeAgo: formatTimeAgo(m.start_time),
      gpm: m.gold_per_min || 0,
      xpm: m.xp_per_min || 0,
      heroDamage: m.hero_damage || 0,
      towerDamage: m.tower_damage || 0,
      lastHits: m.last_hits || 0,
      gameModeName: formatGameMode(m.game_mode),
      lobbyTypeName: formatLobbyType(m.lobby_type),
    };
  });

  const sampleSize = enrichedMatches.length;
  const recentLosses = Math.max(0, sampleSize - recentWins);
  const recentWinRate =
    sampleSize > 0 ? Number(((recentWins / sampleSize) * 100).toFixed(1)) : 0;
  const avgKills = sampleSize > 0 ? Number((totalKills / sampleSize).toFixed(1)) : 0;
  const avgDeaths = sampleSize > 0 ? Number((totalDeaths / sampleSize).toFixed(1)) : 0;
  const avgAssists = sampleSize > 0 ? Number((totalAssists / sampleSize).toFixed(1)) : 0;
  const kdaRatio =
    sampleSize > 0
      ? Number(((totalKills + totalAssists) / Math.max(1, totalDeaths)).toFixed(2))
      : 0;
  const avgGpm = sampleSize > 0 ? Math.round(totalGpm / sampleSize) : 0;
  const avgXpm = sampleSize > 0 ? Math.round(totalXpm / sampleSize) : 0;

  const lastMatchTime = sampleSize > 0 ? enrichedMatches[0].startTime : null;
  const lastMatchAgo = lastMatchTime ? formatTimeAgo(lastMatchTime) : null;

  // 5. Process Lifetime Totals from /totals if present
  let lifetimeTotalsSummary = null;
  if (rawTotals.length > 0) {
    const findField = (field: string) => rawTotals.find((t) => t.field === field);
    const killsTotal = findField("kills");
    const deathsTotal = findField("deaths");
    const assistsTotal = findField("assists");
    const gpmTotal = findField("gold_per_min");
    const xpmTotal = findField("xp_per_min");

    const sampleN = killsTotal?.n || deathsTotal?.n || totalMatches;
    if (sampleN > 0) {
      const killsAvg = killsTotal ? Number((killsTotal.sum / killsTotal.n).toFixed(1)) : 0;
      const deathsAvg = deathsTotal ? Number((deathsTotal.sum / deathsTotal.n).toFixed(1)) : 0;
      const assistsAvg = assistsTotal ? Number((assistsTotal.sum / assistsTotal.n).toFixed(1)) : 0;
      const kdaLifetime = Number(((killsAvg + assistsAvg) / Math.max(1, deathsAvg)).toFixed(2));
      const gpmAvg = gpmTotal ? Math.round(gpmTotal.sum / gpmTotal.n) : 0;
      const xpmAvg = xpmTotal ? Math.round(xpmTotal.sum / xpmTotal.n) : 0;

      lifetimeTotalsSummary = {
        killsAvg,
        deathsAvg,
        assistsAvg,
        kdaRatio: kdaLifetime,
        gpmAvg,
        xpmAvg,
        sampleSize: sampleN,
      };
    }
  }

  // 5b. Process Match History and Daily Activity (up to 100 historical matches)
  const rawHistoryList: OpenDotaRecentMatch[] =
    historyResult.status === "fulfilled" && Array.isArray(historyResult.value) && historyResult.value.length > 0
      ? historyResult.value
      : rawMatches;

  const matchHistoryItems: PlayerMatchHistoryItem[] = rawHistoryList.map((m: OpenDotaRecentMatch) => {
    const isRadiant = m.player_slot < 128;
    const isWin = isRadiant ? Boolean(m.radiant_win) : !m.radiant_win;
    const hero = getHeroById(m.hero_id);
    const d = new Date(m.start_time * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    return {
      matchId: m.match_id,
      heroId: m.hero_id,
      heroName: hero.name,
      heroLocalizedName: hero.localized_name,
      heroImageUrl: hero.img,
      isRadiant,
      isWin,
      kills: m.kills ?? 0,
      deaths: m.deaths ?? 0,
      assists: m.assists ?? 0,
      kda: `${m.kills ?? 0} / ${m.deaths ?? 0} / ${m.assists ?? 0}`,
      durationSeconds: m.duration ?? 0,
      durationFormatted: formatDuration(m.duration ?? 0),
      startTime: m.start_time,
      dateStr,
    };
  });

  const dailyActivity: Record<string, DailyMatchActivity> = {};
  for (const m of matchHistoryItems) {
    if (!dailyActivity[m.dateStr]) {
      dailyActivity[m.dateStr] = {
        date: m.dateStr,
        wins: 0,
        losses: 0,
        total: 0,
        winRate: 0,
        matches: [],
      };
    }
    const day = dailyActivity[m.dateStr];
    day.total += 1;
    if (m.isWin) {
      day.wins += 1;
    } else {
      day.losses += 1;
    }
    day.matches.push(m);
  }

  for (const key of Object.keys(dailyActivity)) {
    const day = dailyActivity[key];
    day.winRate = day.total > 0 ? Number(((day.wins / day.total) * 100).toFixed(1)) : 0;
  }

  // 6. Process Heroes
  const enrichedHeroes: EnrichedHeroStat[] = rawHeroes
    .filter((h) => h.games > 0)
    .sort((a, b) => b.games - a.games)
    .map((h) => {
      const hero = getHeroById(h.hero_id);
      const winRate = Number(((h.win / h.games) * 100).toFixed(1));
      return {
        heroId: typeof h.hero_id === "string" ? parseInt(h.hero_id, 10) : h.hero_id,
        heroName: hero.name,
        heroLocalizedName: hero.localized_name,
        heroImageUrl: hero.img,
        primaryAttr: hero.primary_attr,
        games: h.games,
        win: h.win,
        loss: h.games - h.win,
        winRate,
        lastPlayed: h.last_played,
        lastPlayedAgo: formatTimeAgo(h.last_played),
      };
    });

  const topHeroes = enrichedHeroes.slice(0, 5);

  // 7. Process Matchups (Allies and Enemies)
  const allyMatchups: PlayerHeroMatchup[] = rawHeroes
    .filter((h) => h.with_games > 0)
    .map((h) => {
      const hero = getHeroById(h.hero_id);
      const withLoss = Math.max(0, h.with_games - h.with_win);
      const withWinRate = Number(((h.with_win / h.with_games) * 100).toFixed(1));
      const synergyAdvantage = Number((withWinRate - lifetimeWinRate).toFixed(1));
      const heroId = typeof h.hero_id === "string" ? parseInt(h.hero_id, 10) : h.hero_id;
      const againstGames = h.against_games || 0;
      const againstWin = h.against_win || 0;
      const againstLoss = Math.max(0, againstGames - againstWin);
      const againstWinRate = againstGames > 0 ? Number(((againstWin / againstGames) * 100).toFixed(1)) : 0;
      const defeatRate = againstGames > 0 ? Number(((againstLoss / againstGames) * 100).toFixed(1)) : 0;
      const nemesisIndex = againstGames > 0 ? Number((defeatRate - (100 - lifetimeWinRate)).toFixed(1)) : 0;

      return {
        heroId,
        heroName: hero.name,
        heroLocalizedName: hero.localized_name,
        heroImageUrl: hero.img,
        primaryAttr: hero.primary_attr,
        withGames: h.with_games,
        withWin: h.with_win,
        withLoss,
        withWinRate,
        synergyAdvantage,
        againstGames,
        againstWin,
        againstLoss,
        againstWinRate,
        defeatRate,
        nemesisIndex,
      };
    })
    .sort((a, b) => b.withGames - a.withGames);

  const enemyMatchups: PlayerHeroMatchup[] = rawHeroes
    .filter((h) => h.against_games > 0)
    .map((h) => {
      const hero = getHeroById(h.hero_id);
      const heroId = typeof h.hero_id === "string" ? parseInt(h.hero_id, 10) : h.hero_id;
      const againstGames = h.against_games;
      const againstWin = h.against_win;
      const againstLoss = Math.max(0, againstGames - againstWin);
      const againstWinRate = Number(((againstWin / againstGames) * 100).toFixed(1));
      const defeatRate = Number(((againstLoss / againstGames) * 100).toFixed(1));
      const nemesisIndex = Number((defeatRate - (100 - lifetimeWinRate)).toFixed(1));
      const withGames = h.with_games || 0;
      const withWin = h.with_win || 0;
      const withLoss = Math.max(0, withGames - withWin);
      const withWinRate = withGames > 0 ? Number(((withWin / withGames) * 100).toFixed(1)) : 0;
      const synergyAdvantage = withGames > 0 ? Number((withWinRate - lifetimeWinRate).toFixed(1)) : 0;

      return {
        heroId,
        heroName: hero.name,
        heroLocalizedName: hero.localized_name,
        heroImageUrl: hero.img,
        primaryAttr: hero.primary_attr,
        withGames,
        withWin,
        withLoss,
        withWinRate,
        synergyAdvantage,
        againstGames,
        againstWin,
        againstLoss,
        againstWinRate,
        defeatRate,
        nemesisIndex,
      };
    })
    .sort((a, b) => b.againstGames - a.againstGames);

  // 8. Format Profile Details
  const profile = playerRes.profile;
  const personaname = profile?.personaname || `Player #${numericId}`;
  const proName = profile?.name || null;
  const avatarUrl =
    profile?.avatarfull ||
    profile?.avatarmedium ||
    profile?.avatar ||
    "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
  const profileUrl = profile?.profileurl || null;
  const countryCode = profile?.loccountrycode || null;
  const rankTier = playerRes.rank_tier ?? null;
  const leaderboardRank = playerRes.leaderboard_rank ?? null;
  const rankFormatted = formatRank(rankTier, leaderboardRank);

  return {
    accountId: numericId,
    steamId64: profile?.steamid || null,
    personaname,
    proName,
    avatarUrl,
    profileUrl,
    countryCode,
    rankTier,
    leaderboardRank,
    rankFormatted,
    plus: Boolean(profile?.plus),
    lifetime: {
      totalMatches,
      wins: wlData.win,
      losses: wlData.lose,
      winRate: lifetimeWinRate,
    },
    recentSummary: {
      sampleSize,
      wins: recentWins,
      losses: recentLosses,
      winRate: recentWinRate,
      avgKills,
      avgDeaths,
      avgAssists,
      kdaRatio,
      avgGpm,
      avgXpm,
      lastMatchTime,
      lastMatchAgo,
    },
    lifetimeTotals: lifetimeTotalsSummary,
    recentMatches: enrichedMatches,
    matchHistory: matchHistoryItems,
    dailyActivity,
    topHeroes,
    allHeroes: enrichedHeroes,
    matchups: {
      allies: allyMatchups,
      enemies: enemyMatchups,
    },
    peers: [],
    isPartial,
    warningMessage,
    fetchedAt: (() => {
      try {
        return new Date().toISOString();
      } catch {
        return "2026-01-01T00:00:00.000Z";
      }
    })(),
  };
}

/**
 * Dedicated fetcher for player peers (teammates).
 */
export async function fetchPlayerPeers(accountId: string | number): Promise<EnrichedTeammate[]> {
  const numericId = typeof accountId === "string" ? parseInt(accountId, 10) : accountId;

  if (isNaN(numericId) || numericId <= 0 || numericId > 4294967295) {
    throw new OpenDotaError("Invalid Account ID.", 400);
  }

  const [wlResult, peersResult] = await Promise.allSettled([
    fetchWithTimeout<OpenDotaWinLoss>(`/players/${numericId}/wl`),
    fetchWithTimeout<OpenDotaPeer[]>(`/players/${numericId}/peers`, 300, 45000),
  ]);

  const wlData =
    wlResult.status === "fulfilled" && wlResult.value && typeof wlResult.value.win === "number"
      ? wlResult.value
      : { win: 0, lose: 0 };
  const totalMatches = wlData.win + wlData.lose;
  const lifetimeWinRate = totalMatches > 0 ? Number(((wlData.win / totalMatches) * 100).toFixed(2)) : 50.0;

  const rawPeers: OpenDotaPeer[] =
    peersResult.status === "fulfilled" && Array.isArray(peersResult.value)
      ? peersResult.value
      : [];

  return rawPeers
    .filter((p) => p && typeof p.account_id === "number" && (p.with_games > 0 || p.games > 0))
    .map((p) => {
      const withGames = p.with_games || 0;
      const withWin = p.with_win || 0;
      const withLoss = Math.max(0, withGames - withWin);
      const withWinRate = withGames > 0 ? Number(((withWin / withGames) * 100).toFixed(1)) : 0;
      const synergyAdvantage = withGames > 0 ? Number((withWinRate - lifetimeWinRate).toFixed(1)) : 0;

      const againstGames = p.against_games || 0;
      const againstWin = p.against_win || 0;
      const againstLoss = Math.max(0, againstGames - againstWin);
      const againstWinRate = againstGames > 0 ? Number(((againstWin / againstGames) * 100).toFixed(1)) : 0;

      const withAvgGpm = withGames > 0 && typeof p.with_gpm_sum === "number" ? Math.round(p.with_gpm_sum / withGames) : undefined;
      const withAvgXpm = withGames > 0 && typeof p.with_xpm_sum === "number" ? Math.round(p.with_xpm_sum / withGames) : undefined;

      const personaName = p.personaname || p.name || `Player #${p.account_id}`;
      const avatarUrl =
        p.avatarfull ||
        p.avatar ||
        "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

      return {
        accountId: p.account_id,
        personaName,
        avatarUrl,
        games: p.games || withGames,
        withGames,
        withWin,
        withLoss,
        withWinRate,
        synergyAdvantage,
        againstGames,
        againstWin,
        againstLoss,
        againstWinRate,
        lastPlayed: p.last_played ?? null,
        lastPlayedFormatted: p.last_played ? formatTimeAgo(p.last_played) : "Unknown",
        withAvgGpm,
        withAvgXpm,
      };
    })
    .sort((a, b) => b.withGames - a.withGames);
}
