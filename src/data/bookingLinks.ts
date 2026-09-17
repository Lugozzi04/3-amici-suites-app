export type BookingProperty = {
  slug: string;
  name: string;
  type: string;
  address: string;
  bookingUrl: string;
  reviewsUrl: string | null;
  ratingLabel: string;
  reviewCountLabel: string;
  badges: string[];
  shortDescription: string;
  bestFor?: string;
  sourceNote?: string;
};

export const properties: BookingProperty[] = [
  {
    slug: "3-amici-suites",
    name: "3 Amici Suites",
    type: "Appartamenti",
    address: "Via Manin 10, Centro storico di Verona, Verona",
    bookingUrl: "https://www.booking.com/hotel/it/tre-amici-suites.it.html",
    reviewsUrl: "https://www.booking.com/reviews/it/hotel/tre-amici-suites.it.html",
    ratingLabel: "9,3 su Booking",
    reviewCountLabel: "354 recensioni",
    badges: [
      "Centro storico",
      "Wi-Fi gratuito",
      "Aria condizionata",
      "Cucina attrezzata",
      "Ideale per famiglie e gruppi",
    ],
    shortDescription:
      "Appartamenti climatizzati nel centro di Verona, a pochi passi da Arena, Piazza Bra e Castelvecchio.",
    bestFor: "famiglie, soggiorni lunghi e piccoli gruppi",
    sourceNote: "Snapshot Booking aggiornabile manualmente.",
  },
  {
    slug: "3-amici-al-teatro",
    name: "3 Amici al Teatro",
    type: "Appartamento",
    address: "14 Vicolo Circolo, Centro storico di Verona, Verona",
    bookingUrl: "https://www.booking.com/hotel/it/3-amici-al-teatro.it.html",
    reviewsUrl: "https://www.booking.com/reviews/it/hotel/3-amici-al-teatro.it.html",
    ratingLabel: "9,2 su Booking",
    reviewCountLabel: "120 recensioni",
    badges: [
      "Centro storico",
      "Parcheggio privato",
      "Wi-Fi gratuito",
      "Aria condizionata",
      "Cucina",
    ],
    shortDescription:
      "Appartamento in posizione centralissima, comodo per chi vuole visitare Verona a piedi ma parcheggiando direttamente in loco.",
    bestFor: "famiglie, amici e coppie che cercano soggiorni di 2 o 3 notti",
    sourceNote: "Punteggio aggiornabile manualmente.",
  },
  {
    slug: "3-amici-al-castello",
    name: "3 Amici al Castello",
    type: "Camere",
    address: "1 Piazza Arsenale, Borgo Trento, Verona",
    bookingUrl: "https://www.booking.com/hotel/it/3-amici-al-castello.it.html",
    reviewsUrl: "https://www.booking.com/reviews/it/hotel/3-amici-al-castello.en-gb.html",
    ratingLabel: "9,3 su Booking",
    reviewCountLabel: "oltre 460 recensioni",
    badges: ["Centro storico", "Wi-Fi gratuito", "Balcone", "Vista su luogo storico", "Ideale per coppie"],
    shortDescription:
      "Camere eleganti con vista unica sul castello, sul fiume e sull'arco dei Gavi. Tutte con bagno privato e balcone.",
    bestFor: "coppie e ospiti che cercano la natura e viste uniche",
    sourceNote: "Snapshot Booking aggiornabile manualmente.",
  },
  {
    slug: "3-amici-all-arena",
    name: "3 Amici all’Arena",
    type: "Camere",
    address: "Via dei Mutilati, 3, Centro storico di Verona, Verona",
    bookingUrl: "https://www.booking.com/hotel/it/3-amici-all-arena.it.html",
    reviewsUrl: "https://www.booking.com/reviews/it/hotel/3-amici-all-arena.it.html",
    ratingLabel: "9,6 su Booking",
    reviewCountLabel: "142 recensioni",
    badges: [
      "Centro storico",
      "Struttura rinnovata",
      "Wi-Fi gratuito",
      "Aria condizionata",
      "Camere insonorizzate",
    ],
    shortDescription:
      "Camere moderne e recentemente rinnovate in posizione centralissima, molto forti su comfort e recensioni.",
    bestFor: "ospiti che vogliono il centro e comfort contemporaneo",
    sourceNote: "Snapshot Booking aggiornabile manualmente.",
  },
];

export function getBookingPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}
