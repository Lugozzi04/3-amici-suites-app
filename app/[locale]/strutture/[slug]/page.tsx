import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const property = getPropertyBySlug(slug);

  if (!property) {
    const t = await getTranslations({ locale, namespace: "strutture" });
    return { title: `${t("detail.nonTrovata")} | 3 Amici Suites` };
  }

  return {
    title: `${property.name} | 3 Amici Suites Verona`,
    description: property.shortDescription,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const property = getPropertyBySlug(slug);

  if (!property) {
    redirect(`/${locale}/strutture`);
  }

  const t = await getTranslations("strutture");
  const tc = await getTranslations("common");

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
              </div>

              <p className="max-w-2xl text-sm leading-7 text-ink/68">{property.address}</p>

              <div className="flex flex-wrap gap-3">
                <ContactButton propertySlug={property.slug}>{tc("prenotaSubito")}</ContactButton>
                <BookingButton name={property.name} href={property.bookingUrl} context="detail-hero">
                  {tc("prenotaBooking")}
                </BookingButton>
                {property.reviewsUrl ? (
                  <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="detail-hero">
                    {tc("leggiRecensioni")}
                  </BookingReviewsLink>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3" data-stagger>
                <InfoCard label={t("detail.idealePer")} value={property.bestFor ?? t("compareFallbackBestFor")} />
                <InfoCard label={t("detail.posizione")} value={property.locationNote} />
                <InfoCard
                  label={t("detail.notaFonte")}
                  value={property.sourceNote ?? t("compareFallbackSourceNote")}
                />
              </div>
            </div>

            <div className="relative">
              <ImageFrame src={property.image} alt={property.name} priority className="aspect-[4/5] shadow-lift" />
              <div className="absolute -bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/55 bg-white/78 p-5 shadow-soft backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-earth">{t("detail.badgePrincipali")}</p>
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
                <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("detail.galleryDinamica")}</p>
                <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{t("detail.galleryTitle")}</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/68">
                {t("detail.galleryNote")}
              </p>
            </div>

            <RotatingGallery title={property.name} images={property.galleryPool} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]" data-reveal>
            <div className="rounded-[2rem] border border-white/60 bg-[#efe4d6]/80 p-8 shadow-soft backdrop-blur">
              <SectionHeading
                eyebrow={t("detail.dettagli")}
                title={t("detail.dettagliTitle")}
                description={t("detail.dettagliDescription")}
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
              <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("detail.contesto")}</p>
              <div className="mt-5 grid gap-4">
                <InfoRow label={t("detail.tipo")} value={property.type} />
                <InfoRow label={t("detail.indirizzo")} value={property.address} />
                <InfoRow label={t("detail.rating")} value={property.ratingLabel} />
                <InfoRow label={t("detail.recensioni")} value={property.reviewCountLabel} />
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]" data-reveal>
            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft float-on-hover">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">{t("detail.prenotazione")}</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight">{t("detail.prenotazioneTitle")}</h2>
              <p className="mt-4 max-w-2xl text-paper/78">
                {t("detail.prenotazioneDescription")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContactButton propertySlug={property.slug}>{tc("prenotaSubito")}</ContactButton>
                <BookingButton name={property.name} href={property.bookingUrl} context="detail-footer">
                  {tc("prenotaBooking")}
                </BookingButton>
                {property.reviewsUrl ? (
                  <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="detail-footer">
                    {tc("leggiRecensioni")}
                  </BookingReviewsLink>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("detail.sintesi")}</p>
              <div className="mt-5 grid gap-4">
                <InfoRow label={t("detail.idealePer")} value={property.bestFor ?? t("compareFallbackBestFor")} />
                <InfoRow label={t("detail.posizione")} value={property.locationNote} />
                <InfoRow
                  label={t("detail.notaFonte")}
                  value={property.sourceNote ?? t("compareFallbackSourceNote")}
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
