import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { BookingButton, BookingReviewsLink, ContactButton } from "@/components/booking-cta";
import { PropertyMobileCtaBar } from "@/components/property-mobile-cta-bar";
import { RotatingGallery } from "@/components/rotating-gallery";
import { getPropertyBySlug, properties } from "@/lib/site";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return { title: "Struttura non trovata | 3 Amici Suites" };
  }

  return {
    title: `${property.name} | 3 Amici Suites Verona`,
    description: property.shortDescription,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    redirect("/strutture");
  }

  return (
    <article className="py-16 sm:py-20 lg:py-24 pb-32 lg:pb-24" data-reveal>
      <Container>
        <div className="grid gap-10">
          <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">{property.type}</p>
              <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] text-ink sm:text-6xl lg:text-[4.8rem]">
                {property.name}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-ink/74 sm:text-xl">{property.shortDescription}</p>
              <p className="max-w-2xl text-sm leading-7 text-ink/68">{property.heroNote}</p>

              <div className="rounded-[1.6rem] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur glow-edges">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ink">{property.ratingLabel}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-earth">{property.reviewCountLabel}</p>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-ink/58">
                  Dati recensioni e punteggi: snapshot Booking, aggiornabili manualmente.
                </p>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-ink/68">{property.address}</p>

              <div className="flex flex-wrap gap-3">
                <ContactButton propertySlug={property.slug}>Prenota subito</ContactButton>
                <BookingButton name={property.name} href={property.bookingUrl} context="detail-hero">
                  Prenota su Booking
                </BookingButton>
                {property.reviewsUrl ? (
                  <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="detail-hero">
                    Leggi recensioni su Booking
                  </BookingReviewsLink>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3" data-stagger>
                <InfoCard label="Ideale per" value={property.bestFor ?? "soggiorni flessibili"} />
                <InfoCard label="Posizione" value={property.locationNote} />
                <InfoCard
                  label="Nota fonte"
                  value={property.sourceNote ?? "Snapshot Booking aggiornabile manualmente."}
                />
              </div>
            </div>

            <div className="relative">
              <ImageFrame src={property.image} alt={property.name} priority className="aspect-[4/5] shadow-lift" />
              <div className="absolute -bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/55 bg-white/78 p-5 shadow-soft backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-earth">Badge principali</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.badges.slice(0, 4).map((badge) => (
                    <span key={badge} className="rounded-full bg-paper px-3 py-1 text-xs text-ink/72">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5" data-reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-earth">Gallery dinamica</p>
                <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Scatti reali in rotazione.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/68">
                La gallery pesca da un pool locale di immagini curate e cambia automaticamente dopo alcuni secondi.
              </p>
            </div>

            <RotatingGallery title={property.name} images={property.galleryPool} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]" data-reveal>
            <div className="rounded-[2rem] border border-white/60 bg-[#efe4d6]/80 p-8 shadow-soft backdrop-blur">
              <SectionHeading
                eyebrow="Dettagli"
                title="Una scheda chiara, utile e pronta a convertire."
                description="Le informazioni essenziali sono distillate in modo leggibile, senza sovraccarico visivo."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2" data-stagger>
                {property.badges.map((badge) => (
                  <div key={badge} className="rounded-[1.2rem] border border-stone/15 bg-white px-4 py-4 shadow-sm">
                    <p className="text-sm font-medium text-ink">{badge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">Contesto</p>
              <div className="mt-5 grid gap-4">
                <InfoRow label="Tipo" value={property.type} />
                <InfoRow label="Indirizzo" value={property.address} />
                <InfoRow label="Rating" value={property.ratingLabel} />
                <InfoRow label="Recensioni" value={property.reviewCountLabel} />
              </div>
              <div className="mt-6 rounded-[1.4rem] border border-stone/15 bg-[#f8f3eb] p-4 text-sm leading-7 text-ink/70">
                Dati recensioni e punteggi: snapshot Booking, aggiornabili manualmente.
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]" data-reveal>
            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft float-on-hover">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Prenotazione</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight">Contatto diretto o piattaforma esterna.</h2>
              <p className="mt-4 max-w-2xl text-paper/78">
                Se vuoi una risposta rapida o una conferma più personale, scrivici. In alternativa puoi
                proseguire sulla scheda Booking della struttura.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContactButton propertySlug={property.slug}>Prenota subito</ContactButton>
                <BookingButton name={property.name} href={property.bookingUrl} context="detail-footer">
                  Prenota su Booking
                </BookingButton>
                {property.reviewsUrl ? (
                  <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="detail-footer">
                    Leggi recensioni su Booking
                  </BookingReviewsLink>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">Sintesi</p>
              <div className="mt-5 grid gap-4">
                <InfoRow label="Ideale per" value={property.bestFor ?? "soggiorni flessibili"} />
                <InfoRow label="Posizione" value={property.locationNote} />
                <InfoRow
                  label="Nota fonte"
                  value={property.sourceNote ?? "Snapshot Booking aggiornabile manualmente."}
                />
              </div>
            </div>
          </section>
        </div>
      </Container>
      <PropertyMobileCtaBar name={property.name} bookingUrl={property.bookingUrl} propertySlug={property.slug} />
    </article>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/50 bg-white/62 p-4 shadow-soft backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-earth">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/72">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-stone/15 pb-4 last:border-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.24em] text-earth">{label}</p>
      <p className="mt-2 text-sm leading-7 text-ink/72">{value}</p>
    </div>
  );
}
