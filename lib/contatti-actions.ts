"use server";

import { searchAvailabilityByProperty, type AvailabilitySearchResult } from "@/src/lib/availability";
import { maybeNotifyOwnerAboutDeadTokens } from "@/lib/availability-alert";
import { existsSync, readFileSync } from "node:fs";

type AvailabilitySubmission = {
  propertySlug: string;
  checkIn: string;
  checkOut: string;
};

type AvailabilityCheckerState =
  | { kind: "idle" }
  | { kind: "error"; message: string; submitted: AvailabilitySubmission }
  | { kind: "success"; data: AvailabilitySearchResult; submitted: AvailabilitySubmission };

function loadOverrides(): Record<string, string> {
  try {
    const prodPath = process.env.OVERRIDE_PATH ?? process.env.ICAL_OVERRIDES_PATH;
    if (prodPath && existsSync(prodPath)) {
      return JSON.parse(readFileSync(prodPath, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}

export async function checkAvailabilityAction(
  _previousState: AvailabilityCheckerState,
  formData: FormData,
): Promise<AvailabilityCheckerState> {
  const propertySlug = String(formData.get("propertySlug") ?? "");
  const checkIn = String(formData.get("checkIn") ?? "");
  const checkOut = String(formData.get("checkOut") ?? "");

  if (process.env.NODE_ENV !== "production") {
    console.info("[availability][server][action][input]", {
      propertySlug,
      checkIn,
      checkOut,
      formEntries: Array.from(formData.entries()),
    });
  }

  const overrides = loadOverrides();
  const result = await searchAvailabilityByProperty(propertySlug, checkIn, checkOut, overrides);

  if (!result.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[availability][server][action][validation-error]", result.message);
    }
    return {
      kind: "error",
      message: result.message,
      submitted: { propertySlug, checkIn, checkOut },
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[availability][server][action][result]", result.result);
  }

  // Fire-and-forget: if all iCal tokens are dead, notify the owner via email
  if (result.result.allTokensInvalid) {
    maybeNotifyOwnerAboutDeadTokens().catch((error) => {
      console.error("[availability] Failed to notify owner about dead tokens:", error);
    });
  }

  return {
    kind: "success",
    data: result.result,
    submitted: { propertySlug, checkIn, checkOut },
  };
}
