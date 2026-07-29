import { getBookingPropertyBySlug } from "@/src/data/bookingLinks";
import {
  ALL_AVAILABILITY_STRUCTURE_SLUG,
  availabilityStructureMenuOptions,
  getAllFeeds,
  getFeedsForProperty,
} from "@/src/data/availabilityFeeds";
import { fetchAndParseBookingIcal, type BookingIcalDebug } from "@/src/lib/availability/parseBookingIcal";

export type AvailabilityStatus = "available" | "unavailable" | "unverifiable";

export type AvailabilitySummaryStatus = "success" | "partial" | "error" | "missing-feeds";

export type AvailabilityFeedDebug = BookingIcalDebug & {
  propertySlug: string;
  propertyName: string;
  roomSlug: string;
  roomName: string;
  status: AvailabilityStatus;
  overlap?: boolean;
  errorKind?: "fetch_error" | "parse_error" | "token_invalid";
  errorMessage?: string;
};

export type AvailabilityDebugTrace = {
  propertySlug: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  summaryStatus: AvailabilitySummaryStatus;
  availableCount: number;
  unavailableCount: number;
  unverifiableCount: number;
  totalCount: number;
  feeds: AvailabilityFeedDebug[];
};

export type AvailabilityRoomResult = {
  propertySlug: string;
  propertyName: string;
  roomSlug: string;
  roomName: string;
  status: AvailabilityStatus;
  message: string;
  bookingUrl: string | null;
  feedAvailable: boolean;
};

export type AvailabilitySearchResult = {
  propertySlug: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  hasFeeds: boolean;
  summaryStatus: AvailabilitySummaryStatus;
  summary: string;
  message?: string;
  warning?: string;
  availableCount: number;
  totalCount: number;
  rooms: AvailabilityRoomResult[];
  debug: AvailabilityDebugTrace;
  allTokensInvalid: boolean;
};

type AvailabilityDateValidation =
  | {
      valid: false;
      message: string;
    }
  | {
      valid: true;
      checkInKey: string;
      checkOutKey: string;
    };

const ALL_PROPERTIES_LABEL = "Tutte le strutture";
const FEED_DEVELOPMENT_LABEL = (roomName: string, propertyName: string) => `${propertyName} / ${roomName}`;

export function validateAvailabilityDates(checkIn: string, checkOut: string): AvailabilityDateValidation {
  if (!checkIn || !checkOut) {
    return {
      valid: false,
      message: "Seleziona sia la data di arrivo sia quella di partenza.",
    };
  }

  if (!isIsoDateString(checkIn) || !isIsoDateString(checkOut)) {
    return {
      valid: false,
      message: "Le date selezionate non sono valide.",
    };
  }

  const checkInTime = Date.parse(`${checkIn}T00:00:00.000Z`);
  const checkOutTime = Date.parse(`${checkOut}T00:00:00.000Z`);

  if (Number.isNaN(checkInTime) || Number.isNaN(checkOutTime)) {
    return {
      valid: false,
      message: "Le date selezionate non sono valide.",
    };
  }

  if (checkOutTime <= checkInTime) {
    return {
      valid: false,
      message: "La data di partenza deve essere successiva all'arrivo.",
    };
  }

  return {
    valid: true,
    checkInKey: checkIn,
    checkOutKey: checkOut,
  };
}

export function isKnownAvailabilityStructure(propertySlug: string) {
  return availabilityStructureMenuOptions.some((option) => option.propertySlug === propertySlug);
}

export async function searchAvailabilityByProperty(propertySlug: string, checkIn: string, checkOut: string) {
  const dateValidation = validateAvailabilityDates(checkIn, checkOut);

  if (!dateValidation.valid) {
    return {
      valid: false as const,
      message: dateValidation.message,
    };
  }

  const isAllProperties = propertySlug === ALL_AVAILABILITY_STRUCTURE_SLUG;
  const property = isAllProperties ? null : getBookingPropertyBySlug(propertySlug);

  if (!isAllProperties && !property) {
    return {
      valid: false as const,
      message: "La struttura selezionata non è disponibile.",
    };
  }

  const selectedPropertyName = isAllProperties ? ALL_PROPERTIES_LABEL : property!.name;
  const feeds = isAllProperties ? getAllFeeds() : getFeedsForProperty(propertySlug);

  if (feeds.length === 0) {
    return {
      valid: true as const,
      result: {
        propertySlug,
        propertyName: selectedPropertyName,
        checkIn: dateValidation.checkInKey,
        checkOut: dateValidation.checkOutKey,
        hasFeeds: false,
        summaryStatus: "missing-feeds" as const,
        summary: "La disponibilità online per questa struttura non è ancora disponibile.",
        message:
          "La disponibilità online per questa struttura non è ancora disponibile. Contattaci per maggiori informazioni.",
        availableCount: 0,
        totalCount: 0,
        rooms: [],
        allTokensInvalid: false,
        debug: {
          propertySlug,
          propertyName: selectedPropertyName,
          checkIn: dateValidation.checkInKey,
          checkOut: dateValidation.checkOutKey,
          summaryStatus: "missing-feeds" as const,
          availableCount: 0,
          unavailableCount: 0,
          unverifiableCount: 0,
          totalCount: 0,
          feeds: [],
        },
      } satisfies AvailabilitySearchResult,
    };
  }

  const roomResults = await Promise.all(
    feeds.map(async (feed) => {
      const feedProperty = getBookingPropertyBySlug(feed.propertySlug);
      const feedPropertyName = feedProperty?.name ?? feed.propertyName;
      const feedBookingUrl = feedProperty?.bookingUrl ?? null;

      const parsed = await fetchAndParseBookingIcal(
        feed.icalUrl,
        FEED_DEVELOPMENT_LABEL(feed.roomName, feedPropertyName),
      );

      if (!parsed.ok) {
        const status: AvailabilityStatus =
          parsed.kind === "token_invalid" ? "unverifiable" : "unverifiable";

        const message =
          parsed.kind === "token_invalid"
            ? "Il calendario Booking di questa unità non è più sincronizzato. Il proprietario deve rigenerare il link iCal dal pannello Booking."
            : parsed.kind === "fetch_error"
              ? "Il calendario Booking di questa unità non è raggiungibile in questo momento."
              : "Il calendario Booking di questa unità non è leggibile in questo momento.";

        return {
          room: {
            propertySlug: feed.propertySlug,
            propertyName: feedPropertyName,
            roomSlug: feed.roomSlug,
            roomName: feed.roomName,
            feedAvailable: false,
            bookingUrl: feedBookingUrl,
            status,
            message,
          } satisfies AvailabilityRoomResult,
          debug: {
            ...parsed.debug,
            propertySlug: feed.propertySlug,
            propertyName: feedPropertyName,
            roomSlug: feed.roomSlug,
            roomName: feed.roomName,
            status,
            errorKind: parsed.kind,
            errorMessage: parsed.message,
          } satisfies AvailabilityFeedDebug,
        };
      }

      const blocked = parsed.intervals.some((interval) =>
        doesOverlap(interval.startKey, interval.endKey, dateValidation.checkInKey, dateValidation.checkOutKey),
      );

      if (process.env.NODE_ENV !== "production") {
        console.info("[availability][room][overlap]", {
          roomSlug: feed.roomSlug,
          roomName: feed.roomName,
          propertySlug: feed.propertySlug,
          propertyName: feedPropertyName,
          checkIn: dateValidation.checkInKey,
          checkOut: dateValidation.checkOutKey,
          blockedIntervals: parsed.intervals,
          blocked,
        });
      }

      return {
        room: {
          propertySlug: feed.propertySlug,
          propertyName: feedPropertyName,
          roomSlug: feed.roomSlug,
          roomName: feed.roomName,
          feedAvailable: true,
          bookingUrl: feedBookingUrl,
          status: blocked ? ("unavailable" as const) : ("available" as const),
          message: blocked
            ? "Questa soluzione non risulta disponibile per le date selezionate."
            : "Questa soluzione risulta disponibile per le date selezionate.",
        } satisfies AvailabilityRoomResult,
        debug: {
          ...parsed.debug,
          propertySlug: feed.propertySlug,
          propertyName: feedPropertyName,
          roomSlug: feed.roomSlug,
          roomName: feed.roomName,
          status: blocked ? ("unavailable" as const) : ("available" as const),
          overlap: blocked,
        } satisfies AvailabilityFeedDebug,
      };
    }),
  );

  const rooms = roomResults.map((entry) => entry.room);
  const feedsDebug = roomResults.map((entry) => entry.debug);

  const availableCount = rooms.filter((room) => room.status === "available").length;
  const unavailableCount = rooms.filter((room) => room.status === "unavailable").length;
  const unverifiableCount = rooms.filter((room) => room.status === "unverifiable").length;
  const totalCount = rooms.length;

  const allUnverifiable = unverifiableCount === totalCount && totalCount > 0;
  const hasPartialFailures = unverifiableCount > 0 && unverifiableCount < totalCount;
  const allTokensInvalid =
    totalCount > 0 &&
    feedsDebug.every((feed) => "errorKind" in feed && feed.errorKind === "token_invalid");

  const summaryStatus: AvailabilitySummaryStatus = feeds.length === 0
    ? "missing-feeds"
    : allUnverifiable
      ? "error"
      : hasPartialFailures
        ? "partial"
        : "success";

  if (process.env.NODE_ENV !== "production") {
    console.info("[availability][aggregate]", {
      propertySlug,
      propertyName: selectedPropertyName,
      checkIn: dateValidation.checkInKey,
      checkOut: dateValidation.checkOutKey,
      availableCount,
      unavailableCount,
      unverifiableCount,
      totalCount,
      summaryStatus,
      rooms,
      feedsDebug,
    });
  }

  return {
    valid: true as const,
    result: {
      propertySlug,
      propertyName: selectedPropertyName,
      checkIn: dateValidation.checkInKey,
      checkOut: dateValidation.checkOutKey,
      hasFeeds: true,
      summaryStatus,
      summary: allUnverifiable
        ? "Non è stato possibile verificare questa disponibilità in questo momento."
        : availableCount > 0
          ? `${availableCount} soluzioni disponibili per le date selezionate`
          : "Nessuna soluzione disponibile per le date selezionate",
      warning: allTokensInvalid
        ? "I calendari Booking non sono più sincronizzati. Il proprietario deve rigenerare i link iCal dal pannello Booking."
        : hasPartialFailures
          ? "Non è stato possibile verificare una o più unità in questo momento."
          : allUnverifiable
            ? "Non è stato possibile leggere i calendari Booking di questa struttura in questo momento."
            : undefined,
      availableCount,
      totalCount,
      allTokensInvalid,
      rooms,
      debug: {
        propertySlug,
        propertyName: selectedPropertyName,
        checkIn: dateValidation.checkInKey,
        checkOut: dateValidation.checkOutKey,
        summaryStatus,
        availableCount,
        unavailableCount,
        unverifiableCount,
        totalCount,
        feeds: feedsDebug,
      },
    } satisfies AvailabilitySearchResult,
  };
}

function doesOverlap(blockedStart: string, blockedEnd: string, stayStart: string, stayEnd: string) {
  return blockedStart < stayEnd && blockedEnd > stayStart;
}

function isIsoDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
