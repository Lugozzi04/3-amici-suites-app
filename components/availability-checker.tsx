"use client";

import { useActionState, useState } from "react";
import { type DateRange } from "react-day-picker";
import { useTranslations, useLocale } from "next-intl";

import { checkAvailabilityAction } from "@/lib/contatti-actions";
import { BookingButton } from "@/components/booking-cta";
import { AvailabilityRangePicker } from "@/components/availability-range-picker";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { buildAvailabilityInquiryMessage } from "@/src/lib/contact-links";
import {
  ALL_AVAILABILITY_STRUCTURE_SLUG,
  availabilityStructureMenuOptions,
} from "@/src/data/availabilityFeeds";
import { getBookingPropertyBySlug } from "@/src/data/bookingLinks";
import type { AvailabilityRoomResult, AvailabilitySearchResult } from "@/src/lib/availability";

type AvailabilitySubmission = {
  propertySlug: string;
  checkIn: string;
  checkOut: string;
};

type AvailabilityCheckerState =
  | { kind: "idle" }
  | { kind: "error"; message: string; submitted: AvailabilitySubmission }
  | { kind: "success"; data: AvailabilitySearchResult; submitted: AvailabilitySubmission };

type StructureHealth = {
  propertySlug: string;
  propertyName: string;
  hasValidFeed: boolean;
};

type AvailabilityCheckerProps = {
  initialPropertySlug?: string;
  onRequestContactMessage?: (message: string) => void;
  structureHealth?: StructureHealth[];
};

export function AvailabilityChecker({
  initialPropertySlug,
  onRequestContactMessage,
  structureHealth = [],
}: AvailabilityCheckerProps) {
  const t = useTranslations("contatti.availability.checker");
  const locale = useLocale();
  const validSlugs = new Set(structureHealth.filter(s => s.hasValidFeed).map(s => s.propertySlug));
  const invalidStructures = structureHealth.filter(s => !s.hasValidFeed);
  const initialStructureSlug = availabilityStructureMenuOptions.some(
    (option) => option.propertySlug === initialPropertySlug,
  )
    ? initialPropertySlug
    : ALL_AVAILABILITY_STRUCTURE_SLUG;
  const [propertySlug, setPropertySlug] = useState(initialStructureSlug);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);
  const [state, formAction, isPending] = useActionState<AvailabilityCheckerState, FormData>(
    checkAvailabilityAction,
    { kind: "idle" },
  );

  const checkIn = selectedRange?.from ? formatDateInputValue(selectedRange.from) : "";
  const checkOut = selectedRange?.to ? formatDateInputValue(selectedRange.to) : "";
  const canSubmit =
    Boolean(propertySlug && selectedRange?.from && selectedRange?.to && selectedRange.to > selectedRange.from) &&
    !isPending;
  const submittedMatchesDraft =
    state.kind !== "idle" &&
    state.submitted.propertySlug === propertySlug &&
    state.submitted.checkIn === checkIn &&
    state.submitted.checkOut === checkOut;
  const result = state.kind === "success" && submittedMatchesDraft ? state.data : null;
  const activeError = state.kind === "error" && submittedMatchesDraft ? state.message : null;
  const availableRooms = result?.rooms.filter((room) => room.status === "available") ?? [];
  const visibleRooms =
    result && propertySlug === ALL_AVAILABILITY_STRUCTURE_SLUG
      ? result.rooms.filter((room) => room.status === "available")
      : result?.rooms ?? [];

  return (
    <section
      id="availability-checker"
      className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 shadow-soft backdrop-blur"
      data-reveal
    >
      <div className="border-b border-stone/15 bg-gradient-to-b from-white/95 to-[#f8f2e9] px-6 py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-earth">{t("eyebrow")}</p>
        <h3 className="mt-3 font-serif text-[1.9rem] leading-none text-ink sm:text-[2.1rem]">
          {t("heading")}
        </h3>
        <p className="mt-3 max-w-[36rem] text-sm leading-7 text-ink/68">
          {t("description")}
        </p>
      </div>

      <div className="space-y-5 px-6 py-6">
        {invalidStructures.length > 0 ? (
          <div className="rounded-[1.4rem] border border-amber-200/40 bg-amber-50/60 p-4 text-sm leading-7 text-ink/68">
            <p className="font-medium text-[#9b6a2f]">
              {t("outdatedFeedsTitle")}
            </p>
            <p className="mt-1">
              {invalidStructures.map((s) => s.propertyName).join(", ")}
            </p>
            <p className="mt-2 text-xs text-ink/50">
              {t("outdatedFeedsNote")}
            </p>
          </div>
        ) : null}
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-[12px] uppercase tracking-[0.22em] text-earth">{t("structureLabel")}</span>
              <select
                name="propertySlug"
                value={propertySlug}
                onChange={(event) => setPropertySlug(event.target.value)}
                className="h-12 rounded-2xl border border-stone/20 bg-paper/70 px-4 text-sm text-ink outline-none transition focus:border-olive focus:bg-white"
              >
                {availabilityStructureMenuOptions
                  .filter((option) => option.propertySlug === ALL_AVAILABILITY_STRUCTURE_SLUG || validSlugs.has(option.propertySlug))
                  .map((option) => (
                  <option key={option.propertySlug} value={option.propertySlug}>
                    {option.propertyName}
                  </option>
                ))}
              </select>
            </label>

            <AvailabilityRangePicker
              value={selectedRange}
              onChange={setSelectedRange}
              onClear={() => setSelectedRange(undefined)}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={!canSubmit} className="h-12 px-6">
                {isPending ? t("checking") : t("verify")}
              </Button>
            </div>
          </div>

          <input type="hidden" name="checkIn" value={checkIn} />
          <input type="hidden" name="checkOut" value={checkOut} />
        </form>

        {activeError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-[#9b463d]" role="alert">
            {activeError}
          </p>
        ) : null}

        {result ? (
          <div className="space-y-4" aria-live="polite">
            <div className="rounded-[1.6rem] border border-stone/15 bg-[#f7f1e8] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-earth">{t("result")}</p>
                  <h4 className="mt-1 text-lg font-medium text-ink">{result.propertyName}</h4>
                </div>
                <span className="rounded-full border border-olive/20 bg-olive/10 px-3 py-1 text-xs font-medium text-olive">
                  {result.summary}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/66">
                {t("dateFrom")} {formatDate(result.checkIn, locale)} {t("dateTo")} {formatDate(result.checkOut, locale)}
              </p>
              {result.warning ? <p className="mt-2 text-sm text-[#9b6a2f]">{result.warning}</p> : null}
              {result.message ? <p className="mt-2 text-sm text-ink/68">{result.message}</p> : null}
            </div>

            {visibleRooms.length === 0 ? (
              <div className="rounded-[1.6rem] border border-stone/15 bg-white/80 p-5 text-sm leading-7 text-ink/72">
                {result.summaryStatus === "error"
                  ? t("verificationError")
                  : t("availabilityUnavailable")}
              </div>
            ) : (
              <div className="grid gap-4">
                {visibleRooms.map((room) => (
                    <AvailabilityResultCard
                      key={room.propertySlug + room.roomSlug}
                      room={room}
                      checkIn={result.checkIn}
                      checkOut={result.checkOut}
                      onRequestContactMessage={onRequestContactMessage}
                    />
                  ))}
                {availableRooms.length > 0 ? (
                  <p className="text-xs text-olive">
                    {t("availableSolutions", { count: availableRooms.length })}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {process.env.NODE_ENV !== "production" && state.kind !== "idle" && submittedMatchesDraft ? <AvailabilityDebugPanel state={state} result={result} /> : null}
      </div>
    </section>
  );
}

function AvailabilityResultCard({
  room,
  checkIn,
  checkOut,
  onRequestContactMessage,
}: {
  room: AvailabilityRoomResult;
  checkIn: string;
  checkOut: string;
  onRequestContactMessage?: (message: string) => void;
}) {
  const t = useTranslations("contatti.availability.checker");
  const bookingProperty = getBookingPropertyBySlug(room.propertySlug);
  const bookingUrl = room.bookingUrl ?? bookingProperty?.bookingUrl ?? "#contatti-form";
  const inquiryMessage = buildAvailabilityInquiryMessage({
    propertyName: room.propertyName,
    roomName: room.roomName,
    checkIn,
    checkOut,
  });

  const statusStyles = {
    available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    unavailable: "border-rose-200 bg-rose-50 text-[#9b463d]",
    unverifiable: "border-amber-200 bg-amber-50 text-[#9b6a2f]",
  }[room.status];

  const statusLabel = {
    available: t("statusAvailable"),
    unavailable: t("statusUnavailable"),
    unverifiable: t("statusUnverifiable"),
  }[room.status];

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-stone/15 bg-white/84 p-5 shadow-[0_18px_34px_rgba(35,33,31,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-earth">{room.propertyName}</p>
          <h4 className="mt-1 text-lg font-medium text-ink">{room.roomName}</h4>
        </div>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", statusStyles)}>{statusLabel}</span>
      </div>

      <p className="mt-3 text-sm leading-7 text-ink/68">{room.message}</p>

      {room.status === "available" ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => onRequestContactMessage?.(inquiryMessage)}
            className="bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-black"
          >
            {t("bookNow")}
          </Button>
          {bookingProperty ? (
            <BookingButton name={room.roomName} href={bookingUrl} context="availability-result-card">
              {t("bookOnBooking")}
            </BookingButton>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => onRequestContactMessage?.(inquiryMessage)}
            className="bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-black"
          >
            {t("bookNow")}
          </Button>
        </div>
      )}
    </article>
  );
}

function AvailabilityDebugPanel({
  state,
  result,
}: {
  state: AvailabilityCheckerState;
  result: AvailabilitySearchResult | null;
}) {
  if (state.kind === "idle") {
    return null;
  }

  const submitted = state.submitted;

  return (
    <details open className="rounded-[1.6rem] border border-dashed border-stone/25 bg-[#fcf9f3] px-4 py-4">
      <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-earth">
        Debug richiesta
      </summary>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 rounded-[1.3rem] border border-stone/15 bg-white/75 p-4 sm:grid-cols-3">
          <DebugField label="Property slug" value={submitted.propertySlug} />
          <DebugField label="Check-in" value={submitted.checkIn} />
          <DebugField label="Check-out" value={submitted.checkOut} />
        </div>

        {state.kind === "error" ? (
          <div className="rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-[#9b463d]">
            {state.message}
          </div>
        ) : null}

        {result ? (
          <>
            <div className="grid gap-3 rounded-[1.3rem] border border-stone/15 bg-white/75 p-4 sm:grid-cols-4">
              <DebugField label="Summary" value={result.summaryStatus} />
              <DebugField label="Disponibili" value={String(result.availableCount)} />
              <DebugField label="Totali" value={String(result.totalCount)} />
              <DebugField label="Feed" value={result.hasFeeds ? "Configurati" : "Assenti"} />
            </div>

            <div className="overflow-hidden rounded-[1.3rem] border border-stone/15 bg-white/78">
              <div className="border-b border-stone/15 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-earth">Risposta normalizzata</p>
              </div>
              <pre className="max-h-[340px] overflow-auto px-4 py-4 text-[11px] leading-6 text-ink/78">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-earth">Dettaglio feed</p>
              <div className="grid gap-3">
                {result.debug.feeds.map((feed) => (
                  <article
                    key={feed.roomSlug}
                    className="rounded-[1.3rem] border border-stone/15 bg-white/80 p-4 text-sm text-ink/75"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-earth">{feed.roomName}</p>
                        <p className="mt-1 break-all text-sm text-ink/60">{feed.feedUrl}</p>
                      </div>
                      <span className="rounded-full border border-stone/20 bg-paper px-3 py-1 text-xs font-medium text-ink">
                        {feed.status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs leading-6 text-ink/68 sm:grid-cols-2 lg:grid-cols-3">
                      <DebugField label="HTTP" value={feed.fetchStatus ? String(feed.fetchStatus) : "—"} compact />
                      <DebugField label="Content-Type" value={feed.contentType ?? "—"} compact />
                      <DebugField label="Body vuoto" value={feed.bodyIsEmpty ? "Sì" : "No"} compact />
                      <DebugField label="VEVENT" value={String(feed.veventCount ?? 0)} compact />
                      <DebugField
                        label="Intervalli"
                        value={String(feed.normalizedIntervalCount ?? 0)}
                        compact
                      />
                      <DebugField
                        label="Overlap"
                        value={typeof feed.overlap === "boolean" ? (feed.overlap ? "Bloccato" : "Libero") : "—"}
                        compact
                      />
                    </div>

                    {feed.errorMessage ? (
                      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-[#9b6a2f]">
                        {feed.errorMessage}
                      </p>
                    ) : null}

                    {feed.rawHead ? (
                      <p className="mt-3 rounded-xl border border-stone/15 bg-[#f9f4ec] px-3 py-2 text-[11px] leading-5 text-ink/72">
                        {feed.rawHead}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </details>
  );
}

function DebugField({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-[1rem] border border-stone/15 bg-[#faf7f0] px-3 py-2", compact && "px-2 py-2")}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-earth">{label}</p>
      <p className={cn("mt-1 break-words text-sm text-ink", compact && "text-xs")}>{value}</p>
    </div>
  );
}

function formatDate(value: string, locale: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
