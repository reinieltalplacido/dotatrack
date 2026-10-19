import { NextResponse } from "next/server";
import { fetchPlayerPeers, OpenDotaError } from "@/lib/opendota/client";

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

    const peers = await fetchPlayerPeers(accountId);

    return NextResponse.json(
      {
        peers,
        count: peers.length,
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
    console.error("Peers API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch teammates data.",
        details: error instanceof Error ? error.message : String(error),
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
