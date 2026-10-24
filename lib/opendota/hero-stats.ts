import {
  EnrichedHeroSummary,
  HeroAbilityDetail,
  HeroAghsUpgrade,
  HeroCompendiumPayload,
  HeroDetailDeepDive,
  HeroMatchup,
  HeroOverviewMetrics,
  HeroTalentTier,
  PopularItemDetail,
  PrimaryAttrType,
  RankBracketStat,
} from "./hero-types";
import { getHeroById } from "./heroes";
import fallbackSnapshot from "./hero-stats-snapshot.json";
import itemsSnapshot from "./items-snapshot.json";
import heroAbilitiesSnapshot from "./hero-abilities-snapshot.json";
import abilityDetailsSnapshot from "./ability-details-snapshot.json";
import aghsDescSnapshot from "./aghs-desc-snapshot.json";

const OPENDOTA_BASE_URL = "https://api.opendota.com/api";
const STEAM_CDN_BASE = "https://cdn.cloudflare.steamstatic.com";
const REQUEST_TIMEOUT_MS = 8000;

const BRACKET_NAMES: Record<number, string> = {
  1: "Herald",
  2: "Guardian",
  3: "Crusader",
  4: "Archon",
  5: "Legend",
  6: "Ancient",
  7: "Divine",
  8: "Immortal",
};

export class HeroTelemetryError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "HeroTelemetryError";
    this.statusCode = statusCode;
  }
}

/**
 * Normalizes OpenDota image URLs to the official Steam CDN.
 */
export function normalizeCdnUrl(path?: string | null): string {
  if (!path) return "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing query params like ? or ?t=... if present
  const [base] = cleanPath.split("?");
  return `${STEAM_CDN_BASE}${base}`;
}

/**
 * Fetches an endpoint with configurable timeout and Next.js revalidation.
 */
async function fetchWithTimeout<T>(endpoint: string, revalidateSeconds = 3600): Promise<T> {
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
      throw new HeroTelemetryError("Upstream OpenDota request timed out.", 504);
    }
    throw new HeroTelemetryError("Failed to connect to OpenDota hero stats service.", 502);
  }

  if (response.status === 429) {
    throw new HeroTelemetryError("OpenDota API rate limit reached.", 429);
  }

  if (!response.ok) {
    throw new HeroTelemetryError(
      `OpenDota service returned status ${response.status}.`,
      response.status >= 500 ? 502 : response.status
    );
  }

  return (await response.json()) as T;
}

interface RawHeroStatEntry {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  legs?: number;
  img?: string;
  icon?: string;
  base_health?: number;
  base_health_regen?: number;
  base_mana?: number;
  base_mana_regen?: number;
  base_armor?: number;
  base_mr?: number;
  base_attack_min?: number;
  base_attack_max?: number;
  base_str?: number;
  base_agi?: number;
  base_int?: number;
  str_gain?: number;
  agi_gain?: number;
  int_gain?: number;
  attack_range?: number;
  projectile_speed?: number;
  attack_rate?: number;
  move_speed?: number;
  turn_rate?: number | null;
  cm_enabled?: boolean;
  pub_pick?: number;
  pub_win?: number;
  pro_pick?: number;
  pro_win?: number;
  pro_ban?: number;
  turbo_picks?: number;
  turbo_wins?: number;
  [key: string]: unknown;
}

/**
 * Processes raw OpenDota hero stats into normalized and enriched telemetry.
 */
function processHeroStats(rawHeroes: RawHeroStatEntry[], isCached = false): HeroCompendiumPayload {
  const totalPubPicks = rawHeroes.reduce((sum, h) => sum + (Number(h.pub_pick) || 0), 0);
  const totalPubMatches = totalPubPicks > 0 ? Math.round(totalPubPicks / 10) : 1;

  const heroes: EnrichedHeroSummary[] = rawHeroes.map((raw) => {
    const pubPick = Number(raw.pub_pick) || 0;
    const pubWin = Number(raw.pub_win) || 0;
    const winRate = pubPick > 0 ? Number(((pubWin / pubPick) * 100).toFixed(2)) : 0;
    const pickRate = totalPubMatches > 0 ? Number(((pubPick / totalPubMatches) * 100).toFixed(2)) : 0;

    const proPick = Number(raw.pro_pick) || 0;
    const proWin = Number(raw.pro_win) || 0;
    const proBan = Number(raw.pro_ban) || 0;
    const proWinRate = proPick > 0 ? Number(((proWin / proPick) * 100).toFixed(2)) : 0;

    const turboPicks = Number(raw.turbo_picks) || 0;
    const turboWins = Number(raw.turbo_wins) || 0;
    const turboWinRate = turboPicks > 0 ? Number(((turboWins / turboPicks) * 100).toFixed(2)) : 0;

    // Process rank brackets 1 through 8
    const brackets: RankBracketStat[] = [];
    for (let b = 1; b <= 8; b++) {
      const bPick = Number(raw[`${b}_pick`]) || 0;
      const bWin = Number(raw[`${b}_win`]) || 0;
      const bWinRate = bPick > 0 ? Number(((bWin / bPick) * 100).toFixed(2)) : 0;
      brackets.push({
        bracketId: b,
        bracketName: BRACKET_NAMES[b] || `Bracket ${b}`,
        picks: bPick,
        wins: bWin,
        winRate: bWinRate,
      });
    }

    const primaryAttr = (raw.primary_attr as PrimaryAttrType) || "str";

    return {
      id: raw.id,
      name: raw.name,
      localized_name: raw.localized_name || `Hero ${raw.id}`,
      primary_attr: primaryAttr,
      attack_type: (raw.attack_type as "Melee" | "Ranged") || "Melee",
      roles: Array.isArray(raw.roles) ? raw.roles : [],
      legs: Number(raw.legs) || 2,
      img: normalizeCdnUrl(raw.img),
      icon: normalizeCdnUrl(raw.icon),

      base_health: Number(raw.base_health) || 200,
      base_health_regen: Number(raw.base_health_regen) || 0.25,
      base_mana: Number(raw.base_mana) || 75,
      base_mana_regen: Number(raw.base_mana_regen) || 0,
      base_armor: Number(raw.base_armor) || 0,
      base_mr: Number(raw.base_mr) || 25,
      base_attack_min: Number(raw.base_attack_min) || 20,
      base_attack_max: Number(raw.base_attack_max) || 30,
      base_str: Number(raw.base_str) || 20,
      base_agi: Number(raw.base_agi) || 20,
      base_int: Number(raw.base_int) || 20,
      str_gain: Number(raw.str_gain) || 2.0,
      agi_gain: Number(raw.agi_gain) || 2.0,
      int_gain: Number(raw.int_gain) || 2.0,
      attack_range: Number(raw.attack_range) || 150,
      projectile_speed: Number(raw.projectile_speed) || 900,
      attack_rate: Number(raw.attack_rate) || 1.7,
      move_speed: Number(raw.move_speed) || 300,
      turn_rate: typeof raw.turn_rate === "number" ? raw.turn_rate : 0.6,
      cm_enabled: Boolean(raw.cm_enabled),

      pub_pick: pubPick,
      pub_win: pubWin,
      winRate,
      pickRate,

      pro_pick: proPick,
      pro_win: proWin,
      pro_ban: proBan,
      proWinRate,

      turbo_picks: turboPicks,
      turbo_wins: turboWins,
      turboWinRate,

      brackets,
    };
  });

  // Calculate overview metrics from real data
  // 1. Strongest win rate hero (minimum 5,000 pub picks to prevent 1-game anomalies)
  const qualifiedForWinRate = heroes.filter((h) => h.pub_pick >= 5000);
  const pool = qualifiedForWinRate.length > 0 ? qualifiedForWinRate : heroes;
  const strongest = [...pool].sort((a, b) => b.winRate - a.winRate)[0] || null;

  // 2. Most picked hero
  const mostPicked = [...heroes].sort((a, b) => b.pub_pick - a.pub_pick)[0] || null;

  // 3. Most banned hero (pro)
  const mostBanned = [...heroes].sort((a, b) => b.pro_ban - a.pro_ban)[0] || null;

  const metrics: HeroOverviewMetrics = {
    totalHeroes: heroes.length,
    strongestHero: strongest
      ? {
          id: strongest.id,
          name: strongest.name,
          localized_name: strongest.localized_name,
          winRate: strongest.winRate,
          picks: strongest.pub_pick,
          wins: strongest.pub_win,
          img: strongest.img,
          primary_attr: strongest.primary_attr,
        }
      : null,
    mostPickedHero: mostPicked
      ? {
          id: mostPicked.id,
          name: mostPicked.name,
          localized_name: mostPicked.localized_name,
          pickRate: mostPicked.pickRate,
          picks: mostPicked.pub_pick,
          winRate: mostPicked.winRate,
          img: mostPicked.img,
          primary_attr: mostPicked.primary_attr,
        }
      : null,
    mostBannedHero: mostBanned
      ? {
          id: mostBanned.id,
          name: mostBanned.name,
          localized_name: mostBanned.localized_name,
          bans: mostBanned.pro_ban,
          img: mostBanned.img,
          primary_attr: mostBanned.primary_attr,
        }
      : null,
    totalPubMatches,
    totalPubPicks,
    lastUpdated: new Date().toISOString(),
    source: isCached ? "Cached Stats Archive" : "OpenDota Live Stats",
    isCachedFallback: isCached,
  };

  return {
    heroes,
    metrics,
    fetchedAt: new Date().toISOString(),
    isCached,
  };
}

/**
 * Fetches hero compendium data server-side with resilience.
 * Falls back to local snapshot if upstream is unavailable.
 */
export async function fetchHeroStatsData(): Promise<HeroCompendiumPayload> {
  try {
    const rawData = await fetchWithTimeout<RawHeroStatEntry[]>("/heroStats", 3600);
    if (Array.isArray(rawData) && rawData.length > 0) {
      return processHeroStats(rawData, false);
    }
  } catch (err: unknown) {
    console.warn("OpenDota /heroStats fetch error, using resilient telemetry snapshot:", err);
  }

  // Graceful fallback to verified snapshot
  return processHeroStats(fallbackSnapshot as unknown as RawHeroStatEntry[], true);
}

interface RawMatchup {
  hero_id: number;
  games_played: number;
  wins: number;
}

interface RawItemPopularity {
  start_game_items?: Record<string, number>;
  early_game_items?: Record<string, number>;
  mid_game_items?: Record<string, number>;
  late_game_items?: Record<string, number>;
}

interface ItemMetadata {
  id: number;
  name: string;
  img: string;
  cost?: number | null;
}

const itemsMap = itemsSnapshot as unknown as Record<string, ItemMetadata>;

/**
 * Resolves item ID to metadata and popularity count.
 */
function mapItemPopularity(
  phaseMap?: Record<string, number>,
  limit = 8
): PopularItemDetail[] {
  if (!phaseMap) return [];
  const entries = Object.entries(phaseMap);
  return entries
    .map(([itemIdStr, count]) => {
      const id = parseInt(itemIdStr, 10);
      const meta = itemsMap[itemIdStr] || {
        id,
        name: `Item #${id}`,
        img: "/apps/dota2/images/dota_react/items/blink.png",
      };
      return {
        id,
        name: meta.name,
        img: normalizeCdnUrl(meta.img),
        cost: meta.cost,
        count: Number(count) || 0,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

interface RawAbilityAttribute {
  key: string;
  header: string;
  value: string | string[];
  generated?: boolean;
}

interface RawAbilityDetail {
  dname?: string;
  behavior?: string | string[];
  dmg_type?: string;
  bkbpierce?: string;
  dispellable?: string;
  desc?: string;
  attrib?: RawAbilityAttribute[];
  lore?: string;
  mc?: string | string[];
  cd?: string | string[];
  img?: string;
}

const heroAbilitiesMap = heroAbilitiesSnapshot as unknown as Record<
  string,
  { abilities?: string[]; talents?: { name: string; level: number }[] }
>;
const abilityDetailsMap = abilityDetailsSnapshot as unknown as Record<string, RawAbilityDetail>;

/**
 * Extracts abilities and talent tree branches for a hero.
 */
export function getHeroAbilitiesAndTalents(heroName: string): {
  abilities: HeroAbilityDetail[];
  talents: HeroTalentTier[];
} {
  const heroEntry = heroAbilitiesMap[heroName];
  if (!heroEntry) {
    return { abilities: [], talents: [] };
  }

  const abilities: HeroAbilityDetail[] = [];
  if (Array.isArray(heroEntry.abilities)) {
    for (const abName of heroEntry.abilities) {
      if (abName === "generic_hidden") continue;
      const detail = abilityDetailsMap[abName];
      if (!detail || !detail.dname) continue;

      const imgPath = detail.img || `/apps/dota2/images/dota_react/abilities/${abName}.png`;
      abilities.push({
        name: abName,
        dname: detail.dname,
        behavior: detail.behavior,
        dmg_type: detail.dmg_type,
        bkbpierce: detail.bkbpierce,
        dispellable: detail.dispellable,
        desc: detail.desc || "No description available.",
        attrib: Array.isArray(detail.attrib)
          ? detail.attrib.filter(
              (at) =>
                at.header &&
                at.header.trim().length > 0 &&
                at.value !== undefined &&
                at.value !== "0" &&
                at.value !== "00" &&
                !at.key.includes("abilitycastpoint") &&
                !at.key.includes("vector_target")
            )
          : undefined,
        lore: detail.lore,
        mc: detail.mc,
        cd: detail.cd,
        img: normalizeCdnUrl(imgPath),
      });
    }
  }

  const talents: HeroTalentTier[] = [];
  if (Array.isArray(heroEntry.talents) && heroEntry.talents.length >= 8) {
    // 4 Tiers: Level 25 (top) down to Level 10 (bottom)
    const tiers = [
      { level: 25, leftIdx: 6, rightIdx: 7 },
      { level: 20, leftIdx: 4, rightIdx: 5 },
      { level: 15, leftIdx: 2, rightIdx: 3 },
      { level: 10, leftIdx: 0, rightIdx: 1 },
    ];

    for (const tier of tiers) {
      const leftTalent = heroEntry.talents[tier.leftIdx];
      const rightTalent = heroEntry.talents[tier.rightIdx];

      talents.push({
        level: tier.level,
        left: {
          name: leftTalent.name,
          dname: abilityDetailsMap[leftTalent.name]?.dname || leftTalent.name,
        },
        right: {
          name: rightTalent.name,
          dname: abilityDetailsMap[rightTalent.name]?.dname || rightTalent.name,
        },
      });
    }
  }

  return { abilities, talents };
}

const aghsMap = (aghsDescSnapshot as unknown as HeroAghsUpgrade[]).reduce((acc, curr) => {
  acc[curr.hero_id] = curr;
  return acc;
}, {} as Record<number, HeroAghsUpgrade>);

export function getHeroAghsUpgrade(heroId: number): HeroAghsUpgrade | null {
  return aghsMap[heroId] || null;
}

/**
 * Fetches deep-dive hero details including skills, talents, matchups, and item build popularity.
 */
export async function fetchHeroDetailData(heroId: number): Promise<HeroDetailDeepDive> {
  const compendium = await fetchHeroStatsData();
  const hero = compendium.heroes.find((h) => h.id === heroId);

  if (!hero) {
    throw new HeroTelemetryError(`Hero with ID ${heroId} not found in database.`, 404);
  }

  const { abilities, talents } = getHeroAbilitiesAndTalents(hero.name);
  const aghs = getHeroAghsUpgrade(heroId);

  let bestMatchups: HeroMatchup[] = [];
  let worstMatchups: HeroMatchup[] = [];
  let itemPopularityResult = null;

  try {
    const [matchupsRes, itemsRes] = await Promise.allSettled([
      fetchWithTimeout<RawMatchup[]>(`/heroes/${heroId}/matchups`, 7200),
      fetchWithTimeout<RawItemPopularity>(`/heroes/${heroId}/itemPopularity`, 7200),
    ]);

    if (matchupsRes.status === "fulfilled" && Array.isArray(matchupsRes.value)) {
      const validMatchups: HeroMatchup[] = matchupsRes.value
        .filter((m) => m.games_played >= 15) // min sample size for statistical validity
        .map((m) => {
          const winRate = m.games_played > 0 ? Number(((m.wins / m.games_played) * 100).toFixed(1)) : 0;
          return {
            hero_id: m.hero_id,
            games_played: m.games_played,
            wins: m.wins,
            winRate,
            opponentHero: getHeroById(m.hero_id),
          };
        });

      // Best matchups (highest win rate for this hero)
      bestMatchups = [...validMatchups].sort((a, b) => b.winRate - a.winRate).slice(0, 6);

      // Worst matchups / counters (lowest win rate for this hero)
      worstMatchups = [...validMatchups].sort((a, b) => a.winRate - b.winRate).slice(0, 6);
    }

    if (itemsRes.status === "fulfilled" && itemsRes.value) {
      itemPopularityResult = {
        startGame: mapItemPopularity(itemsRes.value.start_game_items, 6),
        earlyGame: mapItemPopularity(itemsRes.value.early_game_items, 6),
        midGame: mapItemPopularity(itemsRes.value.mid_game_items, 6),
        lateGame: mapItemPopularity(itemsRes.value.late_game_items, 6),
      };
    }
  } catch (err) {
    console.warn(`Could not load secondary telemetry for hero #${heroId}:`, err);
  }

  return {
    hero,
    abilities,
    talents,
    aghs,
    bestMatchups,
    worstMatchups,
    itemPopularity: itemPopularityResult,
    fetchedAt: new Date().toISOString(),
  };
}
