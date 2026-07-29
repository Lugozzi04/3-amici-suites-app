import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/contact-form";
import { checkContactRateLimit, getClientRateLimitKey } from "@/lib/contact-rate-limit";
import { sendContactEmail } from "@/lib/contact-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);

  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json(
      { message: "Invio non riuscito. Riprova tra qualche minuto oppure contattaci direttamente." },
      { status: 400 },
    );
  }

  const validated = validateContactForm(rawBody as Record<string, string>);

  if (!validated.valid) {
    return NextResponse.json(
      {
        message: "Controlla i campi evidenziati e riprova.",
        errors: validated.errors,
      },
      { status: 400 },
    );
  }

  const rateLimitKey = getClientRateLimitKey(request.headers);
  const rateLimit = checkContactRateLimit(rateLimitKey, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Troppi invii in poco tempo. Riprova tra qualche minuto." },
      { status: 429 },
    );
  }

  try {
    const receivedAt = new Date();
    await sendContactEmail({
      values: validated.values,
      receivedAt,
    });

    return NextResponse.json({
      message: "Messaggio inviato correttamente. Ti risponderemo il prima possibile.",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json(
      {
        message: "Invio non riuscito. Riprova tra qualche minuto oppure contattaci direttamente.",
      },
      { status: 500 },
    );
  }
}
