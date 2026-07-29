import { properties } from "./bookingLinks";
import overrides from "./ical-overrides.json";

export const ALL_AVAILABILITY_STRUCTURE_SLUG = "all";

export type AvailabilityFeed = {
  propertySlug: string;
  propertyName: string;
  roomSlug: string;
  roomName: string;
  icalUrl: string;
};

const baseFeeds: AvailabilityFeed[] = [
  {
    propertySlug: "3-amici-suites",
    propertyName: "3 Amici Suites",
    roomSlug: "appartamento-carlo",
    roomName: "Appartamento Carlo",
    icalUrl: "https://ical.booking.com/v1/export/t/94c9bf58-5c40-4545-9a8f-3778efaa1a52.ics",
  },
  {
    propertySlug: "3-amici-suites",
    propertyName: "3 Amici Suites",
    roomSlug: "appartamento-dario",
    roomName: "Appartamento Dario",
    icalUrl: "https://ical.booking.com/v1/export/t/a82bf0fb-0787-404d-8dac-c1af64400b9e.ics",
  },
  {
    propertySlug: "3-amici-suites",
    propertyName: "3 Amici Suites",
    roomSlug: "appartamento-pietor",
    roomName: "Appartamento Pietor",
    icalUrl: "https://ical.booking.com/v1/export/t/983aeb20-4863-482d-b4e6-7916357cff39.ics",
  },
  {
    propertySlug: "3-amici-al-teatro",
    propertyName: "3 Amici al Teatro",
    roomSlug: "unita-principale",
    roomName: "3 Amici al Teatro",
    icalUrl: "https://ical.booking.com/v1/export/t/23a4c22a-9cde-414a-8fe3-fef05e84d208.ics",
  },
  {
    propertySlug: "3-amici-all-arena",
    propertyName: "3 Amici all'Arena",
    roomSlug: "unita-principale",
    roomName: "3 Amici all'Arena",
    icalUrl: "https://ical.booking.com/v1/export/t/DA-INSERIRE-arena.ics",
  },
  {
    propertySlug: "3-amici-al-castello",
    propertyName: "3 Amici al Castello",
    roomSlug: "arco",
    roomName: "Arco",
    icalUrl: "https://ical.booking.com/v1/export/t/0c055433-a778-4882-ad3e-33153e360d9f.ics",
  },
  {
    propertySlug: "3-amici-al-castello",
    propertyName: "3 Amici al Castello",
    roomSlug: "castello",
    roomName: "3 Amici al Castello",
    icalUrl: "https://ical.booking.com/v1/export/t/3fcd0eee-986f-4cc6-81cd-9ea464047db9.ics",
  },
  {
    propertySlug: "3-amici-al-castello",
    propertyName: "3 Amici al Castello",
    roomSlug: "torre",
    roomName: "Torre",
    icalUrl: "https://ical.booking.com/v1/export/t/486258e6-eac9-48be-9725-5d5e29f3728e.ics",
  },
];

// Merge admin overrides from ical-overrides.json
type OverridesMap = Record<string, string>; // roomSlug → new icalUrl

export const availabilityFeeds: AvailabilityFeed[] = baseFeeds.map((feed) => {
  const overrideUrl = (overrides as OverridesMap)[feed.roomSlug];
  return overrideUrl ? { ...feed, icalUrl: overrideUrl } : feed;
});

export const hasOverrides = Object.keys(overrides as OverridesMap).length > 0;

export const availabilityStructureOptions = properties.map((property) => ({
  propertySlug: property.slug,
  propertyName: property.name,
  hasFeeds: availabilityFeeds.some((feed) => feed.propertySlug === property.slug),
}));

export const allAvailabilityStructureOption = {
  propertySlug: ALL_AVAILABILITY_STRUCTURE_SLUG,
  propertyName: "Tutte le strutture",
  hasFeeds: availabilityFeeds.length > 0,
};

export const availabilityStructureMenuOptions = [allAvailabilityStructureOption, ...availabilityStructureOptions];

export function getFeedsForProperty(propertySlug: string) {
  return availabilityFeeds.filter((feed) => feed.propertySlug === propertySlug);
}

export function getAllFeeds() {
  return availabilityFeeds;
}
