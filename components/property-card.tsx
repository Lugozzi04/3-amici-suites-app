import { BookingButton, BookingReviewsLink, ContactButton } from "@/components/booking-cta";
import { PropertyImageCarousel } from "@/components/property-image-carousel";
import type { Property } from "@/lib/site";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article
      className="group overflow-hidden rounded-[2rem] border border-white/55 bg-white/82 shadow-soft backdrop-blur transition duration-500 hover:-translate-y-1 hover:shadow-lift float-on-hover glow-edges h-full"
      data-reveal
    >
      <div className="p-4 pb-0">
        <PropertyImageCarousel name={property.name} type={property.type} images={property.galleryPool} />
      </div>

      <div className="flex h-full flex-col space-y-4 p-5 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-earth">{property.type}</p>
          <h3 className="mt-2 font-serif text-[1.85rem] leading-tight text-ink">{property.name}</h3>
          <p className="mt-3 text-sm leading-7 text-ink/72">{property.shortDescription}</p>
        </div>

        <div className="rounded-[1.2rem] border border-white/50 bg-paper/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">{property.ratingLabel}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-earth">{property.reviewCountLabel}</p>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-ink/58">
            Dati recensioni e punteggi: snapshot Booking, aggiornabili manualmente
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.badges.slice(0, 4).map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-stone/20 bg-paper/85 px-3 py-1 text-[11px] tracking-[0.02em] text-ink/72"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <ContactButton propertySlug={property.slug}>Prenota subito</ContactButton>
          <BookingButton name={property.name} href={property.bookingUrl} context="property-card">
            Prenota su Booking
          </BookingButton>
          {property.reviewsUrl ? (
            <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="property-card">
              Leggi recensioni su Booking
            </BookingReviewsLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
