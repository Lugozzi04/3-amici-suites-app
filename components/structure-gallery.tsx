"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageFrame } from "@/components/image-frame";
import { cn } from "@/lib/utils";
import type { HomeGalleryGroup } from "@/lib/home-gallery";

type StructureGalleryProps = {
  groups: HomeGalleryGroup[];
  intervalMs?: number;
  className?: string;
};

type Slot = {
  name: string;
  subtitle: string;
  images: string[];
};

const SLOT_COUNT = 4;
const TRANSITION_MS = 700;
const LAYOUTS = [
  "lg:col-span-7 aspect-[16/10]",
  "lg:col-span-5 aspect-[16/10]",
  "lg:col-span-5 aspect-[16/10]",
  "lg:col-span-7 aspect-[16/10]",
];

export function StructureGallery({ groups, intervalMs = 6000, className }: StructureGalleryProps) {
  const slots = useMemo<Slot[]>(
    () =>
      groups
        .filter((group) => group.images.length > 0)
        .slice(0, SLOT_COUNT)
        .map((group) => ({
          name: group.name,
          subtitle: group.subtitle,
          images: [...new Set(group.images)],
        })),
    [groups],
  );

  const [selection, setSelection] = useState<string[]>(
    () => slots.map((slot) => pickRandomImage(slot.images)),
  );
  const [order, setOrder] = useState<number[]>(() => shuffleIndexes(slots.length));
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setSelection(slots.map((slot) => pickRandomImage(slot.images)));
    setOrder(shuffleIndexes(slots.length));
    setTransitioning(false);
  }, [slots]);

  useEffect(() => {
    if (slots.length < SLOT_COUNT) {
      return;
    }

    const timer = window.setInterval(() => {
      setTransitioning(true);

      window.setTimeout(() => {
        setSelection((current) =>
          slots.map((slot, index) => pickRandomImage(slot.images, current[index])),
        );
        setOrder(shuffleIndexes(slots.length));
        window.requestAnimationFrame(() => setTransitioning(false));
      }, TRANSITION_MS);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slots, intervalMs]);

  if (slots.length < SLOT_COUNT) {
    return null;
  }

  return (
    <section className={cn("grid gap-4 lg:grid-cols-12", className)} aria-label="Gallery strutture">
      {order.map((slotIndex, position) => {
        const slot = slots[slotIndex];
        const src = selection[slotIndex];

        return (
          <GalleryTile
            key={`${slot.name}-${src}-${position}`}
            src={src}
            name={slot.name}
            subtitle={slot.subtitle}
            className={LAYOUTS[position] ?? "lg:col-span-6 aspect-[16/10]"}
            transitioning={transitioning}
            delay={position * 120}
          />
        );
      })}
    </section>
  );
}

function GalleryTile({
  src,
  name,
  subtitle,
  className,
  transitioning,
  delay,
}: {
  src: string;
  name: string;
  subtitle: string;
  className: string;
  transitioning: boolean;
  delay: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [src]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.8rem] transition-all duration-1000 ease-out will-change-transform",
        transitioning
          ? "opacity-80 scale-[0.988] blur-[5px]"
          : ready
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 translate-y-4 scale-[0.985] blur-[2px]",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <ImageFrame src={src} alt={name} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/14 via-transparent to-transparent opacity-0 transition duration-1000 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 opacity-0 translate-y-2 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="rounded-[1.2rem] border border-white/35 bg-ink/55 px-4 py-3 text-paper backdrop-blur-md shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.28em] text-paper/70">{subtitle}</p>
          <p className="mt-1 text-sm font-medium leading-tight">{name}</p>
        </div>
      </div>
    </div>
  );
}

function pickRandomImage(images: string[], previous?: string) {
  if (images.length === 0) {
    return "";
  }

  const pool = images.filter((image) => image !== previous);
  const nextPool = pool.length > 0 ? pool : images;
  return nextPool[Math.floor(Math.random() * nextPool.length)];
}

function shuffleIndexes(length: number) {
  const indexes = Array.from({ length }, (_, index) => index);

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
  }

  return indexes;
}
