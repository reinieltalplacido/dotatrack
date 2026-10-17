import { NextRequest, NextResponse } from "next/server";
import { getMatchAnalysis, requestMatchParse } from "@/lib/opendota/match-service";

interface Params {
  params: Promise<{ matchId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { matchId } = await params;

  if (!matchId || !/^\d{5,12}$/.test(matchId)) {
    return NextResponse.json(
      { error: "Invalid Match ID. Must be a 5 to 12 digit integer.", statusCode: 400 },
      { status: 400 }
    );
  }

  try {
    const data = await getMatchAnalysis(matchId);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load match analysis";
    const status = message.includes("not found") ? 404 : message.includes("rate limit") ? 429 : 500;
    return NextResponse.json({ error: message, statusCode: status }, { status });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const { matchId } = await params;

  if (!matchId || !/^\d{5,12}$/.test(matchId)) {
    return NextResponse.json(
      { error: "Invalid Match ID for parse request.", statusCode: 400 },
      { status: 400 }
    );
  }

  try {
    const result = await requestMatchParse(matchId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to request parse";
    return NextResponse.json({ error: message, statusCode: 500 }, { status: 500 });
  }
}
