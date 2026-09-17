"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { trackOutboundClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { buildContactHref } from "@/src/lib/contact-links";

type BookingCtaBase = {
  name: string;
  href: string;
  className?: string;
  context?: string;
  children: React.ReactNode;
};

function outboundProps(name: string, href: string, context?: string) {
  return {
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick: () => trackOutboundClick({ label: name, href, context }),
  };
}

const baseButton =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 focus:ring-offset-paper float-on-hover glow-edges";

export function BookingButton({ name, href, className, context, children }: BookingCtaBase) {
  return (
    <a
      href={href}
      aria-label={`Prenota ${name} su Booking`}
      className={cn(
        baseButton,
        "border border-stone/35 bg-white text-ink shadow-soft hover:-translate-y-0.5 hover:border-ink/25 hover:bg-[#faf8f3]",
        className,
      )}
      {...outboundProps(name, href, context)}
    >
      {children}
    </a>
  );
}

export function BookingReviewsLink({
  name,
  href,
  className,
  context,
  children,
}: BookingCtaBase) {
  return (
    <a
      href={href}
      aria-label={`Leggi le recensioni di ${name} su Booking`}
      className={cn("text-sm text-olive transition hover:text-[#556146]", className)}
      {...outboundProps(name, href, context)}
    >
      {children}
    </a>
  );
}

export function ContactButton({
  href = "/contatti",
  propertySlug,
  className,
  children,
}: {
  href?: string;
  propertySlug?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const resolvedHref =
    href !== "/contatti"
      ? href
      : propertySlug
        ? buildContactHref(propertySlug, { anchor: "#availability-checker" })
        : href;

  // Prepend locale to internal paths
  const localeHref = resolvedHref.startsWith("/")
    ? `/${locale}${resolvedHref}`
    : resolvedHref;

  return (
    <Link
      href={localeHref}
      className={cn(
        baseButton,
        "bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-black",
        className,
      )}
    >
      {children}
    </Link>
  );
}
