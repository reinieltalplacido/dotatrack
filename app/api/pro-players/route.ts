import { NextResponse } from "next/server";
import { ALL_PRO_PRESETS, ProPresetPlayer } from "@/lib/pro-players-presets";

interface OpenDotaProPlayerRaw {
  account_id: number;
  steamid?: string;
  avatar?: string;
  avatarmedium?: string;
  avatarfull?: string;
  name?: string;
  personaname?: string;
  loccountrycode?: string;
  country_code?: string;
  fantasy_role?: number;
  team_name?: string;
  is_pro?: boolean;
  last_match_time?: string;
}

// In-memory cache across requests to avoid slamming OpenDota
let cachedResult: { players: ProPresetPlayer[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  const now = Date.now();
  if (!forceRefresh && cachedResult && now - cachedResult.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { players: cachedResult.players, source: "memory_cache" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  try {
    const apiKey = process.env.OPENDOTA_API_KEY;
    const url = `https://api.opendota.com/api/proPlayers${apiKey ? `?api_key=${apiKey}` : ""}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      // Fallback to static presets if OpenDota is unreachable
      return NextResponse.json(
        { players: ALL_PRO_PRESETS, source: "fallback" },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300",
          },
        }
      );
    }

    const proPlayersRaw: OpenDotaProPlayerRaw[] = await res.json();
    const openDotaMap = new Map<string, OpenDotaProPlayerRaw>();

    for (const p of proPlayersRaw) {
      if (p.account_id) {
        openDotaMap.set(String(p.account_id), p);
      }
    }

    // 1. Enrich our curated tier-1 player list with real Steam avatars & info
    const enrichedCurated: ProPresetPlayer[] = ALL_PRO_PRESETS.map((curated) => {
      const live = openDotaMap.get(curated.id);
      return {
        ...curated,
        avatar: live?.avatarfull || live?.avatarmedium || live?.avatar || undefined,
        personaname: live?.personaname || undefined,
        country: live?.loccountrycode || live?.country_code || curated.country,
      };
    });

    // 2. Add other active pro players who have an avatar and verified pro status
    const existingIds = new Set(enrichedCurated.map((p) => p.id));
    const extraPros: ProPresetPlayer[] = [];

    const activePros = proPlayersRaw
      .filter((p) => p.is_pro && p.account_id && !existingIds.has(String(p.account_id)) && (p.name || p.personaname))
      .sort((a, b) => {
        const timeA = a.last_match_time ? new Date(a.last_match_time).getTime() : 0;
        const timeB = b.last_match_time ? new Date(b.last_match_time).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 48);

    for (const p of activePros) {
      const id = String(p.account_id);
      const isSupport = p.fantasy_role === 2;
      extraPros.push({
        id,
        name: p.name || p.personaname || `Pro #${id}`,
        personaname: p.personaname,
        avatar: p.avatarfull || p.avatarmedium || p.avatar,
        role: isSupport ? "Support" : "Carry",
        pos: isSupport ? 4 : 1,
        country: p.loccountrycode || p.country_code || undefined,
      });
    }

    const combined = [...enrichedCurated, ...extraPros];
    const finalPlayers = Array.from(new Map(combined.map((p) => [p.id, p])).values());
    cachedResult = { players: finalPlayers, timestamp: now };

    return NextResponse.json(
      { players: finalPlayers, source: "opendota" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch OpenDota pro players:", error);
    // Graceful fallback to static presets
    return NextResponse.json(
      {
        players: ALL_PRO_PRESETS,
        source: "fallback",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  }
}
