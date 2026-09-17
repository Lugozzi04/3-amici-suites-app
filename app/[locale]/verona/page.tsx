import type { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { properties } from "@/lib/site";

const BASE_PATH = "/3-amici-suites";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "verona" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const ts = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${tn("verona")} | ${ts("name")}`,
    description: t("subtitle"),
  };
}

export default async function VeronaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("verona");
  const tn = await getTranslations("nav");
  const messages = await getMessages();
  const veronaMessages = messages.verona as { experiences: Array<{ title: string; description: string; action: string; href?: string }> };

  return (
    <section className="py-16 lg:py-20" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow={tn("verona")}
              title={t("title")}
              description={t("subtitle")}
            />
            <ImageFrame
              src={properties[3].image}
              alt="Interno contemporaneo di 3 Amici all'Arena"
              className="aspect-[4/3]"
              priority
            />
          </div>
          <div className="grid gap-4" data-stagger>
            {veronaMessages.experiences.map((item) => (
              <div key={item.title} className="rounded-3xl border border-stone/20 bg-white p-6 shadow-soft">
                <h2 className="font-serif text-3xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink/70">{item.description}</p>
                {item.href ? (
                  item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-olive/80 transition"
                    >
                      {item.action} ↗
                    </a>
                  ) : (
                    <a
                      href={`${BASE_PATH}${item.href}`}
                      download
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-olive hover:text-olive/80 transition"
                    >
                      {item.action} ↓
                    </a>
                  )
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
