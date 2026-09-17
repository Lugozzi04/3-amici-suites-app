"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

type Consent = "pending" | "all" | "necessary" | "rejected";

const COOKIE_NAME = "3amici-cookie-consent";
const COOKIE_DAYS = 180;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(value: Consent) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function CookieBanner() {
  const t = useTranslations("cookie");
  const locale = useLocale();
  const [consent, setConsent] = useState<Consent>("pending");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = getCookie(COOKIE_NAME) as Consent | null;
    if (stored && ["all", "necessary", "rejected"].includes(stored)) {
      setConsent(stored);
    }
  }, []);

  const handleChoice = useCallback(
    (choice: Consent) => {
      setCookie(choice);
      setConsent(choice);
    },
    [],
  );

  if (consent !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/30 bg-[#faf7f0]/98 p-5 shadow-[0_-8px_40px_rgba(35,33,31,0.12)] backdrop-blur-xl sm:p-6">
        <p className="font-serif text-lg leading-tight text-ink">
          {t("title")}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/68">
          {t("description")}
        </p>

        {showDetails ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-stone/15 bg-white/70 p-4 text-sm leading-6 text-ink/68">
            <div>
              <p className="font-medium text-ink">{t("necessaryTitle")}</p>
              <p>{t("necessaryDesc")}</p>
            </div>
            <div>
              <p className="font-medium text-ink">{t("analyticsTitle")}</p>
              <p>{t("analyticsDesc")}</p>
            </div>
            <div>
              <p className="font-medium text-ink">{t("marketingTitle")}</p>
              <p>{t("marketingDesc")}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleChoice("all")}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-black"
          >
            {t("acceptAll")}
          </button>
          <button
            type="button"
            onClick={() => handleChoice("necessary")}
            className="rounded-full border border-stone/25 bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-0.5"
          >
            {t("onlyNecessary")}
          </button>
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="rounded-full border border-stone/25 bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-0.5"
          >
            {t("rejectAll")}
          </button>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-earth underline-offset-2 transition hover:text-ink hover:underline"
          >
            {showDetails ? t("hideDetails") : t("customize")}
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink/45">
          <Link
            href={`/${locale}/privacy`}
            className="underline underline-offset-2 hover:text-earth transition"
          >
            {t("privacyPolicy")}
          </Link>
        </p>
      </div>
    </div>
  );
}
