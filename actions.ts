"use server";

import { searchAvailabilityByProperty, type AvailabilitySearchResult } from "@/src/lib/availability";

type AvailabilitySubmission = {
  propertySlug: string;
  checkIn: string;
  checkOut: string;
};

type AvailabilityCheckerState =
  | { kind: "idle" }
  | { kind: "error"; message: string; submitted: AvailabilitySubmission }
  | { kind: "success"; data: AvailabilitySearchResult; submitted: AvailabilitySubmission };

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

  const result = await searchAvailabilityByProperty(propertySlug, checkIn, checkOut);

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

  return {
    kind: "success",
    data: result.result,
    submitted: { propertySlug, checkIn, checkOut },
  };
}
