import { NextResponse } from "next/server";
import { fetchTournamentsList } from "@/lib/opendota/tournaments";

export async function GET() {
  try {
    const data = await fetchTournamentsList();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load tournaments telemetry";
    return NextResponse.json(
      { error: message, statusCode: 500 },
      { status: 500 }
    );
  }
}
