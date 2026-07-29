import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Sends a notification email to the property owner when ALL iCal tokens
 * are detected as invalid. Throttled: only sends one email per 24 hours.
 */
export async function maybeNotifyOwnerAboutDeadTokens(): Promise<void> {
  // --- Throttle: max one email per 24 hours ---
  const stampPath = path.join(process.cwd(), ".last-token-alert");
  const now = Date.now();

  try {
    if (fs.existsSync(stampPath)) {
      const lastStamp = parseInt(fs.readFileSync(stampPath, "utf-8").trim(), 10);
      if (!isNaN(lastStamp) && now - lastStamp < 24 * 60 * 60 * 1000) {
        return; // too soon
      }
    }
  } catch {
    // proceed — if we can't read the stamp, send the email anyway
  }

  // --- Send the email ---
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.warn("[availability-alert] Missing Resend config — can't send alert email");
    return;
  }

  const subject = "⚠️ 3 Amici Suites — Calendari Booking non sincronizzati";
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; padding: 24px;">
      <h2 style="color: #8a6d57;">⚠️ Calendari Booking da rigenerare</h2>
      <p>Ciao,</p>
      <p>I <strong>link iCal di Booking.com</strong> per le strutture 3 Amici Suites non sono più validi. 
         La disponibilità sul sito <strong>non viene più aggiornata</strong> e i visitatori vedono un messaggio di avviso.</p>
      <p><strong>Cosa fare (2 minuti):</strong></p>
      <ol>
        <li>Accedi a <a href="https://admin.booking.com/">Booking.com Extranet</a></li>
        <li>Vai su <strong>Calendario → Sincronizza calendari</strong></li>
        <li>Per ogni struttura, copia il nuovo <strong>link di esportazione iCal</strong></li>
        <li>Invia i nuovi link a chi gestisce il sito per aggiornarli</li>
      </ol>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        Questa email è stata inviata automaticamente dal sito 3 Amici Suites.
        Verrà rinviata solo se il problema persiste dopo 24 ore.
      </p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (response.ok) {
      // Write the timestamp ONLY on success
      fs.writeFileSync(stampPath, String(now));
      console.info("[availability-alert] Sent token-invalid notification email to owner");
    } else {
      const body = await response.text().catch(() => "");
      console.error("[availability-alert] Failed to send alert email:", response.status, body.slice(0, 200));
    }
  } catch (error) {
    console.error("[availability-alert] Failed to send alert email:", error);
  }
}
