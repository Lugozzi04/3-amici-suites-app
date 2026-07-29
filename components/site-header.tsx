"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { withBasePath } from "@/lib/base-path";
import { contactInfo, navigation } from "@/src/data/site-content";

export function SiteHeader() {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === withBasePath("/") || pathname === `${withBasePath("/")}/`;
  const ctaLabel = isHomePage ? "Prenota" : "Contattaci";

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-paper/75 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 magnetic-link">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-stone/20">
              <Image
                src={withBasePath("/logo.avif")}
                alt="3 Amici Suites"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-serif text-xl leading-none text-ink">3 Amici Suites</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-earth">Verona boutique hospitality</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="magnetic-link text-sm text-ink/75 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <a className="magnetic-link text-sm text-ink/70 hover:text-ink" href={`tel:${contactInfo.phone}`}>
              {contactInfo.phone}
            </a>
            <ButtonLink href="/contatti" variant="ghost">
              {ctaLabel}
            </ButtonLink>
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
