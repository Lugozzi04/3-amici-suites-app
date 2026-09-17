"use client";

import { useTranslations } from "next-intl";
import { BookingButton, BookingReviewsLink, ContactButton } from "@/components/booking-cta";
import { PropertyImageCarousel } from "@/components/property-image-carousel";
import type { Property } from "@/lib/site";

export function PropertyCard({ property }: { property: Property }) {
  const t = useTranslations("common");
  const tp = useTranslations("properties");

  // Map property slug to translations key
  const slugMap: Record<string, string> = {
    "3-amici-suites": "suites",
    "3-amici-al-teatro": "teatro",
    "3-amici-al-castello": "castello",
    "3-amici-all-arena": "arena",
  };
  const propKey = slugMap[property.slug] || "suites";

  const propType = (() => {
    try { return tp(`${propKey}.type`); } catch { return property.type; }
  })();
  const propDesc = (() => {
    try { return tp(`${propKey}.description`); } catch { return property.shortDescription; }
  })();
  const propBadges = (() => {
    try {
      const raw = tp.raw(`${propKey}.badges`);
      if (Array.isArray(raw)) return raw;
      return property.badges.slice(0, 4);
    } catch { return property.badges.slice(0, 4); }
  })();
  const ratingLabel = (() => {
    try { return tp(`${propKey}.ratingLabel`); } catch { return property.ratingLabel; }
  })();
  const reviewCountLabel = (() => {
    try { return tp(`${propKey}.reviewCountLabel`); } catch { return property.reviewCountLabel; }
  })();

  return (
    <article
      className="group overflow-hidden rounded-[2rem] border border-white/55 bg-white/82 shadow-soft backdrop-blur transition duration-500 hover:-translate-y-1 hover:shadow-lift float-on-hover glow-edges h-full"
      data-reveal
    >
      <div className="p-4 pb-0">
        <PropertyImageCarousel name={property.name} type={propType} images={property.galleryPool} />
      </div>

      <div className="flex h-full flex-col space-y-4 p-5 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-earth">{propType}</p>
          <h3 className="mt-2 font-serif text-[1.85rem] leading-tight text-ink">{property.name}</h3>
          <p className="mt-3 text-sm leading-7 text-ink/72">{propDesc}</p>
        </div>

        {ratingLabel ? (
          <div className="rounded-[1.2rem] border border-white/50 bg-paper/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">{ratingLabel}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-earth">{reviewCountLabel}</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {propBadges.map((badge: string) => (
            <span
              key={badge}
              className="rounded-full border border-stone/20 bg-paper/85 px-3 py-1 text-[11px] tracking-[0.02em] text-ink/72"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <ContactButton propertySlug={property.slug}>{t("prenotaSubito")}</ContactButton>
          <BookingButton name={property.name} href={property.bookingUrl} context="property-card">
            {t("prenotaBooking")}
          </BookingButton>
          {property.reviewsUrl ? (
            <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="property-card">
              {t("leggiRecensioni")}
            </BookingReviewsLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
