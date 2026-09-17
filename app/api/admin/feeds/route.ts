import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";

import { baseFeeds, availabilityStructureMenuOptions } from "@/src/data/availabilityFeeds";
import { getBookingPropertyBySlug } from "@/src/data/bookingLinks";

export const runtime = "nodejs";

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

function getFreshFeeds(): typeof baseFeeds {
  const overrides = loadOverrides();
  return baseFeeds.map((feed) => {
    const overrideUrl = overrides[feed.roomSlug];
    return overrideUrl ? { ...feed, icalUrl: overrideUrl } : feed;
  });
}

/** GET — returns all feeds with current URLs and their status */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 401 });
  }

  const feeds = getFreshFeeds();

  const data = availabilityStructureMenuOptions
    .filter((opt) => opt.propertySlug !== "all")
    .map((opt) => {
      const property = getBookingPropertyBySlug(opt.propertySlug);
      const propertyFeeds = feeds.filter((f) => f.propertySlug === opt.propertySlug);
      return {
        propertySlug: opt.propertySlug,
        propertyName: opt.propertyName,
        bookingUrl: property?.bookingUrl ?? null,
        rooms: propertyFeeds.map((f) => ({
          roomSlug: f.roomSlug,
          roomName: f.roomName,
          icalUrl: f.icalUrl,
        })),
      };
    });

  return NextResponse.json(
    { feeds: data },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}

/** POST — saves iCal URL overrides */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Non autorizzato" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Payload non valido" }, { status: 400 });
  }

  // Validate: only allow URLs that match the expected iCal pattern
  const validOverrides: Record<string, string> = {};
  for (const [roomSlug, url] of Object.entries(body)) {
    if (typeof url !== "string" || url.trim() === "") continue;
    const trimmed = url.trim();
    if (!trimmed.startsWith("https://ical.booking.com/")) {
      return NextResponse.json(
        { message: `URL non valido per ${roomSlug}: deve essere un link di esportazione Booking` },
        { status: 400 },
      );
    }
    validOverrides[roomSlug] = trimmed;
  }

  // Write the overrides file
  try {
    fs.mkdirSync(path.dirname(OVERRIDES_PATH), { recursive: true });
    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(validOverrides, null, 2) + "\n");
  } catch (error) {
    console.error("[admin] Failed to write overrides:", error);
    return NextResponse.json({ message: "Errore durante il salvataggio" }, { status: 500 });
  }

  const count = Object.keys(validOverrides).length;
  return NextResponse.json({
    message: `${count} link iCal aggiornati con successo.`,
    count,
  });
}

function isAuthorized(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn("[admin] ADMIN_PASSWORD not set — blocking all access");
    return false;
  }

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return false;

  return match[1] === password;
}
