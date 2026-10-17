export interface LiquipediaRosterPlayer {
  role: "Carry" | "Midlane" | "Offlane" | "Support" | "Hard Support";
  pos: 1 | 2 | 3 | 4 | 5;
  name: string;
  realName?: string;
  flag?: string;
}

export interface LiquipediaTeamRoster {
  teamName: string;
  tag: string;
  status: "Invited" | "Qualified";
  region: string;
  players: LiquipediaRosterPlayer[];
}

export const KNOWN_ROSTERS: Record<string, LiquipediaTeamRoster> = {
  "team liquid": {
    teamName: "Team Liquid",
    tag: "Liquid",
    status: "Invited",
    region: "Western Europe",
    players: [
      { role: "Carry", pos: 1, name: "miCKe", flag: "SE" },
      { role: "Midlane", pos: 2, name: "Nisha", flag: "PL" },
      { role: "Offlane", pos: 3, name: "SabeRLighT-", flag: "CZ" },
      { role: "Support", pos: 4, name: "Boxi", flag: "SE" },
      { role: "Hard Support", pos: 5, name: "Insânia", flag: "SE" },
    ],
  },
  "team spirit": {
    teamName: "Team Spirit",
    tag: "Spirit",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Yatoro", flag: "UA" },
      { role: "Midlane", pos: 2, name: "Larl", flag: "RU" },
      { role: "Offlane", pos: 3, name: "Collapse", flag: "RU" },
      { role: "Support", pos: 4, name: "Mira", flag: "UA" },
      { role: "Hard Support", pos: 5, name: "Miposhka", flag: "RU" },
    ],
  },
  "betboom team": {
    teamName: "BetBoom Team",
    tag: "BB",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Pure~", flag: "RU" },
      { role: "Midlane", pos: 2, name: "gpk~", flag: "RU" },
      { role: "Offlane", pos: 3, name: "MieRo`", flag: "RU" },
      { role: "Support", pos: 4, name: "Save-", flag: "MD" },
      { role: "Hard Support", pos: 5, name: "TORONTOTOKYO", flag: "RU" },
    ],
  },
  "natus vincere": {
    teamName: "Natus Vincere",
    tag: "NAVI",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Yuragi", flag: "UA" },
      { role: "Midlane", pos: 2, name: "sanctity-", flag: "BY" },
      { role: "Offlane", pos: 3, name: "nefrit", flag: "UA" },
      { role: "Support", pos: 4, name: "Zayac", flag: "KG" },
      { role: "Hard Support", pos: 5, name: "Malady", flag: "KZ" },
    ],
  },
  "parivision": {
    teamName: "PARIVISION",
    tag: "PV",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Crystallis", flag: "NL" },
      { role: "Midlane", pos: 2, name: "No[o]ne-", flag: "UA" },
      { role: "Offlane", pos: 3, name: "DM", flag: "RU" },
      { role: "Support", pos: 4, name: "9Class", flag: "RU" },
      { role: "Hard Support", pos: 5, name: "Dukalis", flag: "RU" },
    ],
  },
  "aurora gaming": {
    teamName: "Aurora Gaming",
    tag: "Aurora",
    status: "Invited",
    region: "Southeast Asia",
    players: [
      { role: "Carry", pos: 1, name: "23", flag: "TH" },
      { role: "Midlane", pos: 2, name: "Lorenof", flag: "UA" },
      { role: "Offlane", pos: 3, name: "Jabz", flag: "TH" },
      { role: "Support", pos: 4, name: "Q", flag: "TH" },
      { role: "Hard Support", pos: 5, name: "Oli", flag: "MY" },
    ],
  },
  "lgd gaming": {
    teamName: "LGD Gaming",
    tag: "LGD",
    status: "Invited",
    region: "China",
    players: [
      { role: "Carry", pos: 1, name: "shiro", flag: "CN" },
      { role: "Midlane", pos: 2, name: "Echo", flag: "CN" },
      { role: "Offlane", pos: 3, name: "niu", flag: "CN" },
      { role: "Support", pos: 4, name: "pyw", flag: "CN" },
      { role: "Hard Support", pos: 5, name: "y`", flag: "CN" },
    ],
  },
  "xtreme gaming": {
    teamName: "Xtreme Gaming",
    tag: "XG",
    status: "Invited",
    region: "China",
    players: [
      { role: "Carry", pos: 1, name: "Ame", flag: "CN" },
      { role: "Midlane", pos: 2, name: "Xm", flag: "CN" },
      { role: "Offlane", pos: 3, name: "Xxs", flag: "CN" },
      { role: "Support", pos: 4, name: "XinQ", flag: "CN" },
      { role: "Hard Support", pos: 5, name: "Dy", flag: "CN" },
    ],
  },
  "og": {
    teamName: "OG",
    tag: "OG",
    status: "Qualified",
    region: "Western Europe",
    players: [
      { role: "Carry", pos: 1, name: "Timado", flag: "PE" },
      { role: "Midlane", pos: 2, name: "bzm", flag: "BG" },
      { role: "Offlane", pos: 3, name: "Wisper", flag: "BO" },
      { role: "Support", pos: 4, name: "Ari", flag: "GB" },
      { role: "Hard Support", pos: 5, name: "Ceb", flag: "FR" },
    ],
  },
  "1w team": {
    teamName: "1w Team",
    tag: "1w",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Munkushi~", flag: "RU" },
      { role: "Midlane", pos: 2, name: "CHIRA_JUNIOR", flag: "RU" },
      { role: "Offlane", pos: 3, name: "Cloud", flag: "RU" },
      { role: "Support", pos: 4, name: "swedenstrong", flag: "UA" },
      { role: "Hard Support", pos: 5, name: "RESPECT", flag: "RU" },
    ],
  },
  "gamerlegion": {
    teamName: "GamerLegion",
    tag: "GL",
    status: "Invited",
    region: "Western Europe",
    players: [
      { role: "Carry", pos: 1, name: "Ulnit", flag: "RO" },
      { role: "Midlane", pos: 2, name: "Adzantick", flag: "GB" },
      { role: "Offlane", pos: 3, name: "Fbz", flag: "ID" },
      { role: "Support", pos: 4, name: "Thiolicor", flag: "BR" },
      { role: "Hard Support", pos: 5, name: "poloson", flag: "SG" },
    ],
  },
  "astra invicta": {
    teamName: "Astra Invicta",
    tag: "AI",
    status: "Invited",
    region: "Western Europe",
    players: [
      { role: "Carry", pos: 1, name: "Daxak", flag: "RU" },
      { role: "Midlane", pos: 2, name: "re1bl", flag: "RU" },
      { role: "Offlane", pos: 3, name: "Petushara", flag: "BY" },
      { role: "Support", pos: 4, name: "Sayuw", flag: "RU" },
      { role: "Hard Support", pos: 5, name: "Fishman", flag: "BY" },
    ],
  },
  "pipsqueak+4": {
    teamName: "Pipsqueak+4",
    tag: "PS",
    status: "Invited",
    region: "Western Europe",
    players: [
      { role: "Carry", pos: 1, name: "Pipsqueak", flag: "FI" },
      { role: "Midlane", pos: 2, name: "Starl1ght", flag: "UA" },
      { role: "Offlane", pos: 3, name: "V1king", flag: "NO" },
      { role: "Support", pos: 4, name: "Blizzy", flag: "KG" },
      { role: "Hard Support", pos: 5, name: "Accell", flag: "RU" },
    ],
  },
  "team tidebound": {
    teamName: "Team Tidebound",
    tag: "TTB",
    status: "Invited",
    region: "Southeast Asia",
    players: [
      { role: "Carry", pos: 1, name: "inYourdReaM", flag: "ID" },
      { role: "Midlane", pos: 2, name: "Mikoto", flag: "ID" },
      { role: "Offlane", pos: 3, name: "kpii", flag: "AU" },
      { role: "Support", pos: 4, name: "Jhocam", flag: "ID" },
      { role: "Hard Support", pos: 5, name: "Whitemon", flag: "ID" },
    ],
  },
  "team yandex": {
    teamName: "Team Yandex",
    tag: "YNDX",
    status: "Invited",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "krylat", flag: "RU" },
      { role: "Midlane", pos: 2, name: "Ainkrad", flag: "BY" },
      { role: "Offlane", pos: 3, name: "Vazya", flag: "RU" },
      { role: "Support", pos: 4, name: "Danial", flag: "KZ" },
      { role: "Hard Support", pos: 5, name: "HappyDyurara", flag: "RU" },
    ],
  },
  "yellow submarine": {
    teamName: "Yellow Submarine",
    tag: "YeS",
    status: "Qualified",
    region: "Eastern Europe",
    players: [
      { role: "Carry", pos: 1, name: "Satanic", flag: "RU" },
      { role: "Midlane", pos: 2, name: "erase", flag: "RU" },
      { role: "Offlane", pos: 3, name: "kasane", flag: "RU" },
      { role: "Support", pos: 4, name: "rue", flag: "RU" },
      { role: "Hard Support", pos: 5, name: "asdekor_r", flag: "RU" },
    ],
  },
};

/**
 * Fallback generator for teams without explicitly hardcoded rosters
 */
export function getRosterForTeam(teamName: string, tag: string, isQualified = false): LiquipediaTeamRoster {
  const normalizedKey = teamName.toLowerCase().trim();
  if (KNOWN_ROSTERS[normalizedKey]) {
    return KNOWN_ROSTERS[normalizedKey];
  }

  // Generate plausible competitive roster
  const cleanTag = tag || teamName.substring(0, 3).toUpperCase();
  return {
    teamName,
    tag: cleanTag,
    status: isQualified ? "Qualified" : "Invited",
    region: "International",
    players: [
      { role: "Carry", pos: 1, name: `${cleanTag}.Ace1` },
      { role: "Midlane", pos: 2, name: `${cleanTag}.Tempo` },
      { role: "Offlane", pos: 3, name: `${cleanTag}.Vanguard` },
      { role: "Support", pos: 4, name: `${cleanTag}.Spark` },
      { role: "Hard Support", pos: 5, name: `${cleanTag}.Warden` },
    ],
  };
}

export interface PrizePlacementItem {
  place: string;
  placeRank: number;
  badgeType: "gold" | "silver" | "bronze" | "standard";
  totalPrizeUsd: number;
  playerPrizeUsd: number;
  clubRewardUsd: number;
  points: number;
  teamName?: string;
  teamTag?: string;
  teamLogo?: string | null;
}

export function generateLiquipediaPrizePool(
  totalPrizeUsd = 1000000,
  topTeams: { name: string; tag?: string; logo_url?: string | null }[] = []
): PrizePlacementItem[] {
  const basePool = totalPrizeUsd > 0 ? totalPrizeUsd : 1000000;

  const tiers = [
    { place: "1st", rank: 1, badge: "gold" as const, pctTotal: 0.16, pctPlayer: 0.14, pctClub: 0.02, pts: 3000 },
    { place: "2nd", rank: 2, badge: "silver" as const, pctTotal: 0.115, pctPlayer: 0.10, pctClub: 0.015, pts: 2500 },
    { place: "3rd", rank: 3, badge: "bronze" as const, pctTotal: 0.078, pctPlayer: 0.0655, pctClub: 0.0125, pts: 2000 },
    { place: "4th", rank: 4, badge: "standard" as const, pctTotal: 0.045, pctPlayer: 0.035, pctClub: 0.01, pts: 1600 },
    { place: "5-6th", rank: 5, badge: "standard" as const, pctTotal: 0.0235, pctPlayer: 0.0135, pctClub: 0.01, pts: 1100 },
    { place: "7-8th", rank: 7, badge: "standard" as const, pctTotal: 0.0175, pctPlayer: 0.0075, pctClub: 0.01, pts: 500 },
    { place: "9-24th", rank: 9, badge: "standard" as const, pctTotal: 0.0075, pctPlayer: 0.0, pctClub: 0.0075, pts: 100 },
  ];

  return tiers.map((tier, idx) => {
    const assignedTeam = topTeams[idx];
    return {
      place: tier.place,
      placeRank: tier.rank,
      badgeType: tier.badge,
      totalPrizeUsd: Math.round(basePool * tier.pctTotal),
      playerPrizeUsd: Math.round(basePool * tier.pctPlayer),
      clubRewardUsd: Math.round(basePool * tier.pctClub),
      points: tier.pts,
      teamName: assignedTeam ? assignedTeam.name : "TBD",
      teamTag: assignedTeam ? assignedTeam.tag : undefined,
      teamLogo: assignedTeam ? assignedTeam.logo_url : null,
    };
  });
}
