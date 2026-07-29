"use client";

import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { it } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

type AvailabilityRangePickerProps = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onClear: () => void;
};

export function AvailabilityRangePicker({ value, onChange, onClear }: AvailabilityRangePickerProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const currentMonth = startOfMonth(new Date());

  const previewRange = useMemo(() => {
    if (!value?.from || value.to || !hoveredDate) {
      return undefined;
    }

    const start = value.from < hoveredDate ? value.from : hoveredDate;
    const end = value.from < hoveredDate ? hoveredDate : value.from;

    return { from: start, to: end };
  }, [hoveredDate, value]);

  const nights = value?.from && value?.to ? differenceInDays(value.from, value.to) : null;

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-stone/15 bg-white/76 shadow-[0_18px_34px_rgba(35,33,31,0.05)]">
      <div className="border-b border-stone/12 bg-gradient-to-b from-white/92 to-[#f7f1e8] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-earth">Date</p>
            <h4 className="mt-1 text-lg font-medium text-ink">Scegli il soggiorno</h4>
            <p className="mt-2 text-sm leading-6 text-ink/62">
              Tocca una data di arrivo, poi una di partenza. Il range si evidenzia in modo chiaro e raffinato.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setHoveredDate(undefined);
              onClear();
            }}
            className={cn(
              "rounded-full border border-stone/20 bg-white/80 px-4 py-2 text-xs font-medium text-ink transition",
              "hover:border-ink/20 hover:bg-white hover:shadow-soft",
              !value?.from && !value?.to && "cursor-default opacity-60 hover:shadow-none",
            )}
            disabled={!value?.from && !value?.to}
          >
            Azzera
          </button>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">
        <div className="mb-3 flex items-center gap-2 px-1 sm:px-0">
          <button
            type="button"
            aria-label="Vai al mese precedente"
            onClick={() => setMonth((current) => startOfMonth(addMonths(current, -1)))}
            disabled={month <= currentMonth}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone/20 bg-white/88 text-ink transition",
              "shadow-[0_10px_20px_rgba(35,33,31,0.08)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_24px_rgba(35,33,31,0.12)]",
              "focus:outline-none focus:ring-2 focus:ring-olive/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
            )}
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="Vai al mese successivo"
            onClick={() => setMonth((current) => startOfMonth(addMonths(current, 1)))}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone/20 bg-white/88 text-ink transition",
              "shadow-[0_10px_20px_rgba(35,33,31,0.08)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_24px_rgba(35,33,31,0.12)]",
              "focus:outline-none focus:ring-2 focus:ring-olive/50",
            )}
          >
            <span className="text-lg leading-none">›</span>
          </button>
        </div>

        <DayPicker
          aria-label="Seleziona il periodo di soggiorno"
          mode="range"
          selected={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={(nextRange) => {
            onChange(nextRange);
            if (!nextRange?.from || nextRange.to) {
              setHoveredDate(undefined);
            }
          }}
          onDayMouseEnter={(day) => {
            if (value?.from && !value.to) {
              setHoveredDate(day);
            }
          }}
          disabled={{ before: startOfToday() }}
          locale={it}
          numberOfMonths={1}
          hideNavigation
          showOutsideDays
          weekStartsOn={1}
          captionLayout="label"
          fromMonth={currentMonth}
          className="availability-calendar"
          modifiers={previewRange ? { preview: previewRange } : undefined}
          modifiersClassNames={{ preview: "availability-calendar__preview" }}
        />
      </div>

      <div className="border-t border-stone/12 bg-white/58 px-4 py-4 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <RangeSummary label="Arrivo" value={formatSummaryDate(value?.from)} />
          <RangeSummary label="Partenza" value={formatSummaryDate(value?.to)} />
          <RangeSummary label="Notti" value={nights === null ? "—" : formatNights(nights)} />
        </div>

        <p className="mt-3 text-xs leading-6 text-ink/58">
          Il picker è pensato per un uso rapido: un click per entrare, un click per uscire.
        </p>
      </div>
    </section>
  );
}

function RangeSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-stone/15 bg-[#faf7f1] px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-earth">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function formatSummaryDate(date: Date | undefined) {
  if (!date) {
    return "Seleziona";
  }

  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatNights(nights: number) {
  return nights === 1 ? "1 notte" : `${nights} notti`;
}

function differenceInDays(start: Date, end: Date) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.round((endUtc - startUtc) / 86400000));
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
