import * as fs from "node:fs";
import * as path from "node:path";

export type IcalFeedEntry = {
  propertySlug: string;
  propertyName: string;
  roomSlug: string;
  roomName: string;
  icalUrl: string;
};

export type IcalFeedsData = {
  feeds: IcalFeedEntry[];
};

const STORE_PATH = path.join(process.cwd(), "data", "ical-feeds.json");

/**
 * Reads the iCal feeds from the persistent JSON file.
 * If the file doesn't exist or is invalid, falls back to the hardcoded
 * feeds in this module (which are a copy of the initial state).
 */
export function readIcalFeeds(): IcalFeedEntry[] {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return getFallbackFeeds();
    }

    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(raw) as IcalFeedsData;

    if (!Array.isArray(data?.feeds) || data.feeds.length === 0) {
      return getFallbackFeeds();
    }

    return data.feeds;
  } catch {
    console.warn("[ical-feeds-store] Failed to read ical-feeds.json — using fallback");
    return getFallbackFeeds();
  }
}

/**
 * Writes the iCal feeds to the persistent JSON file.
 * Only the `icalUrl` field can change — all other fields are preserved.
 * Returns true on success, false on failure.
 */
export function writeIcalFeeds(feeds: IcalFeedEntry[]): boolean {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const data: IcalFeedsData = { feeds };
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[ical-feeds-store] Failed to write ical-feeds.json:", error);
    return false;
  }
}

/**
 * Fallback feeds — used when the JSON file is missing or corrupt.
 * These are the initial hardcoded values.
 */
function getFallbackFeeds(): IcalFeedEntry[] {
  return [
    {
      propertySlug: "3-amici-suites",
      propertyName: "3 Amici Suites",
      roomSlug: "appartamento-carlo",
      roomName: "Appartamento Carlo",
      icalUrl: "https://ical.booking.com/v1/export/t/94c9bf58-5c40-4545-9a8f-3778efaa1a52.ics",
    },
    {
      propertySlug: "3-amici-suites",
      propertyName: "3 Amici Suites",
      roomSlug: "appartamento-dario",
      roomName: "Appartamento Dario",
      icalUrl: "https://ical.booking.com/v1/export/t/a82bf0fb-0787-404d-8dac-c1af64400b9e.ics",
    },
    {
      propertySlug: "3-amici-suites",
      propertyName: "3 Amici Suites",
      roomSlug: "appartamento-pietor",
      roomName: "Appartamento Pietor",
      icalUrl: "https://ical.booking.com/v1/export/t/983aeb20-4863-482d-b4e6-7916357cff39.ics",
    },
    {
      propertySlug: "3-amici-al-teatro",
      propertyName: "3 Amici al Teatro",
      roomSlug: "unita-principale",
      roomName: "3 Amici al Teatro",
      icalUrl: "https://ical.booking.com/v1/export/t/23a4c22a-9cde-414a-8fe3-fef05e84d208.ics",
    },
    {
      propertySlug: "3-amici-al-castello",
      propertyName: "3 Amici al Castello",
      roomSlug: "arco",
      roomName: "Arco",
      icalUrl: "https://ical.booking.com/v1/export/t/0c055433-a778-4882-ad3e-33153e360d9f.ics",
    },
    {
      propertySlug: "3-amici-al-castello",
      propertyName: "3 Amici al Castello",
      roomSlug: "castello",
      roomName: "3 Amici al Castello",
      icalUrl: "https://ical.booking.com/v1/export/t/3fcd0eee-986f-4cc6-81cd-9ea464047db9.ics",
    },
    {
      propertySlug: "3-amici-al-castello",
      propertyName: "3 Amici al Castello",
      roomSlug: "torre",
      roomName: "Torre",
      icalUrl: "https://ical.booking.com/v1/export/t/486258e6-eac9-48be-9725-5d5e29f3728e.ics",
    },
  ];
}
