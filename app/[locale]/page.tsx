import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { PropertyCard } from "@/components/property-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { AmenitiesGrid } from "@/components/amenities-grid";
import { properties } from "@/lib/site";
import { getHomeGalleryGroups } from "@/lib/home-gallery";
import { StructureGallery } from "@/components/structure-gallery";
import { contactInfo } from "@/src/data/site-content";

const BASE_PATH = "/3-amici-suites";
const homeGalleryGroups = getHomeGalleryGroups();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ts = await getTranslations("site");
  return {
    title: `${ts("name")} | ${ts("tagline")}`,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const ts = await getTranslations("site");
  const tc = await getTranslations("common");
  const tStr = await getTranslations("strutture");
  const tV = await getTranslations("verona");
  const th = await getTranslations("homeSections");

  const heroStats = [
    { value: t("stats.years.value"), label: t("stats.years.label") },
    { value: t("stats.rating.value"), label: t("stats.rating.label") },
    { value: t("stats.reviews.value"), label: t("stats.reviews.label") },
  ];

  return (
    <>
      <section className="relative overflow-hidden" data-reveal>
        <div className="absolute inset-0 bg-hero-warm" />
        <div className="absolute inset-0 animated-noise opacity-[0.25]" />
        <div className="absolute left-[6%] top-[12%] h-56 w-56 rounded-full bg-olive/10 blur-3xl animate-drift" />
        <div className="absolute right-[8%] top-[8%] h-72 w-72 rounded-full bg-earth/10 blur-3xl animate-float-soft" />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-earth backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                {ts("motto")}
              </div>

              <h1 className="mt-6 max-w-xl font-serif text-[3.5rem] leading-[0.92] text-ink sm:text-[4.6rem] lg:text-[5.5rem]">
                {t("title")}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-ink/76 sm:text-xl">
                {t("subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={`/${locale}/contatti`}>{t("contactFinal.buttons.book")}</ButtonLink>
                <ButtonLink href={`/${locale}/strutture`} variant="secondary">
                  {t("contactFinal.buttons.discover")}
                </ButtonLink>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-white/55 bg-white/65 p-5 shadow-soft backdrop-blur float-on-hover glow-edges"
                  >
                    <p className="font-serif text-3xl text-ink">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ink/60">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[1.6rem] border border-white/60 bg-white/55 p-4 shadow-soft backdrop-blur glow-edges">
                <div className="grid gap-3 sm:grid-cols-3" data-stagger>
                  <div className="rounded-2xl bg-paper/55 p-4 float-on-hover">
                    <p className="text-sm font-medium text-ink">{t("highlights.items.0.title")}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{t("highlights.items.0.description")}</p>
                  </div>
                  <div className="rounded-2xl bg-paper/55 p-4 float-on-hover">
                    <p className="text-sm font-medium text-ink">{t("highlights.items.1.title")}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{t("highlights.items.1.description")}</p>
                  </div>
                  <div className="rounded-2xl bg-paper/55 p-4 float-on-hover">
                    <p className="text-sm font-medium text-ink">{t("highlights.items.2.title")}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{t("highlights.items.2.description")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full border border-white/65 bg-white/45 blur-[1px] animate-float-soft" />
              <ImageFrame
                src="/real/suite-bedroom.jpg"
                alt="3 Amici Suites a Verona"
                priority
                className="aspect-[4/5] shadow-lift"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
            <SectionHeading
              eyebrow={th("strutture")}
              title={tStr("title")}
              description={tStr("subtitle")}
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2" data-stagger>
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-[#efe4d6]/80 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              eyebrow={th("servizi")}
              title={t("services.title")}
              description={t("services.subtitle")}
            />
            <div className="rounded-[1.8rem] border border-white/55 bg-white/55 p-6 shadow-soft backdrop-blur glow-edges">
              <AmenitiesGrid items={t.raw("services.items")} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <SectionHeading
            title={t("gallery.subtitle")}
          />
          <div className="mt-10">
            <StructureGallery groups={homeGalleryGroups} />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-[#efe4d6]/80 section-divider" data-reveal>
        <Container>
          <SectionHeading
            title={t("reviews.subtitle")}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft float-on-hover">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">{t("reviews.stats")}</p>
              <p className="mt-5 text-sm leading-7 text-paper/78">
                {t("reviews.statsDetail")}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3" data-stagger>
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 float-on-hover">
                    <p className="font-serif text-2xl text-paper">{stat.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-paper/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-3" data-stagger>
                {t.raw("reviews.testimonials").map((tst: {quote: string; author: string}) => (
                  <TestimonialCard key={tst.author} quote={tst.quote} author={tst.author} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr]">
            <div>
              <SectionHeading
                eyebrow={th("verona")}
                title={tV("title")}
                description={tV("subtitle")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2" data-stagger>
                {tV.raw("experiences").map((item: {title: string; description: string}) => (
                  <div
                    key={item.title}
                    className="rounded-[1.6rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-0.5 float-on-hover glow-edges"
                  >
                    <h3 className="font-serif text-[1.8rem] leading-tight text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeading
                title={t("whyUs.title")}
                description={t("whyUs.subtitle")}
              />
              <div className="rounded-[1.8rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur">
                <h3 className="font-serif text-xl text-ink">{t("whyUs.items.0.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">
                  {t("whyUs.items.0.description")}
                </p>
                <a href={`tel:${contactInfo.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-olive/80">
                  {t("whyUs.items.0.action")} →
                </a>
              </div>
              <div className="rounded-[1.8rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur">
                <h3 className="font-serif text-xl text-ink">{t("whyUs.items.1.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">
                  {t("whyUs.items.1.description")}
                </p>
                <a href={`${BASE_PATH}${t("whyUs.items.1.href")}`} download className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-olive/80">
                  {t("whyUs.items.1.action")} ↓
                </a>
              </div>
              <div className="rounded-[1.8rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur">
                <h3 className="font-serif text-xl text-ink">{t("whyUs.items.2.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">
                  {t("whyUs.items.2.description")}
                </p>
                <a href={`${BASE_PATH}${t("whyUs.items.2.href")}`} download className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-olive/80">
                  {t("whyUs.items.2.action")} ↓
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-soft backdrop-blur lg:grid-cols-[1.15fr_0.85fr] glow-edges">
            <div>
              <SectionHeading
                eyebrow={th("contattoFinale")}
                title={t("contactFinal.title")}
                description={t("contactFinal.subtitle")}
              />
            </div>
            <div className="flex flex-col justify-center gap-4">
              <ButtonLink href={`/${locale}/contatti`}>{t("contactFinal.buttons.book")}</ButtonLink>
              <ButtonLink href={`/${locale}/strutture`} variant="secondary">
                {t("contactFinal.buttons.discover")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
