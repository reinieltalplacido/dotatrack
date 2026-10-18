import { NextResponse } from "next/server";
import { fetchOpenDotaPlayerData, OpenDotaError } from "@/lib/opendota/client";

export async function GET(
  _request: Request,
  context: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await context.params;

    if (!accountId || !/^\d+$/.test(accountId)) {
      return NextResponse.json(
        { error: "Invalid Account ID format.", statusCode: 400 },
        { status: 400 }
      );
    }

    const data = await fetchOpenDotaPlayerData(accountId);

    return NextResponse.json(
      {
        allies: data.matchups?.allies || [],
        enemies: data.matchups?.enemies || [],
        lifetimeWinRate: data.lifetime.winRate,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof OpenDotaError) {
      return NextResponse.json(
        { error: error.message, statusCode: error.statusCode },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch player matchups telemetry.", statusCode: 500 },
      { status: 500 }
    );
  }
}
