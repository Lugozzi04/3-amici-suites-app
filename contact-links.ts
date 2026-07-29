export const CONTACT_PAGE_PATH = "/contatti";
export const CONTACT_FORM_ANCHOR = "#contatti-form";

type BuildContactHrefOptions = {
  anchor?: string;
  message?: string;
};

export function buildContactHref(propertySlug?: string | null, options: BuildContactHrefOptions = {}) {
  const params = new URLSearchParams();

  if (propertySlug) {
    params.set("structure", propertySlug);
  }

  if (options.message) {
    params.set("message", options.message);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  const anchor = options.anchor ?? CONTACT_FORM_ANCHOR;

  return `${CONTACT_PAGE_PATH}${query}${anchor}`;
}

export function buildPropertyInquiryMessage(propertyName: string) {
  return [
    "Buongiorno,",
    "",
    `sono interessato a prenotare ${propertyName}.`,
    "Vorrei ricevere informazioni su disponibilità, caratteristiche della soluzione e modalità di soggiorno.",
    "Resto in attesa di un vostro gentile riscontro.",
  ].join("\n");
}

export function buildAvailabilityInquiryMessage(args: {
  propertyName: string;
  roomName: string;
  checkIn?: string;
  checkOut?: string;
}) {
  const stayPeriod =
    args.checkIn && args.checkOut
      ? `dal ${formatItalianDate(args.checkIn)} al ${formatItalianDate(args.checkOut)}`
      : "per le date selezionate";

  return [
    "Buongiorno,",
    "",
    `sono interessato a prenotare ${args.roomName} presso ${args.propertyName}.`,
    `Ho verificato la disponibilità per ${stayPeriod} e desidero ricevere maggiori informazioni.`,
    "Resto a disposizione per eventuali dettagli e conferme.",
  ].join("\n");
}

function formatItalianDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}
