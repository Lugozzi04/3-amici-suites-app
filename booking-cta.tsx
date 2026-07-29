"use client";

import Link from "next/link";
import { trackOutboundClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { buildContactHref, buildPropertyInquiryMessage } from "@/src/lib/contact-links";
import { getBookingPropertyBySlug } from "@/src/data/bookingLinks";

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
        "border border-stone/40 bg-white/70 text-ink shadow-soft hover:-translate-y-0.5 hover:border-ink/30 hover:bg-white",
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
  message,
  anchor,
  className,
  children,
}: {
  href?: string;
  propertySlug?: string;
  message?: string;
  anchor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const resolvedMessage =
    message ?? (propertySlug ? buildPropertyInquiryMessage(getBookingPropertyBySlug(propertySlug)?.name ?? "la struttura selezionata") : undefined);
  const resolvedHref =
    href !== "/contatti" ? href : buildContactHref(propertySlug, { message: resolvedMessage, anchor });

  return (
    <Link
      href={resolvedHref}
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
