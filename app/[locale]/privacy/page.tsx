import { Container } from "@/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });
  const ts = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${t("title")} | ${ts("name")}`,
    description: t("intro"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <section className="py-16 sm:py-20 lg:py-24" data-reveal>
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-earth">
            {t("title")}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-ink/50">{t("lastUpdated")}</p>

          <p className="mt-8 text-base leading-7 text-ink/75">{t("intro")}</p>

          <div className="mt-10 space-y-10">
            <Section title={t("controller.title")}>
              <p>{t("controller.content")}</p>
            </Section>

            <Section title={t("dataCollected.title")}>
              <ul className="list-disc space-y-2 pl-5">
                {(
                  t.raw("dataCollected.items") as string[]
                ).map((item: string) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title={t("purpose.title")}>
              <ul className="list-disc space-y-2 pl-5">
                {(
                  t.raw("purpose.items") as string[]
                ).map((item: string) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title={t("legalBasis.title")}>
              <p>{t("legalBasis.content")}</p>
            </Section>

            <Section title={t("thirdParties.title")}>
              <p>{t("thirdParties.content")}</p>
            </Section>

            <Section title={t("retention.title")}>
              <p>{t("retention.content")}</p>
            </Section>

            <Section title={t("rights.title")}>
              <p>{t("rights.content")}</p>
              <p className="mt-3">{t("rights.complaint")}</p>
            </Section>

            <Section title={t("cookies.title")}>
              <p>{t("cookies.content")}</p>
            </Section>

            <Section title={t("updates.title")}>
              <p>{t("updates.content")}</p>
            </Section>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-ink/70">{children}</div>
    </div>
  );
}
