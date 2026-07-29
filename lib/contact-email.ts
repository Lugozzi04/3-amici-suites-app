import { buildContactEmailContent, type ContactFormValues } from "@/lib/contact-form";

type SendContactEmailInput = {
  values: ContactFormValues;
  receivedAt?: Date;
};

type SendResult = {
  ok: boolean;
  message: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function sendViaResend(values: ContactFormValues, receivedAt: Date): Promise<SendResult> {
  const apiKey = requireEnv("RESEND_API_KEY");
  const fromEmail = requireEnv("CONTACT_FROM_EMAIL");
  const toEmail = requireEnv("CONTACT_TO_EMAIL");
  const { subject, text, html } = buildContactEmailContent(values, receivedAt);

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
      text,
      html,
      reply_to: values.email,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(details || "Resend returned a non-OK response.");
  }

  return {
    ok: true,
    message: "Messaggio inviato correttamente. Ti risponderemo il prima possibile.",
  };
}

async function sendViaFormspree(values: ContactFormValues, receivedAt: Date): Promise<SendResult> {
  const endpoint = requireEnv("FORMSPREE_ENDPOINT");
  const toEmail = requireEnv("CONTACT_TO_EMAIL");
  const { subject, text } = buildContactEmailContent(values, receivedAt);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      subject,
      message: text,
      to: toEmail,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(details || "Formspree returned a non-OK response.");
  }

  return {
    ok: true,
    message: "Messaggio inviato correttamente. Ti risponderemo il prima possibile.",
  };
}

export async function sendContactEmail({ values, receivedAt = new Date() }: SendContactEmailInput) {
  const provider = (process.env.CONTACT_EMAIL_PROVIDER || "resend").toLowerCase();

  if (provider === "formspree") {
    return sendViaFormspree(values, receivedAt);
  }

  return sendViaResend(values, receivedAt);
}
