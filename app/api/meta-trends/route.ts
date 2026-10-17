import { NextRequest, NextResponse } from "next/server";
import { getMetaTrendsData, RANK_BRACKET_DEFINITIONS } from "@/lib/opendota/meta-snapshots";
import { MetaRankBracket } from "@/lib/opendota/meta-types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawBracket = searchParams.get("bracket") || "all";

  // Validate rank bracket
  const validBrackets = RANK_BRACKET_DEFINITIONS.map((b) => b.id);
  const bracket: MetaRankBracket = validBrackets.includes(rawBracket as MetaRankBracket)
    ? (rawBracket as MetaRankBracket)
    : "all";

  try {
    const data = await getMetaTrendsData(bracket);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load meta trends data";
    return NextResponse.json(
      { error: message, statusCode: 500 },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
