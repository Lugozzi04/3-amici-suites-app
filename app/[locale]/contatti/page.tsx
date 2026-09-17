import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { ContattiMapSection } from "@/components/contatti-map-section";
import { ContactInteractionPanel } from "@/components/contact-interaction-panel";
import { SectionHeading } from "@/components/section-heading";
import { ALL_AVAILABILITY_STRUCTURE_SLUG, availabilityStructureMenuOptions, baseFeeds } from "@/src/data/availabilityFeeds";
import * as fs from "node:fs";
import * as path from "node:path";

const OVERRIDES_PATH = process.env.ICAL_OVERRIDES_PATH
  ?? path.join(process.cwd(), "src/data/ical-overrides.json");

function loadOverrides(): Record<string, string> {
  try {
    if (fs.existsSync(OVERRIDES_PATH)) {
      const raw = fs.readFileSync(OVERRIDES_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

function getFreshFeeds() {
  const overrides = loadOverrides();
  return baseFeeds.map((feed) => {
    const overrideUrl = overrides[feed.roomSlug];
    return overrideUrl ? { ...feed, icalUrl: overrideUrl } : feed;
  });
}

type StructureHealth = {
  propertySlug: string;
  propertyName: string;
  hasValidFeed: boolean;
};

type HealthCache = {
  result: { anyValid: boolean; structures: StructureHealth[] };
  timestamp: number;
};

let cachedHealth: HealthCache | null = null;
const HEALTH_CACHE_TTL = 5 * 60 * 1000; // 5 minuti

async function checkStructureHealth(): Promise<{
  anyValid: boolean;
  structures: StructureHealth[];
}> {
  // Cache hit: return immediately
  if (cachedHealth && Date.now() - cachedHealth.timestamp < HEALTH_CACHE_TTL) {
    return cachedHealth.result;
  }

  // Cache miss or stale: run health check (max ~2s con 8 request parallele)
  try {
    const feeds = getFreshFeeds();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2_000);

    const results = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const res = await fetch(feed.icalUrl, {
            headers: { Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8" },
            signal: controller.signal,
            cache: "no-store",
          });
          return res.ok;
        } catch {
          return false;
        }
      }),
    );

    clearTimeout(timeoutId);

    const propertyFeedHealth = new Map<string, boolean>();
    for (let i = 0; i < feeds.length; i++) {
      const slug = feeds[i].propertySlug;
      const valid = results[i];
      if (valid) {
        propertyFeedHealth.set(slug, true);
      } else if (!propertyFeedHealth.has(slug)) {
        propertyFeedHealth.set(slug, false);
      }
    }

    const structures = availabilityStructureMenuOptions
      .filter((opt) => opt.propertySlug !== ALL_AVAILABILITY_STRUCTURE_SLUG)
      .map((opt) => ({
        propertySlug: opt.propertySlug,
        propertyName: opt.propertyName,
        hasValidFeed: propertyFeedHealth.get(opt.propertySlug) ?? false,
      }));

    const result = {
      anyValid: results.some((ok) => ok),
      structures,
    };

    cachedHealth = { result, timestamp: Date.now() };
    return result;
  } catch {
    // On error, return stale cache if available, otherwise empty
    if (cachedHealth) return cachedHealth.result;
    return { anyValid: false, structures: [] };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contatti" });
  const ts = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${t("title")} | ${ts("name")}`,
    description: t("subtitle"),
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ structure?: string | string[]; message?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedStructure = normalizeStructureSlug(resolvedSearchParams.structure);
  const initialMessage = normalizePrefillMessage(resolvedSearchParams.message);
  const t = await getTranslations("contatti");

  const { anyValid, structures } = await checkStructureHealth();

  return (
    <section className="py-16 sm:py-20 lg:py-24" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow={t("title")}
              title={t("subtitle")}
              description={t("discount")}
            />

            <ContactInteractionPanel
              mode="form"
              initialPropertySlug={selectedStructure}
              initialMessage={initialMessage}
              showAvailabilityChecker={anyValid}
              structureHealth={structures}
            />

            <ContattiMapSection />
          </div>

          <div className="space-y-6">
            <ContactInteractionPanel
              mode="checker"
              initialPropertySlug={selectedStructure}
              initialMessage={initialMessage}
              showAvailabilityChecker={anyValid}
              structureHealth={structures}
            />

            <div className="rounded-[2rem] border border-white/60 bg-[#f8f3eb] p-6 shadow-soft" data-reveal>
              <p className="text-sm leading-7 text-ink/72">
                {t("checkAvailability")}
              </p>
            </div>

            <div className="rounded-[2rem] border border-ink/10 bg-ink p-6 text-paper shadow-soft" data-reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-sand">{t("bookingSection.title")}</p>
              <p className="mt-4 text-sm leading-7 text-paper/78">
                {t("bookingSection.text")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function normalizeStructureSlug(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate && availabilityStructureMenuOptions.some((option) => option.propertySlug === candidate)) {
    return candidate;
  }

  return ALL_AVAILABILITY_STRUCTURE_SLUG;
}

function normalizePrefillMessage(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) {
    return "";
  }

  return candidate.trim().slice(0, 1200);
}
