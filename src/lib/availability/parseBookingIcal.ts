import ICAL from "ical.js";

export type NormalizedBlockedInterval = {
  startKey: string;
  endKey: string;
};

export type BookingIcalDebug = {
  feedUrl: string;
  fetchStatus?: number;
  contentType?: string | null;
  bodyIsEmpty?: boolean;
  rawHead?: string;
  veventCount?: number;
  normalizedIntervalCount?: number;
};

export type BookingIcalParseResult =
  | {
      ok: true;
      intervals: NormalizedBlockedInterval[];
      debug: BookingIcalDebug;
    }
  | {
      ok: false;
      kind: "fetch_error" | "parse_error" | "token_invalid";
      message: string;
      status?: number;
      debug: BookingIcalDebug;
    };

const FETCH_TIMEOUT_MS = 15_000;
const INVALID_TOKEN_STATUS = 400;
const INVALID_TOKEN_KEYWORD = "Invalid Token";

const ROME_TIME_ZONE = "Europe/Rome";
const romeDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ROME_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export async function fetchAndParseBookingIcal(
  icalUrl: string,
  debugLabel?: string,
): Promise<BookingIcalParseResult> {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.info("[availability][fetch:start]", debugLabel ?? icalUrl, { icalUrl });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(icalUrl, {
        headers: {
          Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8",
        },
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const calendarText = await response.text();
    const rawHead = calendarText.slice(0, 180).replace(/\s+/g, " ").trim();
    const bodyIsEmpty = calendarText.trim().length === 0;

    const isInvalidToken =
      response.status === INVALID_TOKEN_STATUS && calendarText.includes(INVALID_TOKEN_KEYWORD);

    const baseDebug: BookingIcalDebug = {
      feedUrl: icalUrl,
      fetchStatus: response.status,
      contentType: response.headers.get("content-type"),
      bodyIsEmpty,
      rawHead,
    };

    if (process.env.NODE_ENV !== "production") {
      console.info("[availability][fetch]", debugLabel ?? icalUrl, {
        status: response.status,
        ok: response.ok,
        contentType: baseDebug.contentType,
        bodyIsEmpty,
        rawHead,
        isInvalidToken,
      });
    }

    if (isInvalidToken) {
      return {
        ok: false,
        kind: "token_invalid",
        status: response.status,
        debug: {
          ...baseDebug,
          veventCount: 0,
          normalizedIntervalCount: 0,
        },
        message:
          "Il token del calendario Booking non è più valido. Aggiorna il link iCal dal pannello Booking.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        kind: "fetch_error",
        status: response.status,
        debug: {
          ...baseDebug,
          veventCount: 0,
          normalizedIntervalCount: 0,
        },
        message: `Unable to fetch iCal feed (${response.status})`,
      };
    }

    if (bodyIsEmpty) {
      return {
        ok: false,
        kind: "parse_error",
        debug: {
          ...baseDebug,
          veventCount: 0,
          normalizedIntervalCount: 0,
        },
        message: "The iCal feed body is empty.",
      };
    }

    let component;
    try {
      component = new ICAL.Component(ICAL.parse(calendarText));
    } catch (error) {
      return {
        ok: false,
        kind: "parse_error",
        debug: {
          ...baseDebug,
          veventCount: 0,
          normalizedIntervalCount: 0,
        },
        message: error instanceof Error ? error.message : "Unable to parse iCal feed",
      };
    }

    const veventComponents = component.getAllSubcomponents("vevent");
    const intervals = veventComponents.flatMap((vevent) => {
      try {
        const event = new ICAL.Event(vevent);
        const startDate = event.startDate?.toJSDate?.();
        const endDate = event.endDate?.toJSDate?.();

        if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
          return [];
        }

        if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
          return [];
        }

        const startKey = toRomeDateKey(startDate);
        const endKey = toRomeDateKey(endDate);

        return [
          {
            startKey,
            endKey,
          },
        ];
      } catch {
        return [];
      }
    });

    const mergedIntervals = mergeIntervals(intervals);

    if (process.env.NODE_ENV !== "production") {
      console.info("[availability][parsed]", debugLabel ?? icalUrl, {
        veventCount: veventComponents.length,
        intervals: mergedIntervals,
      });
    }

    return {
      ok: true,
      intervals: mergedIntervals,
      debug: {
        ...baseDebug,
        veventCount: veventComponents.length,
        normalizedIntervalCount: mergedIntervals.length,
      },
    };
  } catch (error) {
    return {
      ok: false,
      kind: "fetch_error",
      debug: {
        feedUrl: icalUrl,
        veventCount: 0,
        normalizedIntervalCount: 0,
      },
      message: error instanceof Error ? error.message : "Unable to fetch iCal feed",
    };
  }
}

function toRomeDateKey(date: Date) {
  return romeDateFormatter.format(date);
}

function mergeIntervals(intervals: NormalizedBlockedInterval[]) {
  if (intervals.length <= 1) {
    return intervals;
  }

  const sorted = [...intervals].sort((left, right) => left.startKey.localeCompare(right.startKey));
  const merged: NormalizedBlockedInterval[] = [];

  for (const interval of sorted) {
    const last = merged[merged.length - 1];

    if (!last || last.endKey < interval.startKey) {
      merged.push(interval);
      continue;
    }

    if (interval.endKey > last.endKey) {
      last.endKey = interval.endKey;
    }
  }

  return merged;
}
