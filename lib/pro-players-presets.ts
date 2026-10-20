export interface ProPresetPlayer {
  id: string;
  name: string;
  team: string;
  teamTag: string;
  role: "Carry" | "Midlane" | "Offlane" | "Support" | "Hard Support";
  pos: 1 | 2 | 3 | 4 | 5;
  country?: string;
  badgeColor?: string;
}

export interface ProTeamGroup {
  id: string;
  name: string;
  tag: string;
  color: string;
  players: ProPresetPlayer[];
}

export const PRO_TEAMS: ProTeamGroup[] = [
  {
    id: "spirit",
    name: "Team Spirit",
    tag: "Spirit",
    color: "from-zinc-300 to-zinc-500",
    players: [
      { id: "321580662", name: "Yatoro (Raddan)", team: "Team Spirit", teamTag: "Spirit", role: "Carry", pos: 1, country: "UA" },
      { id: "1044002267", name: "Satanic", team: "Team Spirit", teamTag: "Spirit", role: "Carry", pos: 1, country: "RU" },
      { id: "106305042", name: "Larl", team: "Team Spirit", teamTag: "Spirit", role: "Midlane", pos: 2, country: "RU" },
      { id: "302214028", name: "Collapse", team: "Team Spirit", teamTag: "Spirit", role: "Offlane", pos: 3, country: "RU" },
      { id: "256156323", name: "Mira", team: "Team Spirit", teamTag: "Spirit", role: "Support", pos: 4, country: "UA" },
      { id: "847565596", name: "rue", team: "Team Spirit", teamTag: "Spirit", role: "Support", pos: 4, country: "RU" },
      { id: "113331514", name: "Miposhka", team: "Team Spirit", teamTag: "Spirit", role: "Hard Support", pos: 5, country: "RU" },
    ],
  },
  {
    id: "liquid",
    name: "Team Liquid",
    tag: "Liquid",
    color: "from-sky-400 to-blue-600",
    players: [
      { id: "152962063", name: "miCKe", team: "Team Liquid", teamTag: "Liquid", role: "Carry", pos: 1, country: "SE" },
      { id: "201358612", name: "Nisha", team: "Team Liquid", teamTag: "Liquid", role: "Midlane", pos: 2, country: "PL" },
      { id: "126212866", name: "SabeRLight-", team: "Team Liquid", teamTag: "Liquid", role: "Offlane", pos: 3, country: "CZ" },
      { id: "86698277", name: "33", team: "Team Liquid", teamTag: "Liquid", role: "Offlane", pos: 3, country: "IL" },
      { id: "77490514", name: "Boxi", team: "Team Liquid", teamTag: "Liquid", role: "Support", pos: 4, country: "SE" },
      { id: "54580962", name: "Insânia", team: "Team Liquid", teamTag: "Liquid", role: "Hard Support", pos: 5, country: "SE" },
    ],
  },
  {
    id: "betboom",
    name: "BetBoom Team",
    tag: "BB",
    color: "from-rose-500 to-amber-500",
    players: [
      { id: "331855530", name: "Pure~", team: "BetBoom Team", teamTag: "BB", role: "Carry", pos: 1, country: "RU" },
      { id: "480412663", name: "gpk~", team: "BetBoom Team", teamTag: "BB", role: "Midlane", pos: 2, country: "RU" },
      { id: "165564598", name: "MieRo`", team: "BetBoom Team", teamTag: "BB", role: "Offlane", pos: 3, country: "RU" },
      { id: "317880638", name: "Save-", team: "BetBoom Team", teamTag: "BB", role: "Support", pos: 4, country: "MD" },
      { id: "196878136", name: "Kataomi`", team: "BetBoom Team", teamTag: "BB", role: "Hard Support", pos: 5, country: "RU" },
      { id: "431770905", name: "TORONTOTOKYO", team: "BetBoom Team", teamTag: "BB", role: "Hard Support", pos: 5, country: "RU" },
    ],
  },
  {
    id: "vision",
    name: "PARIVISION",
    tag: "Vision",
    color: "from-indigo-400 to-cyan-500",
    players: [
      { id: "127617979", name: "Crystallis", team: "PARIVISION", teamTag: "Vision", role: "Carry", pos: 1, country: "NL" },
      { id: "106573901", name: "No[o]ne-", team: "PARIVISION", teamTag: "Vision", role: "Midlane", pos: 2, country: "UA" },
      { id: "56351509", name: "DM", team: "PARIVISION", teamTag: "Vision", role: "Offlane", pos: 3, country: "RU" },
      { id: "164199202", name: "9Class", team: "PARIVISION", teamTag: "Vision", role: "Support", pos: 4, country: "RU" },
      { id: "73401082", name: "Dukalis", team: "PARIVISION", teamTag: "Vision", role: "Hard Support", pos: 5, country: "RU" },
    ],
  },
  {
    id: "yandex",
    name: "Team Yandex",
    tag: "Yandex",
    color: "from-yellow-400 to-red-500",
    players: [
      { id: "171262902", name: "watson", team: "Team Yandex", teamTag: "Yandex", role: "Carry", pos: 1, country: "KZ" },
      { id: "312436974", name: "CHIRA_JUNIOR", team: "Team Yandex", teamTag: "Yandex", role: "Midlane", pos: 2, country: "RU" },
      { id: "183719386", name: "ATF (Ammar)", team: "Team Yandex", teamTag: "Yandex", role: "Offlane", pos: 3, country: "JO" },
      { id: "103735745", name: "Saksa", team: "Team Yandex", teamTag: "Yandex", role: "Support", pos: 4, country: "MK" },
      { id: "93817671", name: "Maladych", team: "Team Yandex", teamTag: "Yandex", role: "Hard Support", pos: 5, country: "KZ" },
    ],
  },
  {
    id: "1win",
    name: "1win Team",
    tag: "1win",
    color: "from-emerald-400 to-teal-600",
    players: [
      { id: "904131336", name: "Munkushi~", team: "1win Team", teamTag: "1win", role: "Carry", pos: 1, country: "RU" },
      { id: "312436974", name: "CHIRA_JUNIOR", team: "1win Team", teamTag: "1win", role: "Midlane", pos: 2, country: "RU" },
      { id: "168126336", name: "Cloud", team: "1win Team", teamTag: "1win", role: "Offlane", pos: 3, country: "RU" },
      { id: "175311897", name: "swedenstrong", team: "1win Team", teamTag: "1win", role: "Support", pos: 4, country: "RU" },
      { id: "123787715", name: "RESPECT", team: "1win Team", teamTag: "1win", role: "Hard Support", pos: 5, country: "RU" },
    ],
  },
  {
    id: "aurora",
    name: "Aurora Gaming",
    tag: "Aurora",
    color: "from-orange-400 to-rose-600",
    players: [
      { id: "375507918", name: "23savage (23)", team: "Aurora Gaming", teamTag: "Aurora", role: "Carry", pos: 1, country: "TH" },
      { id: "124801257", name: "Nightfall", team: "Aurora Gaming", teamTag: "Aurora", role: "Carry", pos: 1, country: "RU" },
      { id: "210053851", name: "Lorenof", team: "Aurora Gaming", teamTag: "Aurora", role: "Midlane", pos: 2, country: "UA" },
      { id: "858106446", name: "kiyotaka", team: "Aurora Gaming", teamTag: "Aurora", role: "Midlane", pos: 2, country: "RU" },
      { id: "126842529", name: "Ws`", team: "Aurora Gaming", teamTag: "Aurora", role: "Offlane", pos: 3, country: "MY" },
      { id: "100471531", name: "Jabz", team: "Aurora Gaming", teamTag: "Aurora", role: "Support", pos: 4, country: "TH" },
      { id: "101259972", name: "Oli", team: "Aurora Gaming", teamTag: "Aurora", role: "Hard Support", pos: 5, country: "MY" },
      { id: "320219866", name: "kaori", team: "Aurora Gaming", teamTag: "Aurora", role: "Hard Support", pos: 5, country: "UA" },
    ],
  },
  {
    id: "og",
    name: "OG",
    tag: "OG",
    color: "from-rose-500 to-indigo-600",
    players: [
      { id: "97658618", name: "Timado", team: "OG", teamTag: "OG", role: "Carry", pos: 1, country: "PE" },
      { id: "93618577", name: "bzm", team: "OG", teamTag: "OG", role: "Midlane", pos: 2, country: "BG" },
      { id: "88271237", name: "Ceb", team: "OG", teamTag: "OG", role: "Offlane", pos: 3, country: "FR" },
      { id: "346412363", name: "Ari", team: "OG", teamTag: "OG", role: "Support", pos: 4, country: "GB" },
      { id: "100594231", name: "skem", team: "OG", teamTag: "OG", role: "Hard Support", pos: 5, country: "PH" },
    ],
  },
  {
    id: "legends",
    name: "Iconic Legends",
    tag: "LEGENDS",
    color: "from-amber-400 to-rose-500",
    players: [
      { id: "87278757", name: "Puppey", team: "Team Secret", teamTag: "Secret", role: "Hard Support", pos: 5, country: "EE" },
      { id: "70388657", name: "Dendi", team: "B8 Esports", teamTag: "B8", role: "Midlane", pos: 2, country: "UA" },
      { id: "32158079", name: "Arteezy", team: "Shopify Rebellion", teamTag: "SR", role: "Carry", pos: 1, country: "CA" },
      { id: "111620041", name: "Topson", team: "Tundra Esports", teamTag: "Tundra", role: "Midlane", pos: 2, country: "FI" },
      { id: "105248644", name: "Miracle-", team: "Nigma Galaxy", teamTag: "NGX", role: "Carry", pos: 1, country: "JO" },
    ],
  },
];

export const ALL_PRO_PRESETS: ProPresetPlayer[] = PRO_TEAMS.flatMap((t) => t.players);
