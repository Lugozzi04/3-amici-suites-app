"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageFrame } from "@/components/image-frame";
import { cn } from "@/lib/utils";

type RotatingGalleryProps = {
  title: string;
  images: string[];
  intervalMs?: number;
  className?: string;
};

const LAYOUTS = [
  "lg:col-span-7 aspect-[16/10]",
  "lg:col-span-5 aspect-[16/10]",
  "lg:col-span-5 aspect-[16/10]",
  "lg:col-span-7 aspect-[16/10]",
];

const SLOT_COUNT = 4;
const TRANSITION_MS = 560;

export function RotatingGallery({ title, images, intervalMs = 6000, className }: RotatingGalleryProps) {
  const normalizedImages = useMemo(() => Array.from(new Set(images)), [images]);
  const [selection, setSelection] = useState(() => pickSelection(normalizedImages, SLOT_COUNT));
  const [cycle, setCycle] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setSelection(pickSelection(normalizedImages, SLOT_COUNT));
    setCycle(0);
    setTransitioning(false);
  }, [normalizedImages]);

  useEffect(() => {
    if (normalizedImages.length <= SLOT_COUNT) {
      return;
    }

    normalizedImages.forEach((src) => {
      const preloader = new window.Image();
      preloader.src = src;
    });

    const swapSelection = () => {
      setTransitioning(true);
      window.setTimeout(() => {
        setSelection((current) => pickSelection(normalizedImages, SLOT_COUNT, current));
        setCycle((value) => value + 1);
        window.requestAnimationFrame(() => setTransitioning(false));
      }, TRANSITION_MS);
    };

    const timer = window.setInterval(swapSelection, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [normalizedImages, intervalMs]);

  return (
    <section className={cn("grid gap-4 lg:grid-cols-12", className)} aria-label={`${title} gallery`}>
      {selection.map((src, index) => (
        <AnimatedGalleryTile
          key={`${cycle}-${src}-${index}`}
          src={src}
          alt={`${title} gallery ${index + 1}`}
          className={LAYOUTS[index] ?? "lg:col-span-6 aspect-[16/10]"}
          delay={index * 110}
          transitioning={transitioning}
        />
      ))}
    </section>
  );
}

function AnimatedGalleryTile({
  src,
  alt,
  className,
  delay,
  transitioning,
}: {
  src: string;
  alt: string;
  className: string;
  delay: number;
  transitioning: boolean;
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
          ? "opacity-65 scale-[0.985] blur-[7px]"
          : ready
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 translate-y-4 scale-[0.985] blur-[2px]",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <ImageFrame src={src} alt={alt} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/12 via-transparent to-transparent opacity-0 transition duration-1000 group-hover:opacity-100" />
    </div>
  );
}

function pickSelection(pool: string[], count: number, previous: string[] = []) {
  if (pool.length <= count) {
    return [...pool].slice(0, count);
  }

  const uniquePool = Array.from(new Set(pool));
  let selection = shuffle(uniquePool).slice(0, count);
  let attempts = 0;

  while (
    attempts < 8 &&
    previous.length === count &&
    selection.every((item, index) => item === previous[index])
  ) {
    selection = shuffle(uniquePool).slice(0, count);
    attempts += 1;
  }

  if (previous.length === count) {
    const changedSlots = selection.filter((item, index) => item !== previous[index]).length;
    if (changedSlots === 0) {
      const alternative = uniquePool.find((item) => !previous.includes(item));
      if (alternative) {
        selection[0] = alternative;
      }
    }
  }

  return selection;
}

function shuffle(values: string[]) {
  const next = [...values];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}
