"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { contactInfo } from "@/src/data/site-content";

const navKeys = ["home", "strutture", "verona", "chiSiamo", "contatti"] as const;

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const navHrefs: Record<string, string> = {
    home: `/${locale}`,
    strutture: `/${locale}/strutture`,
    verona: `/${locale}/verona`,
    chiSiamo: `/${locale}/chi-siamo`,
    contatti: `/${locale}/contatti`,
  };

  return (
    <footer className="border-t border-white/60 bg-[#ede3d4]/95 backdrop-blur">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-serif text-3xl text-ink magnetic-link">3 Amici Suites</p>
            <p className="max-w-md text-sm leading-7 text-ink/70">
              {t("description")}
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">{contactInfo.cin}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">{t("navigazione")}</p>
            <div className="mt-4 grid gap-3">
              {navKeys.map((key) => (
                <Link key={key} href={navHrefs[key]} className="magnetic-link text-sm text-ink/75 hover:text-ink">
                  {tn(key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">{t("contatti")}</p>
            <div className="mt-4 grid gap-3 text-sm text-ink/75">
              <a className="magnetic-link" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              <a className="magnetic-link" href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              <span>{contactInfo.address}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {contactInfo.social.map((item) => (
                <Link key={item.label} href={item.href} className="magnetic-link text-olive hover:text-[#556146]">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-ink/60">
              <Link href={`/${locale}/privacy`} className="magnetic-link hover:text-ink">
                Privacy
              </Link>
              <button
                type="button"
                onClick={() => {
                  document.cookie = "3amici-cookie-consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.reload();
                }}
                className="magnetic-link uppercase hover:text-ink"
              >
                Cookie
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
