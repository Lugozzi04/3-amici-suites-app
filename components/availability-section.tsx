"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AvailabilityChecker } from "@/components/availability-checker";

type HealthStatus = "loading" | "healthy" | "broken";

export function AvailabilitySection({ initialPropertySlug }: { initialPropertySlug?: string }) {
  const t = useTranslations("contatti");
  const [health, setHealth] = useState<HealthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/3-amici-suites/api/admin/feeds-health/");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) {
          setHealth(data.anyValid ? "healthy" : "broken");
        }
      } catch {
        if (!cancelled) {
          setHealth("healthy");
        }
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  if (health === "loading") {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 shadow-soft backdrop-blur">
        <div className="animate-pulse space-y-4 px-6 py-10">
          <div className="h-4 w-32 rounded-xl bg-stone/20" />
          <div className="h-7 w-64 rounded-xl bg-stone/20" />
          <div className="h-4 w-96 rounded-xl bg-stone/15" />
          <div className="mt-6 h-12 rounded-2xl bg-stone/10" />
          <div className="h-64 rounded-2xl bg-stone/10" />
        </div>
      </div>
    );
  }

  if (health === "broken") {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-amber-200/60 bg-amber-50/90 shadow-soft backdrop-blur">
        <div className="border-b border-amber-200/50 bg-gradient-to-b from-amber-50/95 to-[#faf5ed] px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9b6a2f]">{t("availability.title")}</p>
          <h3 className="mt-3 font-serif text-[1.9rem] leading-none text-ink sm:text-[2.1rem]">
            {t("availability.updatingTitle")}
          </h3>
          <p className="mt-3 max-w-[36rem] text-sm leading-7 text-ink/68">
            {t("availability.updatingDescription")}
          </p>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div className="rounded-[1.4rem] border border-amber-200/40 bg-white/80 p-5 text-sm leading-7 text-ink/68">
            <p className="font-medium text-[#9b6a2f]">{t("availability.whatHappened")}</p>
            <p className="mt-2">
              {t("availability.whatHappenedDesc")}
            </p>
            <p className="mt-3">
              {t("availability.whatHappenedNote")}
            </p>
          </div>
          <p className="text-xs leading-6 text-ink/50">
            {t("availability.autoRestore")}
          </p>
        </div>
      </section>
    );
  }

  return <AvailabilityChecker initialPropertySlug={initialPropertySlug} />;
}
