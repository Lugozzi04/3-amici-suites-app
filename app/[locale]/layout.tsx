import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollEffects } from "@/components/scroll-effects";
import { CookieBanner } from "@/components/cookie-banner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    setRequestLocale(routing.defaultLocale);
  } else {
    setRequestLocale(locale);
  }
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ScrollEffects />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
