import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null;

  if (!body?.url) {
    return NextResponse.json({ message: "URL mancante" }, { status: 400 });
  }

  const url = body.url.trim();

  if (!url.startsWith("https://ical.booking.com/")) {
    return NextResponse.json(
      { message: "URL non valido: deve essere un link di esportazione Booking" },
      { status: 400 },
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(url, {
      headers: { Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await response.text().catch(() => "");

    if (!response.ok) {
      if (response.status === 400 && text.includes("Invalid Token")) {
        return NextResponse.json(
          {
            ok: false,
            message: "⚠️ Token non valido. Devi rigenerare il link di esportazione dall'Extranet Booking.",
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          message: `⚠️ Errore HTTP ${response.status}. Il link potrebbe non essere corretto.`,
        },
        { status: 200 },
      );
    }

    const veventCount = (text.match(/BEGIN:VEVENT/g) || []).length;

    if (veventCount === 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "✅ Link valido. Il calendario non ha prenotazioni bloccanti al momento.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: `✅ Link valido. Trovati ${veventCount} eventi nel calendario.`,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof DOMException && error.name === "AbortError"
      ? "⏱ Timeout: il server Booking non ha risposto entro 10 secondi."
      : "❌ Impossibile raggiungere il link. Verifica l'URL.";
    return NextResponse.json({ ok: false, message }, { status: 200 });
  }
}
