import { NextResponse } from "next/server";

import { searchAvailabilityByProperty } from "@/src/lib/availability";
import { maybeNotifyOwnerAboutDeadTokens } from "@/lib/availability-alert";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        propertySlug?: string;
        checkIn?: string;
        checkOut?: string;
      }
    | null;

  if (!body?.propertySlug || !body.checkIn || !body.checkOut) {
    return NextResponse.json(
      { message: "Seleziona struttura, check-in e check-out prima di verificare la disponibilità." },
      { status: 400 },
    );
  }

  const result = await searchAvailabilityByProperty(body.propertySlug, body.checkIn, body.checkOut);

  if (!result.valid) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  // Fire-and-forget: if all iCal tokens are dead, notify the owner via email
  if (result.result.allTokensInvalid) {
    maybeNotifyOwnerAboutDeadTokens().catch((error) => {
      console.error("[availability] Failed to notify owner about dead tokens:", error);
    });
  }

  return NextResponse.json(result.result);
}
