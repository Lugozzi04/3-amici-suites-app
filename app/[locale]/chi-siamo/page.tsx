import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { withBasePath } from "@/lib/base-path";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "chiSiamo" });
  const ts = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${t("title")} | ${ts("name")}`,
    description: t("subtitle"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("chiSiamo");

  return (
    <section className="py-16 sm:py-20 lg:py-24" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              eyebrow={t("title")}
              title={t("subtitle")}
            />

            <div className="rounded-[2rem] border border-white/60 bg-white/74 p-8 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("story.title")}</p>
              <div className="mt-5 space-y-5 text-base leading-8 text-ink/74">
                <p>{t("story.paragraph1")}</p>
                <p>{t("story.paragraph2")}</p>
                <p>{t("story.paragraph3")}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">{t("logo.title")}</p>
              <p className="mt-4 text-sm leading-7 text-paper/78">
                {t("logo.text")}
              </p>
            </div>
          </div>

          <div className="grid gap-4" data-stagger>
            {/* YouTube Video */}
            <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-soft">
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/oLQMg_oCdDw?autoplay=1&mute=1&loop=1&playlist=oLQMg_oCdDw"
                  title="3 Amici Suites Verona"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Foto dei 3 Amici */}
            <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-soft">
              <Image
                src={withBasePath("/tre-amici.jpg")}
                alt="Pietro, Dario e Carlo - 3 Amici Suites"
                width={392}
                height={422}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
