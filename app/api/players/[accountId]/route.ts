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
        {
          error: "Invalid Account ID format. Expected a numeric 32-bit integer.",
          statusCode: 400,
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const data = await fetchOpenDotaPlayerData(accountId);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
      },
    });
  } catch (error: unknown) {
    if (error instanceof OpenDotaError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode,
        },
        {
          status: error.statusCode,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing player stats.",
        statusCode: 500,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
