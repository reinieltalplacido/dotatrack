import { HeroInfo } from "./types";
import heroesData from "./heroes-data.json";

interface RawHeroEntry {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  shortName: string;
}

const heroesMap: Record<string, RawHeroEntry> = heroesData as Record<string, RawHeroEntry>;

export function getHeroById(heroId: number | string): HeroInfo {
  const idStr = String(heroId);
  const raw = heroesMap[idStr];

  if (!raw) {
    return {
      id: Number(heroId) || 0,
      name: `unknown_hero_${heroId}`,
      localized_name: `Hero #${heroId}`,
      primary_attr: "str",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png",
      icon: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/pudge.png",
    };
  }

  const shortName = raw.shortName;
  return {
    id: raw.id,
    name: raw.name,
    localized_name: raw.localized_name,
    primary_attr: raw.primary_attr,
    img: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`,
    icon: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${shortName}.png`,
  };
}

export function getHeroImageUrl(heroId: number | string): string {
  return getHeroById(heroId).img;
}

export function formatGameMode(mode: number): string {
  const modes: Record<number, string> = {
    0: "Unknown Mode",
    1: "All Pick",
    2: "Captains Mode",
    3: "Random Draft",
    4: "Single Draft",
    5: "All Random",
    12: "Least Played",
    16: "Captains Draft",
    18: "Ability Draft",
    20: "All Random Deathmatch",
    21: "1v1 Solo Mid",
    22: "Ranked All Pick",
    23: "Turbo",
    24: "Mutation",
  };
  return modes[mode] || "Standard Match";
}

export function formatLobbyType(lobby: number): string {
  const lobbies: Record<number, string> = {
    0: "Unranked",
    1: "Practice",
    2: "Tournament",
    3: "Tutorial",
    4: "Co-op with bots",
    5: "Team Match",
    6: "Solo Queue",
    7: "Ranked Matchmaking",
    8: "1v1 Mid",
    9: "Battle Cup",
  };
  return lobbies[lobby] || "Matchmaking";
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimeAgo(timestampSeconds: number, referenceNowSeconds?: number): string {
  if (!timestampSeconds || timestampSeconds <= 0) return "Unknown";
  let now = referenceNowSeconds;
  if (!now) {
    try {
      now = Math.floor(Date.now() / 1000);
    } catch {
      now = timestampSeconds;
    }
  }
  const diff = Math.max(0, now - timestampSeconds);

  if (diff < 60) return "Just now";
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins}m ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  }
  if (diff < 86400 * 30) {
    const days = Math.floor(diff / 86400);
    return `${days}d ago`;
  }
  if (diff < 86400 * 365) {
    const months = Math.floor(diff / (86400 * 30));
    return `${months}mo ago`;
  }
  const years = Math.floor(diff / (86400 * 365));
  return `${years}y ago`;
}
