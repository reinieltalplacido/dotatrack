import { NextResponse } from "next/server";
import { fetchHeroStatsData } from "@/lib/opendota/hero-stats";

export async function GET() {
  try {
    const data = await fetchHeroStatsData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load hero statistics";
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
