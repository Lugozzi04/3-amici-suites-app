"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageFrame } from "@/components/image-frame";
import { cn } from "@/lib/utils";

type PropertyImageCarouselProps = {
  name: string;
  type: string;
  images: string[];
  className?: string;
};

export function PropertyImageCarousel({ name, type, images, className }: PropertyImageCarouselProps) {
  const safeImages = useMemo(() => [...new Set(images)].filter(Boolean), [images]);
  const [index, setIndex] = useState(() => getInitialIndex(name, safeImages.length));
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (safeImages.length === 0) {
    return null;
  }

  const currentImage = safeImages[index % safeImages.length];

  function move(direction: 1 | -1) {
    if (safeImages.length < 2 || transitioning) {
      return;
    }

    setTransitioning(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIndex((current) => wrapIndex(current + direction, safeImages.length));
      window.requestAnimationFrame(() => setTransitioning(false));
      timeoutRef.current = null;
    }, 180);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.9rem] transition-all duration-700 ease-out",
        transitioning ? "scale-[0.986] opacity-85 blur-[6px]" : "scale-100 opacity-100 blur-0",
        className,
      )}
    >
      <ImageFrame
        src={currentImage}
        alt={`${name} - immagine ${index + 1}`}
        className="aspect-square h-full w-full rounded-[1.9rem] shadow-none"
        sizes="(max-width: 768px) 100vw, 40vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 opacity-0 translate-y-2 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="rounded-[1rem] border border-white/35 bg-ink/55 px-4 py-3 text-paper backdrop-blur-md shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.28em] text-paper/70">{type}</p>
          <p className="mt-1 text-sm font-medium leading-tight">{name}</p>
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-75 transition duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={`Immagine precedente di ${name}`}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-stone-100/40 text-ink/55 shadow-sm backdrop-blur-sm transition hover:bg-stone-100/60 hover:text-ink focus:outline-none focus:ring-2 focus:ring-olive/50"
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={`Immagine successiva di ${name}`}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-stone-100/40 text-ink/55 shadow-sm backdrop-blur-sm transition hover:bg-stone-100/60 hover:text-ink focus:outline-none focus:ring-2 focus:ring-olive/50"
          >
            <span className="text-lg leading-none">›</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function getInitialIndex(name: string, length: number) {
  if (length <= 1) {
    return 0;
  }

  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }

  return hash % length;
}

function wrapIndex(index: number, length: number) {
  return (index % length + length) % length;
}
