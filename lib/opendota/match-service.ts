import {
  NormalizedMatchData,
  MatchPlayerDetailed,
  MatchPlayerItem,
  MatchPlayerPurchaseEvent,
  MatchPlayerAbilityUpgrade,
  MatchLanePairing,
  MatchKillEvent,
  MatchTeamfight,
  MatchObjectiveEvent,
  MatchWardEvent,
  MatchWardDewardedBy,
} from "./match-types";
import { getHeroById, formatGameMode, formatLobbyType, formatDuration } from "./heroes";
import itemsSnapshot from "./items-snapshot.json";

const OPENDOTA_BASE_URL = "https://api.opendota.com/api";
const STEAM_CDN_BASE = "https://cdn.cloudflare.steamstatic.com";
const REQUEST_TIMEOUT_MS = 10000;

interface ItemSnapshotEntry {
  id: number;
  name: string;
  img: string;
  cost?: number | null;
}

const itemsDict: Record<string, ItemSnapshotEntry> = itemsSnapshot as unknown as Record<string, ItemSnapshotEntry>;

/**
 * Resolves item ID to normalized item metadata.
 */
export function resolveItemById(itemId?: number | null): MatchPlayerItem | null {
  if (!itemId || itemId <= 0) return null;
  const item = itemsDict[String(itemId)];
  if (!item) {
    return {
      id: itemId,
      name: `Item #${itemId}`,
      img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/recipe.png`,
    };
  }

  const cleanImg = item.img.startsWith("http")
    ? item.img
    : `${STEAM_CDN_BASE}${item.img.startsWith("/") ? "" : "/"}${item.img.split("?")[0]}`;

  return {
    id: item.id,
    name: item.name,
    img: cleanImg,
    cost: item.cost,
  };
}

// Reverse map item slug (extracted from image URL) to item metadata
const itemSlugMap: Record<string, ItemSnapshotEntry> = {};
for (const entry of Object.values(itemsDict)) {
  if (entry.img) {
    const match = entry.img.match(/\/items\/([^\/\?]+)\.png/);
    if (match) {
      itemSlugMap[match[1].toLowerCase()] = entry;
    }
  }
}

// Well-known Valve internal item code aliases and fallback mappings
const ITEM_ALIASES: Record<string, string> = {
  cyclone: "Eul's Scepter of Divinity",
  sheepstick: "Scythe of Vyse",
  sphere: "Linken's Sphere",
  greater_crit: "Daedalus",
  lesser_crit: "Crystalys",
  invis_sword: "Shadow Blade",
  cuirass: "Assault Cuirass",
  assault: "Assault Cuirass",
  heart: "Heart of Tarrasque",
  skadi: "Eye of Skadi",
  bfury: "Battle Fury",
  ancient_janggo: "Drum of Endurance",
  vladmir: "Vladmir's Offering",
  ultimate_scepter: "Aghanim's Scepter",
  travel_boots: "Boots of Travel",
  travel_boots_2: "Boots of Travel 2",
  pers: "Perseverance",
  flask: "Healing Salve",
  tpscroll: "Town Portal Scroll",
  ward_observer: "Observer Ward",
  ward_sentry: "Sentry Ward",
  ward_dispenser: "Dispenser (Sentry & Observer)",
  branches: "Iron Branch",
  gauntlets: "Gauntlets of Strength",
  slippers: "Slippers of Agility",
  mantle: "Mantle of Intelligence",
  robe: "Robe of the Magi",
  gloves: "Gloves of Haste",
  boots: "Boots of Speed",
  blink: "Blink Dagger",
  magic_stick: "Magic Stick",
  magic_wand: "Magic Wand",
  clarity: "Clarity",
  smoke_of_deceit: "Smoke of Deceit",
  dust: "Dust of Appearance",
  gem: "Gem of True Sight",
  tango: "Tango",
  tango_single: "Tango (Shared)",
  headdress: "Headdress",
  urn_of_shadows: "Urn of Shadows",
  tranquil_boots: "Tranquil Boots",
  phase_boots: "Phase Boots",
  power_treads: "Power Treads",
  arcane_boots: "Arcane Boots",
  ring_of_basilius: "Ring of Basilius",
  buckler: "Buckler",
  medallion_of_courage: "Medallion of Courage",
  solar_crest: "Solar Crest",
  spirit_vessel: "Spirit Vessel",
  pipe: "Pipe of Insight",
  hood_of_defiance: "Hood of Defiance",
  glimmer_cape: "Glimmer Cape",
  force_staff: "Force Staff",
  hurricane_pike: "Hurricane Pike",
  aether_lens: "Aether Lens",
  witch_blade: "Witch Blade",
  heavy_blade: "Witch Blade",
  phylactery: "Phylactery",
  harpoon: "Harpoon",
  disperser: "Disperser",
  parasma: "Parasma",
  khanda: "Khanda",
  revenants_brooch: "Revenant's Brooch",
  gungir: "Gleipnir",
  veil_of_discord: "Veil of Discord",
  diffusal_blade: "Diffusal Blade",
  diffusal_blade_2: "Diffusal Blade Level 2",
  dagon: "Dagon",
  dagon_2: "Dagon Level 2",
  dagon_3: "Dagon Level 3",
  dagon_4: "Dagon Level 4",
  dagon_5: "Dagon Level 5",
  necronomicon: "Necronomicon",
  necronomicon_2: "Necronomicon Level 2",
  necronomicon_3: "Necronomicon Level 3",
  manta: "Manta Style",
  sange: "Sange",
  yasha: "Yasha",
  kaya: "Kaya",
  sange_and_yasha: "Sange and Yasha",
  yasha_and_kaya: "Yasha and Kaya",
  kaya_and_sange: "Kaya and Sange",
  black_king_bar: "Black King Bar",
  bkb: "Black King Bar",
  lotus_orb: "Lotus Orb",
  aeon_disk: "Aeon Disk",
  shivas_guard: "Shiva's Guard",
  bloodstone: "Bloodstone",
  refresher: "Refresher Orb",
  satanic: "Satanic",
  silver_edge: "Silver Edge",
  monkey_king_bar: "Monkey King Bar",
  mkb: "Monkey King Bar",
  radiance: "Radiance",
  butterfly: "Butterfly",
  rapier: "Divine Rapier",
  abyssal_blade: "Abyssal Blade",
  basher: "Skull Basher",
  armlet: "Armlet of Mordiggian",
  desolator: "Desolator",
  mjollnir: "Mjollnir",
  maelstrom: "Maelstrom",
  assault_cuirass: "Assault Cuirass",
  nullifier: "Nullifier",
  octarine_core: "Octarine Core",
  overwhelming_blink: "Overwhelming Blink",
  swift_blink: "Swift Blink",
  arcane_blink: "Arcane Blink",
  wind_waker: "Wind Waker",
  boots_of_bearing: "Boots of Bearing",
  holy_locket: "Holy Locket",
  guardian_greaves: "Guardian Greaves",
  ethereal_blade: "Ethereal Blade",
  moon_shard: "Moon Shard",
  soul_booster: "Soul Booster",
  blood_grenade: "Blood Grenade",
  consecrated_wraps: "Consecrated Wraps",
  shawl: "Nether Shawl",
};

/**
 * Resolves item slug (e.g. "cyclone", "blink", "magic_wand") from purchase_log to real Dota 2 name and asset.
 */
export function resolveItemBySlug(slug: string, cost?: number): { name: string; img: string } {
  if (!slug) {
    return {
      name: "Unknown Item",
      img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/recipe.png`,
    };
  }

  const cleanSlug = slug.toLowerCase().replace(/^item_/, "");

  // Handle recipe purchases (e.g. "recipe_cyclone", "recipe_force_staff")
  if (cleanSlug.startsWith("recipe_") || cleanSlug.startsWith("recipe")) {
    const baseSlug = cleanSlug.replace(/^recipe_?/, "");
    const baseItem = resolveItemBySlug(baseSlug);
    return {
      name: `Recipe: ${baseItem.name}`,
      img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/recipe.png`,
    };
  }

  // 1. Check exact match in itemsSnapshot via reverse slug index
  const snapshotMatch = itemSlugMap[cleanSlug];
  if (snapshotMatch) {
    const cleanImg = snapshotMatch.img.startsWith("http")
      ? snapshotMatch.img
      : `${STEAM_CDN_BASE}${snapshotMatch.img.startsWith("/") ? "" : "/"}${snapshotMatch.img.split("?")[0]}`;

    return {
      name: snapshotMatch.name,
      img: cleanImg,
    };
  }

  // 2. Check explicit known aliases
  if (ITEM_ALIASES[cleanSlug]) {
    return {
      name: ITEM_ALIASES[cleanSlug],
      img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/${cleanSlug}.png`,
    };
  }

  // 3. Fallback: nicely format the slug title case (e.g. "void_stone" -> "Void Stone")
  const formattedName = cleanSlug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    name: formattedName,
    img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/${cleanSlug}.png`,
  };
}

/**
 * Format game seconds (supports negative pre-game timestamps e.g. -01:15).
 */
export function formatGameTimestamp(seconds: number): string {
  const isNegative = seconds < 0;
  const absSec = Math.abs(seconds);
  const mins = Math.floor(absSec / 60);
  const secs = absSec % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  return isNegative ? `-${timeStr}` : timeStr;
}

interface RawMatchResponse {
  match_id: number;
  radiant_win: boolean;
  duration: number;
  start_time: number;
  radiant_score?: number;
  dire_score?: number;
  game_mode: number;
  lobby_type: number;
  region?: number;
  patch?: number;
  version?: number;
  skill?: number;
  replay_url?: string;
  radiant_gold_adv?: number[];
  radiant_xp_adv?: number[];
  teamfights?: RawTeamfight[];
  objectives?: RawObjective[];
  players: RawMatchPlayer[];
  [key: string]: unknown;
}

interface RawTeamfight {
  start: number;
  end: number;
  deaths_pos?: unknown[];
  players?: {
    deaths: number;
    buybacks: number;
    damage: number;
    healing: number;
    gold_delta: number;
    xp_delta: number;
  }[];
  [key: string]: unknown;
}

interface RawObjective {
  time: number;
  type: string;
  key?: string;
  slot?: number;
  player_slot?: number;
  victim_player_slot?: number;
  unit?: string;
  team?: number;
}

interface RawMatchPlayer {
  player_slot: number;
  account_id?: number | null;
  personaname?: string;
  name?: string;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  kda?: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  level: number;
  net_worth: number;
  hero_damage?: number;
  tower_damage?: number;
  hero_healing?: number;
  gold_spent?: number;
  item_0?: number;
  item_1?: number;
  item_2?: number;
  item_3?: number;
  item_4?: number;
  item_5?: number;
  backpack_0?: number;
  backpack_1?: number;
  backpack_2?: number;
  item_neutral?: number;
  aghanims_scepter?: number;
  aghanims_shard?: number;
  moonshard?: number;
  lane?: number;
  lane_role?: number;
  is_roaming?: boolean;
  lh_t?: number[];
  networth_t?: number[];
  deaths_log?: { time: number; key?: string }[];
  purchase_log?: { time: number; key: string; cost?: number }[];
  ability_upgrades_arr?: number[];
  stuns?: number;
  obs_placed?: number;
  sen_placed?: number;
  camps_stacked?: number;
  pings?: number;
  kills_log?: { time: number; key: string }[];
  [key: string]: unknown;
}

const REGION_NAMES: Record<number, string> = {
  1: "US West",
  2: "US East",
  3: "Europe West",
  4: "South Korea",
  5: "SE Asia",
  6: "Dubai",
  7: "Australia",
  8: "Russia",
  9: "Europe East",
  10: "South America",
  11: "South Africa",
  12: "China",
  13: "Peru",
  14: "India",
  15: "Chile",
  16: "Japan",
};

/**
 * Fetch and normalize OpenDota match data.
 */
export async function getMatchAnalysis(
  matchId: string | number,
  options?: { bypassCache?: boolean }
): Promise<NormalizedMatchData> {
  const numericId = typeof matchId === "string" ? matchId.trim() : String(matchId);

  // Validate ID: Positive number up to 64-bit integer
  if (!/^\d{5,12}$/.test(numericId)) {
    throw new Error("Invalid Match ID format. Must be a 5 to 12 digit integer.");
  }

  const apiKey = process.env.OPENDOTA_API_KEY;
  const separator = apiKey ? `?api_key=${apiKey}` : "";
  const url = `${OPENDOTA_BASE_URL}/matches/${numericId}${separator}`;

  let res: Response;
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
      ...(options?.bypassCache
        ? { cache: "no-store" }
        : { next: { revalidate: 300 } }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error("Match request timed out. OpenDota is taking too long to respond.");
    }
    throw new Error("Could not connect to OpenDota match service.");
  }

  if (res.status === 404) {
    throw new Error(`Match ${numericId} was not found on OpenDota. Ensure the Match ID is correct.`);
  }

  if (res.status === 429) {
    throw new Error("OpenDota API rate limit reached. Please wait a moment and try again.");
  }

  if (!res.ok) {
    throw new Error(`OpenDota returned status ${res.status} for match ${numericId}.`);
  }

  const raw: RawMatchResponse = await res.json();
  return normalizeMatch(raw);
}

/**
 * Normalizes raw OpenDota match payload into structured domain model.
 */
function normalizeMatch(raw: RawMatchResponse): NormalizedMatchData {
  const isParsed = Boolean(raw.version && raw.version > 0);
  const matchId = String(raw.match_id);
  const durationSeconds = raw.duration || 0;
  const radiantWin = Boolean(raw.radiant_win);

  // Raw players
  const rawPlayers = Array.isArray(raw.players) ? raw.players : [];

  // Team totals for percentage shares
  let radiantTotalDamage = 0;
  let direTotalDamage = 0;
  let radiantTotalNetWorth = 0;
  let direTotalNetWorth = 0;
  let radiantTotalKills = 0;
  let direTotalKills = 0;

  for (const p of rawPlayers) {
    const isRad = p.player_slot < 128;
    const dmg = Number(p.hero_damage) || 0;
    const nw = Number(p.net_worth) || 0;
    const k = Number(p.kills) || 0;

    if (isRad) {
      radiantTotalDamage += dmg;
      radiantTotalNetWorth += nw;
      radiantTotalKills += k;
    } else {
      direTotalDamage += dmg;
      direTotalNetWorth += nw;
      direTotalKills += k;
    }
  }

  // Normalize individual players
  const allPlayers: MatchPlayerDetailed[] = rawPlayers.map((p) => {
    const isRadiant = p.player_slot < 128;
    const hero = getHeroById(p.hero_id);
    const k = Number(p.kills) || 0;
    const d = Number(p.deaths) || 0;
    const a = Number(p.assists) || 0;
    const kda = d === 0 ? Number((k + a).toFixed(2)) : Number(((k + a) / d).toFixed(2));
    const heroDamage = Number(p.hero_damage) || 0;
    const netWorth = Number(p.net_worth) || 0;

    const teamDamage = isRadiant ? radiantTotalDamage : direTotalDamage;
    const teamKills = isRadiant ? radiantTotalKills : direTotalKills;
    const teamNetWorth = isRadiant ? radiantTotalNetWorth : direTotalNetWorth;

    const damageShare = teamDamage > 0 ? Number(((heroDamage / teamDamage) * 100).toFixed(1)) : 0;
    const killParticipation = teamKills > 0 ? Number((((k + a) / teamKills) * 100).toFixed(1)) : 0;
    const goldShare = teamNetWorth > 0 ? Number(((netWorth / teamNetWorth) * 100).toFixed(1)) : 0;

    // Items
    const items: (MatchPlayerItem | null)[] = [
      resolveItemById(p.item_0),
      resolveItemById(p.item_1),
      resolveItemById(p.item_2),
      resolveItemById(p.item_3),
      resolveItemById(p.item_4),
      resolveItemById(p.item_5),
    ];

    const backpack: (MatchPlayerItem | null)[] = [
      resolveItemById(p.backpack_0),
      resolveItemById(p.backpack_1),
      resolveItemById(p.backpack_2),
    ];

    const neutralItem = resolveItemById(p.item_neutral);

    // Laning metrics (time series at 5, 10, 15 min)
    const lh_t = Array.isArray(p.lh_t) ? p.lh_t : [];
    const nw_t = Array.isArray(p.networth_t) ? p.networth_t : [];
    const deaths_log = Array.isArray(p.deaths_log) ? p.deaths_log : [];

    const lhAt5 = lh_t.length > 5 ? lh_t[5] : null;
    const lhAt10 = lh_t.length > 10 ? lh_t[10] : null;
    const lhAt15 = lh_t.length > 15 ? lh_t[15] : null;

    const netWorthAt5 = nw_t.length > 5 ? nw_t[5] : null;
    const netWorthAt10 = nw_t.length > 10 ? nw_t[10] : null;
    const netWorthAt15 = nw_t.length > 15 ? nw_t[15] : null;

    const earlyDeaths = deaths_log.filter((dEntry) => dEntry.time <= 600).length;

    // Purchase log
    const rawPurchaseLog = Array.isArray(p.purchase_log) ? p.purchase_log : [];
    const purchaseLog: MatchPlayerPurchaseEvent[] = rawPurchaseLog.map((pl) => {
      const resolved = resolveItemBySlug(pl.key, pl.cost);
      return {
        time: pl.time,
        timeFormatted: formatGameTimestamp(pl.time),
        key: pl.key,
        name: resolved.name,
        img: resolved.img,
        cost: pl.cost,
        isStartingItem: pl.time < 0,
      };
    });

    // Ability upgrades
    const rawAbilities = Array.isArray(p.ability_upgrades_arr) ? p.ability_upgrades_arr : [];
    const abilityUpgrades: MatchPlayerAbilityUpgrade[] = rawAbilities.map((abId, idx) => {
      return {
        level: idx + 1,
        abilityId: abId,
        abilityName: `Ability #${abId}`,
        img: `${STEAM_CDN_BASE}/apps/dota2/images/dota_react/abilities/dota_base_ability.png`,
        isTalent: false,
      };
    });

    let laneName = "Roaming / Flexible";
    if (p.lane === 1) laneName = isRadiant ? "Safe Lane (Bot)" : "Safe Lane (Top)";
    if (p.lane === 2) laneName = "Mid Lane";
    if (p.lane === 3) laneName = isRadiant ? "Offlane (Top)" : "Offlane (Bot)";

    let laneDescription = "Roaming";
    if (isRadiant) {
      if (p.lane === 1) laneDescription = "Bottom (Safe)";
      else if (p.lane === 2) laneDescription = "Middle";
      else if (p.lane === 3) laneDescription = "Top (Off)";
    } else {
      if (p.lane === 1) laneDescription = "Bottom (Off)";
      else if (p.lane === 2) laneDescription = "Middle";
      else if (p.lane === 3) laneDescription = "Top (Safe)";
    }

    return {
      playerSlot: p.player_slot,
      accountId: p.account_id || null,
      personaName: p.personaname || p.name || `Player ${p.player_slot % 128 + 1}`,
      isRadiant,
      heroId: hero.id,
      heroName: hero.name,
      heroLocalizedName: hero.localized_name,
      heroImg: hero.img,
      heroIcon: hero.icon || hero.img,
      primaryAttr: (hero.primary_attr as MatchPlayerDetailed["primaryAttr"]) || "str",
      kills: k,
      deaths: d,
      assists: a,
      kda,
      level: Number(p.level) || 1,
      lastHits: Number(p.last_hits) || 0,
      denies: Number(p.denies) || 0,
      goldPerMin: Number(p.gold_per_min) || 0,
      xpPerMin: Number(p.xp_per_min) || 0,
      netWorth,
      goldSpent: Number(p.gold_spent) || 0,
      heroDamage,
      towerDamage: Number(p.tower_damage) || 0,
      heroHealing: Number(p.hero_healing) || 0,
      damageShare,
      killParticipation,
      goldShare,
      items,
      backpack,
      neutralItem,
      hasAghsScepter: Boolean(p.aghanims_scepter),
      hasAghsShard: Boolean(p.aghanims_shard),
      hasMoonshard: Boolean(p.moonshard),
      lane: p.lane || null,
      laneRole: p.lane_role || null,
      laneName,
      laneDescription,
      laneOutcome: "Unavailable",
      roleName: "Support",
      isRoaming: Boolean(p.is_roaming),
      lhAt5,
      lhAt10,
      lhAt15,
      netWorthAt5,
      netWorthAt10,
      netWorthAt15,
      earlyDeaths,
      networthTimeline: nw_t,
      lhTimeline: lh_t,
      purchaseLog,
      abilityUpgrades,
      stunsDuration: Number(p.stuns) || 0,
      obsPlaced: Number(p.obs_placed) || 0,
      senPlaced: Number(p.sen_placed) || 0,
      campsStacked: Number(p.camps_stacked) || 0,
      pings: typeof p.pings === "number" ? p.pings : undefined,
    };
  });

  // Calculate lane outcomes and roles for all players
  for (const laneId of [1, 2, 3] as const) {
    const radPlayers = allPlayers.filter((p) => p.isRadiant && p.lane === laneId);
    const direPlayers = allPlayers.filter((p) => !p.isRadiant && p.lane === laneId);

    const radNW = radPlayers.reduce((sum, p) => sum + (p.netWorthAt10 || 0), 0);
    const direNW = direPlayers.reduce((sum, p) => sum + (p.netWorthAt10 || 0), 0);
    const radLH = radPlayers.reduce((sum, p) => sum + (p.lhAt10 || 0), 0);
    const direLH = direPlayers.reduce((sum, p) => sum + (p.lhAt10 || 0), 0);

    let radOutcome: MatchPlayerDetailed["laneOutcome"] = isParsed ? "Drew" : "Unavailable";
    let direOutcome: MatchPlayerDetailed["laneOutcome"] = isParsed ? "Drew" : "Unavailable";

    if (isParsed && radNW > 0 && direNW > 0) {
      const diff = radNW - direNW;
      const lhDiff = radLH - direLH;
      if (diff > 700 || lhDiff > 18) {
        radOutcome = "Won";
        direOutcome = "Lost";
      } else if (diff < -700 || lhDiff < -18) {
        radOutcome = "Lost";
        direOutcome = "Won";
      }
    }

    // Assign outcome & roles to Radiant players
    // Radiant: Lane 1 = Safelane (Carry & Support), Lane 2 = Mid, Lane 3 = Offlane (Offlane & Support)
    const sortedRad = [...radPlayers].sort((a, b) => {
      const aFarm = (a.lhAt10 ?? a.lastHits) * 50 + (a.netWorthAt10 ?? a.netWorth);
      const bFarm = (b.lhAt10 ?? b.lastHits) * 50 + (b.netWorthAt10 ?? b.netWorth);
      return bFarm - aFarm;
    });
    sortedRad.forEach((p, idx) => {
      p.laneOutcome = radOutcome;
      if (laneId === 2) p.roleName = "Mid";
      else if (laneId === 1) p.roleName = idx === 0 ? "Carry" : "Support";
      else if (laneId === 3) p.roleName = idx === 0 ? "Offlane" : "Support";
    });

    // Assign outcome & roles to Dire players
    // Dire: Lane 1 = Offlane (Offlane & Support), Lane 2 = Mid, Lane 3 = Safelane (Carry & Support)
    const sortedDire = [...direPlayers].sort((a, b) => {
      const aFarm = (a.lhAt10 ?? a.lastHits) * 50 + (a.netWorthAt10 ?? a.netWorth);
      const bFarm = (b.lhAt10 ?? b.lastHits) * 50 + (b.netWorthAt10 ?? b.netWorth);
      return bFarm - aFarm;
    });
    sortedDire.forEach((p, idx) => {
      p.laneOutcome = direOutcome;
      if (laneId === 2) p.roleName = "Mid";
      else if (laneId === 3) p.roleName = idx === 0 ? "Carry" : "Support";
      else if (laneId === 1) p.roleName = idx === 0 ? "Offlane" : "Support";
    });
  }

  const radiantPlayers = allPlayers.filter((p) => p.isRadiant);
  const direPlayers = allPlayers.filter((p) => !p.isRadiant);

  // Lane Pairings Analysis
  const lanePairings = calculateLanePairings(radiantPlayers, direPlayers, isParsed);

  // Kill Events Timeline
  const killEvents = extractCombatKills(allPlayers, rawPlayers);

  // Teamfights
  const teamfights = extractTeamfights(raw.teamfights, allPlayers);

  // Objectives
  const objectives = extractObjectives(raw.objectives, allPlayers);

  // Wards (Vision & Map Control)
  const wards = extractMatchWards(allPlayers, rawPlayers, durationSeconds);

  // Gold & XP timelines
  const rawGoldAdv = Array.isArray(raw.radiant_gold_adv) ? raw.radiant_gold_adv : [];
  const rawXpAdv = Array.isArray(raw.radiant_xp_adv) ? raw.radiant_xp_adv : [];

  const goldAdvantageTimeline = rawGoldAdv.map((adv, idx) => ({
    minute: idx,
    advantage: adv,
  }));

  const xpAdvantageTimeline = rawXpAdv.map((adv, idx) => ({
    minute: idx,
    advantage: adv,
  }));

  const regionName = typeof raw.region === "number" ? REGION_NAMES[raw.region] || `Region #${raw.region}` : "Standard Region";
  const patchStr = typeof raw.patch === "number" ? `Patch ${raw.patch}` : "Current Patch";

  return {
    matchId,
    startTime: raw.start_time,
    startTimeFormatted: new Date(raw.start_time * 1000).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
    radiantWin,
    radiantScore: Number(raw.radiant_score) || radiantTotalKills,
    direScore: Number(raw.dire_score) || direTotalKills,
    gameMode: formatGameMode(raw.game_mode),
    lobbyType: formatLobbyType(raw.lobby_type),
    region: regionName,
    patch: patchStr,
    skillBracket: raw.skill ? `Bracket ${raw.skill}` : "Normal Matchmaking",
    isParsed,
    replayUrl: raw.replay_url || null,
    radiantTeamName: (raw.radiant_name as string) || "Radiant",
    direTeamName: (raw.dire_name as string) || "Dire",
    radiantTeamTotalNetWorth: radiantTotalNetWorth,
    direTeamTotalNetWorth: direTotalNetWorth,
    radiantTeamTotalDamage: radiantTotalDamage,
    direTeamTotalDamage: direTotalDamage,
    radiantPlayers,
    direPlayers,
    allPlayers,
    lanePairings,
    killEvents,
    teamfights,
    objectives,
    wards,
    goldAdvantageTimeline,
    xpAdvantageTimeline,
  };
}

/**
 * Evaluates lane head-to-head performance using transparent 10-minute metrics.
 */
function calculateLanePairings(
  radiant: MatchPlayerDetailed[],
  dire: MatchPlayerDetailed[],
  isParsed: boolean
): MatchLanePairing[] {
  if (!isParsed) {
    return [
      {
        laneName: "Bottom Lane (Radiant Safe vs Dire Off)",
        mapLocation: "Bottom Lane",
        radiantRoleLabel: "Radiant Safelane (Carry & Support)",
        direRoleLabel: "Dire Offlane (Offlaner & Support)",
        radiantPlayers: radiant.filter((p) => p.lane === 1),
        direPlayers: dire.filter((p) => p.lane === 1),
        verdict: "Unavailable",
        netWorthDiffAt10: null,
        lhDiffAt10: null,
        reason: "Replay not parsed. Detailed minute-by-minute CS and Net Worth unavailable.",
      },
      {
        laneName: "Top Lane (Radiant Off vs Dire Safe)",
        mapLocation: "Top Lane",
        radiantRoleLabel: "Radiant Offlane (Offlaner & Support)",
        direRoleLabel: "Dire Safelane (Carry & Support)",
        radiantPlayers: radiant.filter((p) => p.lane === 3),
        direPlayers: dire.filter((p) => p.lane === 3),
        verdict: "Unavailable",
        netWorthDiffAt10: null,
        lhDiffAt10: null,
        reason: "Replay not parsed.",
      },
      {
        laneName: "Middle Lane (Radiant Mid vs Dire Mid)",
        mapLocation: "Middle Lane",
        radiantRoleLabel: "Radiant Midlaner",
        direRoleLabel: "Dire Midlaner",
        radiantPlayers: radiant.filter((p) => p.lane === 2),
        direPlayers: dire.filter((p) => p.lane === 2),
        verdict: "Unavailable",
        netWorthDiffAt10: null,
        lhDiffAt10: null,
        reason: "Replay not parsed.",
      },
    ];
  }

  const pairings: MatchLanePairing[] = [];

  // Helper evaluator
  const evaluateLane = (
    name: string,
    mapLocation: string,
    radiantRoleLabel: string,
    direRoleLabel: string,
    radLanePlayers: MatchPlayerDetailed[],
    direLanePlayers: MatchPlayerDetailed[]
  ): MatchLanePairing => {
    const radNW = radLanePlayers.reduce((sum, p) => sum + (p.netWorthAt10 || 0), 0);
    const direNW = direLanePlayers.reduce((sum, p) => sum + (p.netWorthAt10 || 0), 0);
    const radLH = radLanePlayers.reduce((sum, p) => sum + (p.lhAt10 || 0), 0);
    const direLH = direLanePlayers.reduce((sum, p) => sum + (p.lhAt10 || 0), 0);

    const hasData = radNW > 0 && direNW > 0;
    if (!hasData) {
      return {
        laneName: name,
        mapLocation,
        radiantRoleLabel,
        direRoleLabel,
        radiantPlayers: radLanePlayers,
        direPlayers: direLanePlayers,
        verdict: "Unavailable",
        netWorthDiffAt10: null,
        lhDiffAt10: null,
        reason: "Laning phase data inconclusive or players roamed before 10 min.",
      };
    }

    const nwDiff = radNW - direNW;
    const lhDiff = radLH - direLH;

    let verdict: MatchLanePairing["verdict"] = "Even";
    let reason = "Gold and CS difference at 10 minutes within normal balanced margin (±600g).";

    if (nwDiff > 700 || lhDiff > 18) {
      verdict = "Radiant Favored";
      reason = `Radiant led by +${nwDiff.toLocaleString()} gold and +${lhDiff} CS at 10:00.`;
    } else if (nwDiff < -700 || lhDiff < -18) {
      verdict = "Dire Favored";
      reason = `Dire led by +${Math.abs(nwDiff).toLocaleString()} gold and +${Math.abs(lhDiff)} CS at 10:00.`;
    }

    return {
      laneName: name,
      mapLocation,
      radiantRoleLabel,
      direRoleLabel,
      radiantPlayers: radLanePlayers,
      direPlayers: direLanePlayers,
      verdict,
      netWorthDiffAt10: nwDiff,
      lhDiffAt10: lhDiff,
      reason,
    };
  };

  // 1. Bottom Lane: Radiant Safe (Carry + Support) vs Dire Offlane (Offlaner + Support)
  // Both teams are in Bottom Lane (OpenDota lane 1)
  pairings.push(
    evaluateLane(
      "Radiant Bottom Lane",
      "Bottom Lane (Radiant Safe vs Dire Off)",
      "Radiant Safelane (Carry & Support)",
      "Dire Offlane (Offlaner & Support)",
      radiant.filter((p) => p.lane === 1),
      dire.filter((p) => p.lane === 1)
    )
  );

  // 2. Middle Lane: Radiant Mid vs Dire Mid (OpenDota lane 2)
  pairings.push(
    evaluateLane(
      "Middle Lane",
      "Middle Lane (Radiant Mid vs Dire Mid)",
      "Radiant Midlaner",
      "Dire Midlaner",
      radiant.filter((p) => p.lane === 2),
      dire.filter((p) => p.lane === 2)
    )
  );

  // 3. Top Lane: Radiant Offlane (Offlaner + Support) vs Dire Safelane (Carry + Support)
  // Both teams are in Top Lane (OpenDota lane 3)
  pairings.push(
    evaluateLane(
      "Radiant Top Lane",
      "Top Lane (Radiant Off vs Dire Safe)",
      "Radiant Offlane (Offlaner & Support)",
      "Dire Safelane (Carry & Support)",
      radiant.filter((p) => p.lane === 3),
      dire.filter((p) => p.lane === 3)
    )
  );

  return pairings;
}

/**
 * Extracts and sorts kill events chronologically from player logs.
 */
function extractCombatKills(
  allPlayers: MatchPlayerDetailed[],
  rawPlayers: RawMatchPlayer[]
): MatchKillEvent[] {
  const events: MatchKillEvent[] = [];
  const heroMap = new Map(allPlayers.map((p) => [p.heroName, p]));

  for (const rawP of rawPlayers) {
    const killer = allPlayers.find((p) => p.playerSlot === rawP.player_slot);
    if (!killer) continue;

    const killsLog = Array.isArray(rawP.kills_log) ? rawP.kills_log : [];
    for (const k of killsLog) {
      const victim = heroMap.get(k.key);
      if (victim) {
        events.push({
          time: k.time,
          timeFormatted: formatGameTimestamp(k.time),
          killerHeroId: killer.heroId,
          killerName: killer.heroLocalizedName,
          killerImg: killer.heroImg,
          killerIsRadiant: killer.isRadiant,
          victimHeroId: victim.heroId,
          victimName: victim.heroLocalizedName,
          victimImg: victim.heroImg,
          victimIsRadiant: victim.isRadiant,
          assists: [],
        });
      }
    }
  }

  // Sort chronologically
  events.sort((a, b) => a.time - b.time);
  return events.slice(0, 150); // Keep reasonable cap for performance
}

/**
 * Extracts and maps all placed wards with coordinates, placement time, and duration.
 */
function extractMatchWards(
  allPlayers: MatchPlayerDetailed[],
  rawPlayers: RawMatchPlayer[],
  matchDuration: number
): MatchWardEvent[] {
  const wards: MatchWardEvent[] = [];

  for (const rawP of rawPlayers) {
    const player = allPlayers.find((p) => p.playerSlot === rawP.player_slot);
    if (!player) continue;

    const obsLog = Array.isArray(rawP.obs_log) ? rawP.obs_log : [];
    const senLog = Array.isArray(rawP.sen_log) ? rawP.sen_log : [];
    const obsLeftLog = Array.isArray(rawP.obs_left_log) ? rawP.obs_left_log : [];
    const senLeftLog = Array.isArray(rawP.sen_left_log) ? rawP.sen_left_log : [];

    const processWardList = (
      list: any[],
      type: "observer" | "sentry",
      leftList: any[]
    ) => {
      const defaultDuration = type === "observer" ? 360 : 420;

      list.forEach((item, idx) => {
        let x: number | null = null;
        let y: number | null = null;

        if (typeof item.x === "number" && typeof item.y === "number") {
          x = item.x;
          y = item.y;
        } else if (typeof item.key === "string") {
          try {
            const parsed = JSON.parse(item.key);
            if (Array.isArray(parsed) && parsed.length >= 2) {
              x = Number(parsed[0]);
              y = Number(parsed[1]);
            }
          } catch {
            const parts = item.key.replace(/[\[\]]/g, "").split(",").map((s: string) => Number(s.trim()));
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              x = parts[0];
              y = parts[1];
            }
          }
        } else if (Array.isArray(item.key) && item.key.length >= 2) {
          x = Number(item.key[0]);
          y = Number(item.key[1]);
        }

        if (x === null || y === null || isNaN(x) || isNaN(y)) return;

        // Normalize coordinates to 0..100% percentage
        let normX = 50;
        let normY = 50;

        if (Math.abs(x) > 256 || Math.abs(y) > 256) {
          // Source Engine coordinates (approx -8200 to +8200)
          normX = Math.max(2, Math.min(98, ((x + 8200) / 16400) * 100));
          normY = Math.max(2, Math.min(98, ((8200 - y) / 16400) * 100));
        } else {
          // Standard cell grid (64 to 192)
          normX = Math.max(2, Math.min(98, ((x - 64) / 128) * 100));
          normY = Math.max(2, Math.min(98, (1 - (y - 64) / 128) * 100));
        }

        const placeTime = Number(item.time) || 0;
        
        // Find corresponding left log by ehandle, key, coordinate proximity, or timestamp
        let leftTime = placeTime + defaultDuration;
        let isDewarded = false;
        let dewardedBy: MatchWardDewardedBy | undefined = undefined;

        const matchingLeft = leftList.find((l) => {
          if (item.ehandle && l.ehandle && item.ehandle === l.ehandle) return true;
          if (item.key && l.key && item.key === l.key && l.time >= placeTime) return true;
          if (typeof item.x === "number" && typeof l.x === "number") {
            return Math.abs(item.x - l.x) < 2 && Math.abs(item.y - l.y) < 2 && l.time >= placeTime;
          }
          return l.time >= placeTime && l.time <= placeTime + defaultDuration + 10;
        });

        if (matchingLeft && typeof matchingLeft.time === "number") {
          leftTime = matchingLeft.time;
          const attacker = matchingLeft.attackername ? String(matchingLeft.attackername) : "";

          if (attacker) {
            const killer = allPlayers.find((p) => p.heroName === attacker);
            if (killer) {
              isDewarded = true;
              dewardedBy = {
                heroId: killer.heroId,
                heroName: killer.heroName,
                heroLocalizedName: killer.heroLocalizedName,
                heroImg: killer.heroImg,
                playerName: killer.personaName,
                isRadiant: killer.isRadiant,
              };
            } else if (attacker.includes("creep")) {
              isDewarded = true;
              const isRadCreep = attacker.includes("goodguys");
              dewardedBy = {
                heroName: attacker,
                heroLocalizedName: isRadCreep ? "Radiant Creep" : "Dire Creep",
                heroImg: isRadCreep ? "/images/map/goodguys_tower.png" : "/images/map/badguys_tower.png",
                isRadiant: isRadCreep,
                isCreep: true,
              };
            } else if (attacker.startsWith("npc_dota_hero_")) {
              isDewarded = true;
              const clean = attacker.replace("npc_dota_hero_", "").replace(/_/g, " ");
              dewardedBy = {
                heroName: attacker,
                heroLocalizedName: clean.charAt(0).toUpperCase() + clean.slice(1),
              };
            }
          }

          if (!isDewarded && leftTime - placeTime < defaultDuration - 20) {
            isDewarded = true;
          }
        }

        if (leftTime > matchDuration) {
          leftTime = matchDuration;
        }

        const duration = Math.max(1, leftTime - placeTime);

        wards.push({
          id: `${player.playerSlot}-${type}-${placeTime}-${idx}`,
          type,
          time: placeTime,
          timeFormatted: formatGameTimestamp(placeTime),
          leftTime,
          leftTimeFormatted: formatGameTimestamp(leftTime),
          duration,
          x: Number(normX.toFixed(2)),
          y: Number(normY.toFixed(2)),
          playerSlot: player.playerSlot,
          isRadiant: player.isRadiant,
          heroId: player.heroId,
          heroName: player.heroName,
          heroLocalizedName: player.heroLocalizedName,
          heroImg: player.heroImg,
          isDewarded,
          dewardedBy,
        });
      });
    };

    processWardList(obsLog, "observer", obsLeftLog);
    processWardList(senLog, "sentry", senLeftLog);
  }

  wards.sort((a, b) => a.time - b.time);
  return wards;
}

/**
 * Extracts teamfight structures from parsed replay.
 */
function extractTeamfights(
  rawTeamfights: RawTeamfight[] | undefined,
  allPlayers: MatchPlayerDetailed[]
): MatchTeamfight[] {
  if (!Array.isArray(rawTeamfights) || rawTeamfights.length === 0) return [];

  return rawTeamfights.map((tf, index) => {
    const duration = tf.end - tf.start;
    let radDeaths = 0;
    let direDeaths = 0;
    let goldDelta = 0;
    let xpDelta = 0;

    const deaths: MatchTeamfight["deaths"] = [];

    if (Array.isArray(tf.players)) {
      tf.players.forEach((pStats, pIdx) => {
        const player = allPlayers[pIdx];
        if (!player) return;

        if (pStats.deaths > 0) {
          deaths.push({
            heroId: player.heroId,
            name: player.heroLocalizedName,
            img: player.heroImg,
            isRadiant: player.isRadiant,
          });

          if (player.isRadiant) {
            radDeaths += pStats.deaths;
          } else {
            direDeaths += pStats.deaths;
          }
        }

        if (player.isRadiant) {
          goldDelta += pStats.gold_delta || 0;
          xpDelta += pStats.xp_delta || 0;
        } else {
          goldDelta -= pStats.gold_delta || 0;
          xpDelta -= pStats.xp_delta || 0;
        }
      });
    }

    let outcome: MatchTeamfight["outcome"] = "Even Trade";
    if (direDeaths > radDeaths) outcome = "Radiant Victory";
    else if (radDeaths > direDeaths) outcome = "Dire Victory";

    return {
      fightId: index + 1,
      startTime: tf.start,
      endTime: tf.end,
      startFormatted: formatGameTimestamp(tf.start),
      endFormatted: formatGameTimestamp(tf.end),
      durationSeconds: duration,
      deaths,
      radiantDeaths: radDeaths,
      direDeaths,
      goldDelta,
      xpDelta,
      outcome,
    };
  });
}

/**
 * Formats Dota 2 building keys into clean, human-readable building names.
 * e.g., "npc_dota_goodguys_tower1_mid" -> "Tier 1 Mid Tower"
 */
function formatBuildingName(key: string): { name: string; type: "tower" | "barracks" | "other"; isRadiantBuilding: boolean } {
  const lower = key.toLowerCase();
  const isRadiantBuilding = lower.includes("goodguys");

  let lane = "";
  if (lower.includes("mid")) lane = "Mid";
  else if (lower.includes("top")) lane = "Top";
  else if (lower.includes("bot")) lane = "Bot";

  if (lower.includes("tower1")) {
    return { name: `Tier 1 ${lane} Tower`, type: "tower", isRadiantBuilding };
  }
  if (lower.includes("tower2")) {
    return { name: `Tier 2 ${lane} Tower`, type: "tower", isRadiantBuilding };
  }
  if (lower.includes("tower3")) {
    return { name: `Tier 3 ${lane} Tower`, type: "tower", isRadiantBuilding };
  }
  if (lower.includes("tower4")) {
    return { name: "Tier 4 Ancient Tower", type: "tower", isRadiantBuilding };
  }
  if (lower.includes("range_rax") || lower.includes("ranged_rax")) {
    return { name: `Ranged Barracks (${lane})`, type: "barracks", isRadiantBuilding };
  }
  if (lower.includes("melee_rax")) {
    return { name: `Melee Barracks (${lane})`, type: "barracks", isRadiantBuilding };
  }
  if (lower.includes("fort") || lower.includes("ancient")) {
    return { name: "Ancient (Throne)", type: "other", isRadiantBuilding };
  }

  return { name: "Structure", type: "other", isRadiantBuilding };
}

/**
 * Extracts and maps building, Roshan, Aegis, and First Blood objective events.
 */
function extractObjectives(
  rawObjectives: RawObjective[] | undefined,
  allPlayers: MatchPlayerDetailed[]
): MatchObjectiveEvent[] {
  if (!Array.isArray(rawObjectives)) return [];

  const playerMap = new Map<number, MatchPlayerDetailed>();
  allPlayers.forEach((p) => {
    playerMap.set(p.playerSlot, p);
  });

  return rawObjectives.map((obj) => {
    let type: MatchObjectiveEvent["type"] = "other";
    let desc = "Objective Secured";
    let team: MatchObjectiveEvent["team"] = "Neutral";
    let killerHero: MatchObjectiveEvent["killerHero"] | undefined;
    let victimHero: MatchObjectiveEvent["victimHero"] | undefined;

    const key = (obj.key || "").toLowerCase();
    const objType = (obj.type || "").toLowerCase();

    // 1. FIRST BLOOD
    if (objType.includes("firstblood")) {
      type = "firstblood";
      const killer = obj.player_slot !== undefined ? playerMap.get(obj.player_slot) : undefined;
      const victim = obj.victim_player_slot !== undefined ? playerMap.get(obj.victim_player_slot) : undefined;

      if (killer) {
        team = killer.isRadiant ? "Radiant" : "Dire";
        killerHero = {
          id: killer.heroId,
          name: killer.heroName,
          localizedName: killer.heroLocalizedName,
          img: killer.heroImg,
        };
      }
      if (victim) {
        victimHero = {
          id: victim.heroId,
          name: victim.heroName,
          localizedName: victim.heroLocalizedName,
          img: victim.heroImg,
        };
      }

      if (killer && victim) {
        desc = `${killer.heroLocalizedName} drew First Blood on ${victim.heroLocalizedName}`;
      } else if (killer) {
        desc = `${killer.heroLocalizedName} secured First Blood`;
      } else {
        desc = "First Blood claimed";
      }
    }
    // 2. TOWER & BARRACKS & THRONE DESTROYED
    else if (objType.includes("building") || key.includes("tower") || key.includes("rax") || key.includes("fort")) {
      const bInfo = formatBuildingName(key);
      type = bInfo.type;

      // The destroying team is the opposite of the building owner
      const destroyingTeam: MatchObjectiveEvent["team"] = bInfo.isRadiantBuilding ? "Dire" : "Radiant";
      team = destroyingTeam;

      const killer = obj.player_slot !== undefined ? playerMap.get(obj.player_slot) : undefined;
      if (killer) {
        killerHero = {
          id: killer.heroId,
          name: killer.heroName,
          localizedName: killer.heroLocalizedName,
          img: killer.heroImg,
        };
        desc = `${destroyingTeam} destroyed ${bInfo.name} (${killer.heroLocalizedName})`;
      } else if (obj.unit?.includes("siege")) {
        desc = `${destroyingTeam} destroyed ${bInfo.name} (Catapult)`;
      } else if (obj.unit?.includes("creep")) {
        desc = `${destroyingTeam} destroyed ${bInfo.name} (Creeps)`;
      } else {
        desc = `${destroyingTeam} destroyed ${bInfo.name}`;
      }
    }
    // 3. ROSHAN KILLED
    else if (objType.includes("roshan") || key.includes("roshan")) {
      type = "roshan";
      team = obj.team === 2 ? "Radiant" : obj.team === 3 ? "Dire" : "Neutral";
      const killer = obj.player_slot !== undefined ? playerMap.get(obj.player_slot) : undefined;
      if (killer) {
        killerHero = {
          id: killer.heroId,
          name: killer.heroName,
          localizedName: killer.heroLocalizedName,
          img: killer.heroImg,
        };
        desc = `${team} killed Roshan (${killer.heroLocalizedName})`;
      } else {
        desc = `${team} killed Roshan`;
      }
    }
    // 4. AEGIS CLAIMED
    else if (objType.includes("aegis") || key.includes("aegis")) {
      type = "aegis";
      const carrier = obj.player_slot !== undefined ? playerMap.get(obj.player_slot) : undefined;
      if (carrier) {
        team = carrier.isRadiant ? "Radiant" : "Dire";
        killerHero = {
          id: carrier.heroId,
          name: carrier.heroName,
          localizedName: carrier.heroLocalizedName,
          img: carrier.heroImg,
        };
        desc = `${carrier.heroLocalizedName} claimed the Aegis of the Immortal`;
      } else {
        team = obj.team === 2 ? "Radiant" : obj.team === 3 ? "Dire" : "Neutral";
        desc = "Aegis of the Immortal claimed";
      }
    }

    return {
      time: obj.time,
      timeFormatted: formatGameTimestamp(obj.time),
      type,
      description: desc,
      team,
      playerSlot: obj.player_slot,
      unit: obj.unit,
      killerHero,
      victimHero,
    };
  });
}

/**
 * Sends a parse request to OpenDota queue for an unparsed match.
 */
export async function requestMatchParse(matchId: string | number): Promise<{ jobId?: number; message: string }> {
  const numericId = typeof matchId === "string" ? matchId.trim() : String(matchId);
  const apiKey = process.env.OPENDOTA_API_KEY;
  const separator = apiKey ? `?api_key=${apiKey}` : "";
  const url = `${OPENDOTA_BASE_URL}/request/${numericId}${separator}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Parse request failed with status ${res.status}`);
    }
    const data = await res.json();
    return {
      jobId: data?.job?.jobId,
      message: "Replay parsing requested. Processing usually takes 1-3 minutes on OpenDota.",
    };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Failed to submit parse request to OpenDota.");
  }
}
