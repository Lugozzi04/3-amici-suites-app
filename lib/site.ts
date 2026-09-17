import { getBookingPropertyBySlug, properties as bookingProperties, type BookingProperty } from "@/src/data/bookingLinks";
import { getPropertyImagePools } from "@/lib/home-gallery";

export type Property = BookingProperty & {
  image: string;
  gallery: string[];
  galleryPool: string[];
  heroNote: string;
  locationNote: string;
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/3-amici-suites";

export function withBasePath(path: string) {
  if (!basePath) {
    return path;
  }

  return `${basePath}${path}`;
}

const visualBySlug: Record<
  string,
  {
    image: string;
    gallery: string[];
    galleryPool: string[];
    heroNote: string;
    locationNote: string;
  }
> = {
  "3-amici-suites": {
    image: "/real/hero-lounge.jpg",
    gallery: ["/real/suite-bedroom.jpg", "/real/dining-room.jpg", "/real/lamp-detail.jpg"],
    galleryPool: [
      "/real/hero-lounge.jpg",
      "/real/suite-bedroom.jpg",
      "/real/dining-room.jpg",
      "/real/lamp-detail.jpg",
      "/real/breakfast-view.jpg",
      "/real/breakfast-close.jpg",
      "/real/blue-sofa.jpg",
      "/real/bed-window-lamp.jpg",
    ],
    heroNote: "Ambiente intimo, luminoso e coerente con un linguaggio boutique contemporaneo.",
    locationNote: "Posizione comoda per centro storico, servizi e collegamenti.",
  },
  "3-amici-al-teatro": {
    image: "/real/suite-bedroom.jpg",
    gallery: ["/real/grey-sofa.jpg", "/real/blue-sofa.jpg", "/real/pink-sofa.jpg", "/real/lamp-close.jpg"],
    galleryPool: [
      "/real/grey-sofa.jpg",
      "/real/blue-sofa.jpg",
      "/real/pink-sofa.jpg",
      "/real/lamp-close.jpg",
      "/real/tv-living.jpg",
      "/real/suite-bedroom.jpg",
      "/real/dining-room.jpg",
      "/real/hero-lounge.jpg",
      "/real/bed-grey.jpg",
    ],
    heroNote: "Una base elegante per un soggiorno urbano semplice e ben rifinito.",
    locationNote: "A pochi minuti dalle principali attrazioni del centro.",
  },
  "3-amici-al-castello": {
    image: "/real/chair-castello.jpg",
    gallery: ["/real/breakfast-view.jpg", "/real/breakfast-warm.jpg", "/real/red-bed.jpg"],
    galleryPool: [
      "/real/armchair-window.jpg",
      "/real/breakfast-view.jpg",
      "/real/breakfast-close.jpg",
      "/real/red-bed.jpg",
      "/real/bed-window-lamp.jpg",
      "/real/dining-room.jpg",
      "/real/hero-lounge.jpg",
      "/real/tv-living.jpg",
    ],
    heroNote: "Una scelta calda, accogliente e molto adatta a soggiorni rilassati.",
    locationNote: "Contesto comodo per vivere la città con calma.",
  },
  "3-amici-all-arena": {
    image: "/real/green-bed.jpg",
    gallery: ["/real/hero-lounge.jpg", "/real/dining-room.jpg", "/real/blue-sofa.jpg"],
    galleryPool: [
      "/real/green-bed.jpg",
      "/real/hero-lounge.jpg",
      "/real/dining-room.jpg",
      "/real/blue-sofa.jpg",
      "/real/suite-bedroom.jpg",
      "/real/lamp-detail.jpg",
      "/real/breakfast-view.jpg",
      "/real/red-bed.jpg",
    ],
    heroNote: "Posizione centralissima con un approccio moderno e molto curato.",
    locationNote: "Nel cuore del centro storico, perfetto per muoversi a piedi.",
  },
};

const propertyImagePools: Record<string, string[]> = getPropertyImagePools();

export const properties: Property[] = bookingProperties.map((bookingProperty) => {
  const visual = visualBySlug[bookingProperty.slug];
  const imagePool = propertyImagePools[bookingProperty.slug] ?? [];

  return {
    ...bookingProperty,
    image: imagePool[0] ?? visual.image,
    gallery: imagePool.slice(1, 5).length > 0 ? imagePool.slice(1, 5) : visual.gallery,
    galleryPool: imagePool.length > 0 ? imagePool : visual.galleryPool,
    heroNote: visual.heroNote,
    locationNote: visual.locationNote,
  };
});

export const contactInfo = {
  businessName: "3 Amici Suites",
  email: "treamici.cadapi@gmail.com",
  phone: "+39 347 484 8767",
  whatsapp: "+39 347 484 8767",
  address: "Verona, Italia",
  mapsUrl: "#",
  cin: "CIN: IT023091B46Q6XZ8A6 · IT023091B4NXKGQSTZ · IT023091B4ADQ877W6 · IT023091B4QWP5XS3Q · IT023091B4F2NKLUX8",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/3amicisuites/" },
    { label: "Facebook", href: "https://www.facebook.com/3amicisuites" },
  ],
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Strutture", href: "/strutture" },
  { label: "Verona", href: "/verona" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Contatti", href: "/contatti" },
];

export const homeHighlights = [
  {
    title: "Accoglienza vera",
    description: "Comunicazione chiara, tempi rapidi e attenzione al dettaglio in ogni fase del soggiorno.",
  },
  {
    title: "Posizione strategica",
    description: "Le strutture sono pensate per valorizzare il meglio di Verona, tra centro e collegamenti.",
  },
  {
    title: "Stile coerente",
    description: "Un'identità visiva uniforme, pulita e premium per trasmettere subito affidabilità.",
  },
];

export const amenities = [
  "Wi-Fi veloce fibra",
  "Climatizzazione",
  "Pulizia professionale",
  "Self check-in in orario notturno",
  "Assistenza ospiti 24h",
  "Guida gratuita su Verona",
];

export const testimonials = [
  {
    quote:
      "Accoglienza impeccabile, ambienti curati e comunicazione semplice. Ci siamo sentiti subito a nostro agio.",
    author: "Chiara, Italia",
  },
  {
    quote:
      "Ottima posizione per visitare Verona e struttura molto piacevole, con dettagli che fanno la differenza.",
    author: "Marco, Germania",
  },
  {
    quote:
      "Pulizia, ordine e ospitalità autentica. Un soggiorno molto più raffinato di quanto ci aspettassimo.",
    author: "Laura, Regno Unito",
  },
];

export const veronaExperiences = [
  {
    title: "Arena e centro storico",
    description:
      "L'itinerario ideale per una prima visita: monumenti, piazze eleganti e percorsi pedonali piacevoli.",
  },
  {
    title: "Valpolicella e vino",
    description:
      "Degustazioni e colline poco distanti, perfette per una mezza giornata fuori città.",
  },
  {
    title: "Ristoranti e cucina locale",
    description:
      "Dalla tradizione veronese alle proposte contemporanee: un punto di partenza solido per il soggiorno.",
  },
  {
    title: "Fiere, eventi e stagione lirica",
    description:
      "Un posizionamento utile anche per chi viaggia per eventi, concerti o appuntamenti professionali.",
  },
];

export const siteMeta = {
  title: "3 Amici Suites | Hospitality boutique a Verona",
  description:
    "Quattro strutture a Verona presentate con un'identità elegante e moderna. Contatta 3 Amici Suites o prenota tramite Booking.",
};

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}

export function getBookingPropertySnapshot(slug: string) {
  return getBookingPropertyBySlug(slug);
}
