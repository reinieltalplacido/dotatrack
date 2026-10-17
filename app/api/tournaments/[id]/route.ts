import { NextResponse } from "next/server";
import { fetchTournamentDetail, TournamentTelemetryError } from "@/lib/opendota/tournaments";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json(
        { error: "Invalid Tournament ID. Must be a numeric identifier.", statusCode: 400 },
        { status: 400 }
      );
    }

    const detail = await fetchTournamentDetail(numericId);

    return NextResponse.json(detail, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=1800",
      },
    });
  } catch (error: unknown) {
    if (error instanceof TournamentTelemetryError) {
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
