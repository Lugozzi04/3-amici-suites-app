import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";
import { baseFeeds } from "@/src/data/availabilityFeeds";

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

const OVERRIDES_PATH = process.env.ICAL_OVERRIDES_PATH
  ?? path.join(process.cwd(), "src/data/ical-overrides.json");

function loadOverrides(): Record<string, string> {
  try {
    if (fs.existsSync(OVERRIDES_PATH)) {
      const raw = fs.readFileSync(OVERRIDES_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

function getFreshFeeds() {
  const overrides = loadOverrides();
  return baseFeeds.map((feed) => {
    const overrideUrl = overrides[feed.roomSlug];
    return overrideUrl ? { ...feed, icalUrl: overrideUrl } : feed;
  });
}

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const feeds = getFreshFeeds();
    const results = await Promise.all(
      feeds.map(async (feed): Promise<FeedHealth> => {
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
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    clearTimeout(timeoutId);
    const feeds = getFreshFeeds();
    return NextResponse.json(
      {
        anyValid: false,
        allInvalid: true,
        total: feeds.length,
        valid: 0,
        invalid: feeds.length,
        feeds: [],
      },
      { status: 200 },
    );
  }
}
