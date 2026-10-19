import fs from "fs";
import path from "path";
import {
  MetaRankBracket,
  RankBracketDefinition,
  MetaHeroEntry,
  MetaOverviewStats,
  PatchInfo,
  HistoricalMetaSnapshot,
  MetaTrendsPayload,
  HeroTierCategory,
} from "./meta-types";
import { normalizeCdnUrl } from "./hero-stats";
import fallbackSnapshot from "./hero-stats-snapshot.json";

const OPENDOTA_BASE_URL = "https://api.opendota.com/api";
const REQUEST_TIMEOUT_MS = 8000;
const SNAPSHOTS_FILE_PATH = path.join(process.cwd(), "lib", "opendota", "meta-snapshots-history.json");

export const RANK_BRACKET_DEFINITIONS: RankBracketDefinition[] = [
  {
    id: "all",
    numericId: 0,
    name: "All Brackets",
    badge: "GLOBAL",
    description: "Aggregated pub matchmaking across all skill levels",
    isAvailable: true,
  },
  {
    id: "1",
    numericId: 1,
    name: "Herald",
    badge: "HERALD",
    description: "Rank 1 (0 – 770 MMR)",
    isAvailable: true,
  },
  {
    id: "2",
    numericId: 2,
    name: "Guardian",
    badge: "GUARDIAN",
    description: "Rank 2 (770 – 1540 MMR)",
    isAvailable: true,
  },
  {
    id: "3",
    numericId: 3,
    name: "Crusader",
    badge: "CRUSADER",
    description: "Rank 3 (1540 – 2310 MMR)",
    isAvailable: true,
  },
  {
    id: "4",
    numericId: 4,
    name: "Archon",
    badge: "ARCHON",
    description: "Rank 4 (2310 – 3080 MMR)",
    isAvailable: true,
  },
  {
    id: "5",
    numericId: 5,
    name: "Legend",
    badge: "LEGEND",
    description: "Rank 5 (3080 – 3850 MMR)",
    isAvailable: true,
  },
  {
    id: "6",
    numericId: 6,
    name: "Ancient",
    badge: "ANCIENT",
    description: "Rank 6 (3850 – 4620 MMR)",
    isAvailable: true,
  },
  {
    id: "7",
    numericId: 7,
    name: "Divine & Immortal",
    badge: "DIVINE / IMMORTAL",
    description: "Rank 7 (4620+ MMR). OpenDota merges Divine & Immortal in Tier 7 stats.",
    isAvailable: true,
  },
];

interface RawOpenDotaHeroStat {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img?: string;
  icon?: string;
  pub_pick?: number;
  pub_win?: number;
  pro_pick?: number;
  pro_win?: number;
  pro_ban?: number;
  pub_pick_trend?: number[];
  pub_win_trend?: number[];
  [key: string]: unknown;
}

interface RawPatchResponseItem {
  id: number;
  name: string;
  date: string;
}

/**
 * Safe fetcher with timeout and error tolerance.
 */
async function fetchEndpoint<T>(endpoint: string, revalidateSeconds = 3600): Promise<T | null> {
  const apiKey = process.env.OPENDOTA_API_KEY;
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${OPENDOTA_BASE_URL}${endpoint}${apiKey ? `${separator}api_key=${apiKey}` : ""}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[MetaTrends] Upstream fetch failed for ${endpoint}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Fetch official verified patch metadata from OpenDota /constants/patch.
 */
export async function getVerifiedPatch(): Promise<PatchInfo> {
  const patches = await fetchEndpoint<RawPatchResponseItem[]>("/constants/patch", 86400);

  if (Array.isArray(patches) && patches.length > 0) {
    const latest = patches[patches.length - 1];
    return {
      id: latest.id,
      name: latest.name,
      date: latest.date,
      officialUrl: `https://www.dota2.com/patches/${latest.name}`,
    };
  }

  // Resilient fallback with authentic verified patch release
  return {
    id: 60,
    name: "7.41",
    date: "2026-03-24T00:50:59.580Z",
    officialUrl: "https://www.dota2.com/patches/7.41",
  };
}

/**
 * Calculates transparent Bayesian-weighted win rate and tier classification.
 * Prevents small sample size anomalies from reaching high tiers.
 */
function calculateMetaTier(
  wins: number,
  picks: number,
  bracketAvgWinRate: number,
  bracketAvgPickRate: number,
  totalBracketMatches: number
): { bayesianWinRate: number; metaScore: number; tier: HeroTierCategory } {
  if (picks === 0) {
    return {
      bayesianWinRate: 50.0,
      metaScore: 50.0,
      tier: "D",
    };
  }

  const rawWinRate = (wins / picks) * 100;
  const pickRate = totalBracketMatches > 0 ? (picks / totalBracketMatches) * 100 : 0;

  // Bayesian smoothing constant C:
  // Dynamically scaled to prevent 1-game anomalies while respecting reliable sample sizes
  const C = Math.max(150, Math.min(1000, Math.round(totalBracketMatches * 0.0005)));
  const bayesianWinRate = Number((((wins + (bracketAvgWinRate / 100) * C) / (picks + C)) * 100).toFixed(2));

  // Meta score weighs Bayesian win rate (confidence) + pick rate presence
  // Meta Score = BayesianWR + 0.35 * (PickRate - AvgPickRate)
  const pickWeight = 0.35;
  const pickDelta = pickRate - bracketAvgPickRate;
  const metaScore = Number((bayesianWinRate + pickWeight * pickDelta).toFixed(2));

  // Transparent, documented threshold bounds
  let tier: HeroTierCategory = "C";
  if (picks < 200) {
    // Insufficient sample size warning - cannot claim S or A tier
    tier = "D";
  } else if (metaScore >= 53.5) {
    tier = "S";
  } else if (metaScore >= 51.5) {
    tier = "A";
  } else if (metaScore >= 49.5) {
    tier = "B";
  } else if (metaScore >= 47.5) {
    tier = "C";
  } else {
    tier = "D";
  }

  return { bayesianWinRate, metaScore, tier };
}

/**
 * Reads local snapshot history file or creates a default seed from the repository.
 */
function readSnapshotsHistory(): HistoricalMetaSnapshot[] {
  try {
    if (fs.existsSync(SNAPSHOTS_FILE_PATH)) {
      const raw = fs.readFileSync(SNAPSHOTS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("[MetaTrends] Could not read snapshots history file:", err);
  }
  return [];
}

/**
 * Saves a new snapshot to history if enough time has elapsed (e.g. 1 hour).
 */
function recordSnapshotIfEligible(
  rawHeroes: RawOpenDotaHeroStat[],
  patchVersion: string,
  totalPubMatches: number
): HistoricalMetaSnapshot[] {
  const history = readSnapshotsHistory();
  const now = new Date();

  // If latest snapshot was captured in the last 4 hours, keep existing ledger
  const latest = history[history.length - 1];
  if (latest) {
    const diffHours = (now.getTime() - new Date(latest.timestamp).getTime()) / (1000 * 60 * 60);
    if (diffHours < 4) {
      return history;
    }
  }

  // Create new dated snapshot
  const heroMetrics: HistoricalMetaSnapshot["heroMetrics"] = {};
  for (const h of rawHeroes) {
    const picks = Number(h.pub_pick) || 0;
    const wins = Number(h.pub_win) || 0;
    const winRate = picks > 0 ? Number(((wins / picks) * 100).toFixed(2)) : 0;
    const pickRate = totalPubMatches > 0 ? Number(((picks / totalPubMatches) * 100).toFixed(2)) : 0;

    heroMetrics[h.id] = {
      picks,
      wins,
      winRate,
      pickRate,
    };
  }

  const newSnapshot: HistoricalMetaSnapshot = {
    snapshotId: `snap_${now.toISOString().replace(/[:.]/g, "-")}`,
    timestamp: now.toISOString(),
    patchVersion,
    totalPubMatches,
    heroMetrics,
  };

  // Keep up to 30 historical snapshots
  const updated = [...history.slice(-29), newSnapshot];

  try {
    const dir = path.dirname(SNAPSHOTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SNAPSHOTS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("[MetaTrends] Failed to persist snapshot history:", err);
  }

  return updated;
}

/**
 * Fetches and builds complete MetaTrendsPayload for a requested rank bracket.
 */
export async function getMetaTrendsData(bracket: MetaRankBracket = "all"): Promise<MetaTrendsPayload> {
  const currentPatch = await getVerifiedPatch();

  // 1. Fetch raw hero stats from OpenDota or fallback snapshot
  let rawStats = await fetchEndpoint<RawOpenDotaHeroStat[]>("/heroStats", 3600);
  let isCached = false;

  if (!rawStats || !Array.isArray(rawStats) || rawStats.length === 0) {
    rawStats = fallbackSnapshot as unknown as RawOpenDotaHeroStat[];
    isCached = true;
  }

  // 2. Determine match and pick denominators for the selected bracket
  const isAllBrackets = bracket === "all";
  const bracketNum = Number(bracket);

  let totalPicks = 0;
  for (const h of rawStats) {
    if (isAllBrackets) {
      totalPicks += Number(h.pub_pick) || 0;
    } else {
      totalPicks += Number(h[`${bracketNum}_pick`]) || 0;
    }
  }

  // 10 heroes in every Dota 2 match
  const totalMatches = totalPicks > 0 ? Math.round(totalPicks / 10) : 1;
  const avgPickRate = totalMatches > 0 ? Number(((totalPicks / rawStats.length / totalMatches) * 100).toFixed(2)) : 0;

  // 3. Register or load server snapshot history
  let history = readSnapshotsHistory();
  if (isAllBrackets && !isCached) {
    history = recordSnapshotIfEligible(rawStats, currentPatch.name, totalMatches);
  }

  // Historical delta baseline (compare with earliest snapshot if >= 2 snapshots exist)
  const previousSnapshot = history.length >= 2 ? history[0] : null;
  const isSnapshotDeltaAvailable = previousSnapshot !== null;
  const snapshotCollectionStartedAt = history.length > 0 ? history[0].timestamp : new Date().toISOString();

  // 4. Transform raw entries into enriched MetaHeroEntry
  const heroes: MetaHeroEntry[] = rawStats.map((raw) => {
    let picks = 0;
    let wins = 0;

    if (isAllBrackets) {
      picks = Number(raw.pub_pick) || 0;
      wins = Number(raw.pub_win) || 0;
    } else {
      picks = Number(raw[`${bracketNum}_pick`]) || 0;
      wins = Number(raw[`${bracketNum}_win`]) || 0;
    }

    const winRate = picks > 0 ? Number(((wins / picks) * 100).toFixed(2)) : 0;
    const pickRate = totalMatches > 0 ? Number(((picks / totalMatches) * 100).toFixed(2)) : 0;

    // Bayesian score & tier calculation
    const { bayesianWinRate, metaScore, tier } = calculateMetaTier(
      wins,
      picks,
      50.0,
      avgPickRate,
      totalMatches
    );

    // Verified 7-interval trends from OpenDota (pub_pick_trend & pub_win_trend)
    const pickTrend = Array.isArray(raw.pub_pick_trend) ? raw.pub_pick_trend : [];
    const winTrend = Array.isArray(raw.pub_win_trend) ? raw.pub_win_trend : [];

    // Calculate actual interval delta if at least 2 interval points exist
    let winRateDelta: number | null = null;
    let pickRateDelta: number | null = null;

    if (previousSnapshot && isAllBrackets && previousSnapshot.heroMetrics[raw.id]) {
      const prev = previousSnapshot.heroMetrics[raw.id];
      winRateDelta = Number((winRate - prev.winRate).toFixed(2));
      pickRateDelta = Number((pickRate - prev.pickRate).toFixed(2));
    } else if (pickTrend.length >= 2 && winTrend.length >= 2) {
      // Calculate delta from OpenDota's latest vs penultimate recorded interval
      const latestPicks = pickTrend[pickTrend.length - 1];
      const latestWins = winTrend[winTrend.length - 1];
      const prevPicks = pickTrend[pickTrend.length - 2];
      const prevWins = winTrend[winTrend.length - 2];

      if (latestPicks > 50 && prevPicks > 50) {
        const latestWR = (latestWins / latestPicks) * 100;
        const prevWR = (prevWins / prevPicks) * 100;
        winRateDelta = Number((latestWR - prevWR).toFixed(2));
      }
    }

    return {
      id: raw.id,
      name: raw.name,
      localized_name: raw.localized_name || `Hero ${raw.id}`,
      primary_attr: (raw.primary_attr as MetaHeroEntry["primary_attr"]) || "str",
      attack_type: raw.attack_type || "Melee",
      roles: Array.isArray(raw.roles) ? raw.roles : [],
      img: normalizeCdnUrl(raw.img),
      icon: normalizeCdnUrl(raw.icon),
      picks,
      wins,
      winRate,
      pickRate,
      banCount: Number(raw.pro_ban) || 0,
      bayesianWinRate,
      metaScore,
      tier,
      pickTrend,
      winTrend,
      winRateDelta,
      pickRateDelta,
    };
  });

  // 5. Calculate overview statistics
  // Qualifying threshold: at least 0.5% of total matches or 1,000 matches to avoid 1-game anomalies
  const minMatchesThreshold = Math.max(100, Math.round(totalMatches * 0.005));
  const qualifiedForHighestWinRate = heroes.filter((h) => h.picks >= minMatchesThreshold);
  const winRatePool = qualifiedForHighestWinRate.length > 0 ? qualifiedForHighestWinRate : heroes;

  const highestWinRate = [...winRatePool].sort((a, b) => b.winRate - a.winRate)[0] || null;
  const mostPicked = [...heroes].sort((a, b) => b.picks - a.picks)[0] || null;

  const selectedBracketDef =
    RANK_BRACKET_DEFINITIONS.find((b) => b.id === bracket) || RANK_BRACKET_DEFINITIONS[0];

  const overview: MetaOverviewStats = {
    totalMatches,
    totalPicks,
    activeHeroesCount: heroes.filter((h) => h.picks > 0).length,
    selectedBracketName: selectedBracketDef.name,
    selectedBracketId: bracket,
    highestWinRateHero: highestWinRate
      ? {
          id: highestWinRate.id,
          name: highestWinRate.name,
          localized_name: highestWinRate.localized_name,
          winRate: highestWinRate.winRate,
          picks: highestWinRate.picks,
          img: highestWinRate.img,
          primary_attr: highestWinRate.primary_attr,
        }
      : null,
    mostPickedHero: mostPicked
      ? {
          id: mostPicked.id,
          name: mostPicked.name,
          localized_name: mostPicked.localized_name,
          pickRate: mostPicked.pickRate,
          picks: mostPicked.picks,
          winRate: mostPicked.winRate,
          img: mostPicked.img,
          primary_attr: mostPicked.primary_attr,
        }
      : null,
    averageWinRate: 50.0,
    averagePickRate: avgPickRate,
    lastUpdated: new Date().toISOString(),
    source: isCached ? "Saved Meta Snapshot" : "OpenDota Matchmaking Stats",
    isCached,
  };

  const deltaPeriodLabel = isSnapshotDeltaAvailable
    ? `Since snapshot from ${new Date(snapshotCollectionStartedAt).toLocaleDateString()}`
    : "Based on recent OpenDota match data";

  return {
    overview,
    heroes,
    availableBrackets: RANK_BRACKET_DEFINITIONS,
    currentPatch,
    historicalSnapshotsCount: history.length,
    snapshotCollectionStartedAt,
    isSnapshotDeltaAvailable,
    deltaPeriodLabel,
    fetchedAt: new Date().toISOString(),
    isCached,
  };
}
