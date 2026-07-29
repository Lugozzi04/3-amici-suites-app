export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const contactHoneypotField = "website";

export const emptyContactFormValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactForm(input: Partial<ContactFormValues>) {
  const values: ContactFormValues = {
    name: normalize(input.name),
    email: normalize(input.email),
    phone: normalize(input.phone),
    message: normalize(input.message),
    website: normalize(input.website),
  };

  const errors: ContactFormErrors = {};

  if (values.website) {
    errors.website = "Richiesta sospetta.";
  }

  if (!values.name) {
    errors.name = "Inserisci il tuo nome.";
  } else if (values.name.length > 120) {
    errors.name = "Il nome è troppo lungo.";
  }

  if (!values.email) {
    errors.email = "Inserisci la tua email.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Inserisci un indirizzo email valido.";
  } else if (values.email.length > 180) {
    errors.email = "L'email è troppo lunga.";
  }

  if (values.phone && values.phone.length > 40) {
    errors.phone = "Il numero di telefono è troppo lungo.";
  }

  if (!values.message) {
    errors.message = "Scrivi un messaggio.";
  } else if (values.message.length < 10) {
    errors.message = "Il messaggio è troppo breve.";
  } else if (values.message.length > 3000) {
    errors.message = "Il messaggio è troppo lungo.";
  }

  return {
    values,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactEmailContent(values: ContactFormValues, receivedAt = new Date()) {
  const timestamp = new Intl.DateTimeFormat("it-IT", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(receivedAt);

  const subject = `Nuova richiesta dal sito - ${values.name}`;
  const text = [
    `Nome: ${values.name}`,
    `Email: ${values.email}`,
    values.phone ? `Telefono: ${values.phone}` : null,
    "",
    "Messaggio:",
    values.message,
    "",
    `Timestamp: ${timestamp}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1b16;">
      <h2 style="margin: 0 0 16px;">Nuova richiesta dal sito</h2>
      <p><strong>Nome:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      ${values.phone ? `<p><strong>Telefono:</strong> ${escapeHtml(values.phone)}</p>` : ""}
      <div style="margin: 20px 0; padding: 16px; border-left: 4px solid #8c7f5f; background: #f8f3eb;">
        <p style="margin: 0 0 8px;"><strong>Messaggio</strong></p>
        <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(values.message)}</p>
      </div>
      <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
    </div>
  `;

  return { subject, text, html, timestamp };
}
