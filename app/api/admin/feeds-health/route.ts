import { NextResponse } from "next/server";
import { availabilityFeeds } from "@/src/data/availabilityFeeds";

export const runtime = "nodejs";

type FeedHealth = {
  roomSlug: string;
  roomName: string;
  propertySlug: string;
  ok: boolean;
  message: string;
};

type HealthResult = {
  anyValid: boolean;
  allInvalid: boolean;
  total: number;
  valid: number;
  invalid: number;
  feeds: FeedHealth[];
};

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const results = await Promise.all(
      availabilityFeeds.map(async (feed): Promise<FeedHealth> => {
        try {
          const res = await fetch(feed.icalUrl, {
            headers: { Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8" },
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            const isInvalidToken = res.status === 400 && text.includes("Invalid Token");
            return {
              roomSlug: feed.roomSlug,
              roomName: feed.roomName,
              propertySlug: feed.propertySlug,
              ok: false,
              message: isInvalidToken
                ? "Token non valido"
                : `HTTP ${res.status}`,
            };
          }

          return {
            roomSlug: feed.roomSlug,
            roomName: feed.roomName,
            propertySlug: feed.propertySlug,
            ok: true,
            message: "OK",
          };
        } catch (err) {
          const isTimeout = err instanceof DOMException && err.name === "AbortError";
          return {
            roomSlug: feed.roomSlug,
            roomName: feed.roomName,
            propertySlug: feed.propertySlug,
            ok: false,
            message: isTimeout ? "Timeout" : "Errore di rete",
          };
        }
      }),
    );

    clearTimeout(timeoutId);

    const validCount = results.filter((r) => r.ok).length;
    const invalidCount = results.filter((r) => !r.ok).length;

    const health: HealthResult = {
      anyValid: validCount > 0,
      allInvalid: validCount === 0 && invalidCount > 0,
      total: results.length,
      valid: validCount,
      invalid: invalidCount,
      feeds: results,
    };

    return NextResponse.json(health, {
      headers: {
        // Cache for 5 minutes on CDN/browser
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch {
    clearTimeout(timeoutId);
    return NextResponse.json(
      {
        anyValid: false,
        allInvalid: true,
        total: availabilityFeeds.length,
        valid: 0,
        invalid: availabilityFeeds.length,
        feeds: [],
      },
      { status: 200 },
    );
  }
}
