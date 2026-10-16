import { RankInfo } from "./types";

const MEDAL_NAMES: Record<number, string> = {
  1: "Herald",
  2: "Guardian",
  3: "Crusader",
  4: "Archon",
  5: "Legend",
  6: "Ancient",
  7: "Divine",
  8: "Immortal",
};

const MEDAL_COLORS: Record<number, string> = {
  1: "text-zinc-400 border-zinc-600 bg-zinc-950/60",
  2: "text-amber-300 border-amber-600/50 bg-amber-950/40",
  3: "text-blue-300 border-blue-600/50 bg-blue-950/40",
  4: "text-emerald-300 border-emerald-600/50 bg-emerald-950/40",
  5: "text-red-300 border-red-600/50 bg-red-950/40",
  6: "text-purple-300 border-purple-600/50 bg-purple-950/40",
  7: "text-amber-200 border-amber-500/60 bg-amber-950/50",
  8: "text-rose-400 border-rose-500/70 bg-rose-950/60",
};

export function formatRank(
  rankTier: number | null | undefined,
  leaderboardRank: number | null | undefined
): RankInfo {
  if (!rankTier || rankTier <= 0) {
    return {
      name: "Uncalibrated",
      subtext: "Rank Hidden or Unranked",
      color: "text-zinc-400 border-zinc-700/60 bg-zinc-900/60",
      medal: "Uncalibrated",
    };
  }

  const medalDigit = Math.floor(rankTier / 10);
  const stars = rankTier % 10;
  const medal = MEDAL_NAMES[medalDigit] || "Unknown";
  const color = MEDAL_COLORS[medalDigit] || "text-zinc-300 border-zinc-700 bg-zinc-900";

  if (medalDigit === 8) {
    // Immortal
    if (leaderboardRank && leaderboardRank > 0) {
      return {
        name: `Immortal #${leaderboardRank.toLocaleString()}`,
        subtext: "Top Leaderboard Competitor",
        color,
        medal,
      };
    }
    return {
      name: "Immortal",
      subtext: "Elite Tier Matchmaking",
      color,
      medal,
    };
  }

  const starSuffix = stars > 0 ? ` [${stars}]` : "";
  return {
    name: `${medal}${starSuffix}`,
    subtext: `${medal} Tier • ${stars > 0 ? `${stars} Star${stars > 1 ? "s" : ""}` : "Calibrated"}`,
    color,
    medal,
    stars,
  };
}
