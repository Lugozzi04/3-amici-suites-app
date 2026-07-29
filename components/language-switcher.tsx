"use client";

import { useEffect, useRef, useState } from "react";

const languages = [
  { code: "IT", label: "Italiano", active: true },
  { code: "EN", label: "English", active: false },
  { code: "ES", label: "Español", active: false },
  { code: "DE", label: "Deutsch", active: false },
  { code: "FR", label: "Français", active: false },
] as const;

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
};

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (variant === "mobile") {
    return (
      <div className="rounded-[1.5rem] border border-stone/15 bg-white/86 p-4 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.28em] text-earth">Lingua</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              aria-pressed={language.active}
              className={[
                "rounded-full border px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition",
                language.active
                  ? "border-ink bg-ink text-paper shadow-soft"
                  : "border-stone/15 bg-paper text-ink/70 hover:border-olive/30 hover:bg-[#faf7f0]",
              ].join(" ")}
            >
              {language.code}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative hidden md:flex">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Apri selettore lingua"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-stone/15 bg-white/82 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] text-paper">IT</span>
        <span className="text-earth">Italiano</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={["h-4 w-4 text-ink/55 transition", open ? "rotate-180" : ""].join(" ")}>
          <path d="M5.25 7.75 10 12.5l4.75-4.75" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[14rem] overflow-hidden rounded-[1.4rem] border border-stone/15 bg-paper/96 p-2 shadow-lift backdrop-blur-xl">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-earth">Lingua</p>
          <div role="listbox" aria-label="Selettore lingua" className="grid gap-1">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                aria-selected={language.active}
                className={[
                  "flex w-full items-center justify-between rounded-[1rem] px-3 py-2.5 text-left text-sm transition",
                  language.active
                    ? "bg-ink text-paper shadow-soft"
                    : "text-ink/74 hover:bg-[#f6efe5] hover:text-ink",
                ].join(" ")}
              >
                <span className="font-medium uppercase tracking-[0.16em]">{language.code}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">{language.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
