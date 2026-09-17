"use client";

import { useTranslations } from "next-intl";
import { BookingButton, ContactButton } from "@/components/booking-cta";

export function PropertyMobileCtaBar({
  name,
  bookingUrl,
  propertySlug,
}: {
  name: string;
  bookingUrl: string;
  propertySlug: string;
}) {
  const tc = useTranslations("common");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/60 bg-paper/90 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3">
        <ContactButton propertySlug={propertySlug} className="w-full">
          {tc("prenotaSubito")}
        </ContactButton>
        <BookingButton name={name} href={bookingUrl} className="w-full" context="mobile-cta-bar">
          {tc("prenotaBooking")}
        </BookingButton>
      </div>
    </div>
  );
}
