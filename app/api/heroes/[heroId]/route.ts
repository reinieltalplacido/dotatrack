import { NextResponse } from "next/server";
import { fetchHeroDetailData, HeroTelemetryError } from "@/lib/opendota/hero-stats";

export async function GET(
  _request: Request,
  context: { params: Promise<{ heroId: string }> }
) {
  try {
    const { heroId } = await context.params;
    const numericId = parseInt(heroId, 10);

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json(
        { error: "Invalid hero ID. Expected a positive integer.", statusCode: 400 },
        { status: 400 }
      );
    }

    const detail = await fetchHeroDetailData(numericId);

    return NextResponse.json(detail, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=7200, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    if (error instanceof HeroTelemetryError) {
      return NextResponse.json(
        { error: error.message, statusCode: error.statusCode },
        { status: error.statusCode }
      );
    }
    const message = error instanceof Error ? error.message : "Internal telemetry error";
    return NextResponse.json(
      { error: message, statusCode: 500 },
      { status: 500 }
    );
  }
}
