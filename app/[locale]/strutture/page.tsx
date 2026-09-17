import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { PropertyCard } from "@/components/property-card";
import { BookingButton, BookingReviewsLink, ContactButton } from "@/components/booking-cta";
import { properties } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("strutture");
  const ts = await getTranslations("site");
  return {
    title: `${t("title")} | ${ts("name")} Verona`,
    description: t("subtitle"),
  };
}

export default async function PropertiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("strutture");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");

  const compareTags: Record<string, { label: string; value: string }[]> = {
    "3-amici-suites": [
      { label: t("compareIdealePer"), value: t("properties.suites.bestFor") },
      { label: t("compareDotazioni"), value: t("properties.suites.tags") },
    ],
    "3-amici-al-teatro": [
      { label: t("compareIdealePer"), value: t("properties.teatro.bestFor") },
      { label: t("compareDotazioni"), value: t("properties.teatro.tags") },
    ],
    "3-amici-al-castello": [
      { label: t("compareIdealePer"), value: t("properties.castello.bestFor") },
      { label: t("compareDotazioni"), value: t("properties.castello.tags") },
    ],
    "3-amici-all-arena": [
      { label: t("compareIdealePer"), value: t("properties.arena.bestFor") },
      { label: t("compareDotazioni"), value: t("properties.arena.tags") },
    ],
  };

  return (
    <section className="py-16 lg:py-20" data-reveal>
      <Container>
        <SectionHeading
          eyebrow={tn("strutture")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4" data-stagger>
          {properties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-white/60 bg-white/72 p-8 shadow-soft backdrop-blur" data-reveal>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("compareLabel")}</p>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              {t("compareTitle")}
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-4" data-stagger>
            {properties.map((property) => {
              const tags = compareTags[property.slug] ?? [
                { label: t("compareIdealePer"), value: property.bestFor ?? t("compareFallbackBestFor") },
                { label: t("compareDotazioni"), value: property.badges.slice(0, 3).join(" · ") },
              ];
              return (
                <article
                  key={property.slug}
                  className="rounded-[1.6rem] border border-stone/15 bg-[#f8f3eb] p-5 shadow-sm float-on-hover glow-edges"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-earth">{property.type}</p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{property.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{property.address}</p>

                  <div className="mt-4 grid gap-3">
                    {tags.map((row) => (
                      <InfoRow key={row.label} label={row.label} value={row.value} />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ContactButton propertySlug={property.slug}>{tc("prenotaSubito")}</ContactButton>
                    <BookingButton name={property.name} href={property.bookingUrl} context="compare-section">
                      {tc("prenotaBooking")}
                    </BookingButton>
                    {property.reviewsUrl ? (
                      <BookingReviewsLink name={property.name} href={property.reviewsUrl} context="compare-section">
                        {tc("leggiRecensioni")}
                      </BookingReviewsLink>
                    ) : null}
                  </div>
                </article>
              );
            })}
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
