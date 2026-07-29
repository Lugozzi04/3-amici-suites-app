import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { PropertyCard } from "@/components/property-card";
import { BookingButton, BookingReviewsLink, ContactButton } from "@/components/booking-cta";
import { properties } from "@/lib/site";

export const metadata: Metadata = {
  title: "Strutture | 3 Amici Suites Verona",
  description:
    "Scopri le quattro strutture di 3 Amici Suites a Verona, con overview, confronto rapido e accesso diretto alle pagine dedicate.",
};

export default function PropertiesPage() {
  return (
    <section className="py-16 lg:py-20" data-reveal>
      <Container>
        <SectionHeading
          eyebrow="Strutture"
          title="Quattro spazi, una sola identità di ospitalità."
          description="Ogni scheda è pensata per orientare subito l'ospite e per portarlo verso Booking o verso il contatto diretto."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4" data-stagger>
          {properties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-white/60 bg-white/72 p-8 shadow-soft backdrop-blur" data-reveal>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-earth">Confronto rapido</p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                Confronta le strutture in un colpo d'occhio.
              </h2>
            </div>
            <p className="text-sm leading-7 text-ink/68">
              Le informazioni sotto sono tratte dalla stessa sorgente dati Booking e restano facili da aggiornare
              manualmente.
            </p>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-4" data-stagger>
            {properties.map((property) => (
              <article
                key={property.slug}
                className="rounded-[1.6rem] border border-stone/15 bg-[#f8f3eb] p-5 shadow-sm float-on-hover glow-edges"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-earth">{property.type}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{property.name}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/70">{property.address}</p>

                <div className="mt-4 grid gap-3">
                  <InfoRow label="Ideale per" value={property.bestFor ?? "soggiorni flessibili"} />
                  <InfoRow label="Dotazioni" value={property.badges.slice(0, 3).join(" · ")} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <ContactButton propertySlug={property.slug}>Prenota subito</ContactButton>
                  <BookingButton name={property.name} href={property.bookingUrl} context="compare-section">
                    Prenota su Booking
                  </BookingButton>
                  {property.reviewsUrl ? (
                    <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="compare-section">
                      Leggi recensioni su Booking
                    </BookingReviewsLink>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/75 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-earth">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/72">{value}</p>
    </div>
  );
}
