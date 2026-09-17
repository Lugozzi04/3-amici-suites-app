"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";

const languages = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
] as const;

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
};

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tc = useTranslations("common");

  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function switchTo(langCode: string) {
    if (langCode === locale) {
      setOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: langCode });
    });
    setOpen(false);
  }

  if (variant === "mobile") {
    return (
      <div className="rounded-[1.5rem] border border-stone/15 bg-white/86 p-4 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.28em] text-earth">{tc("language")}</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchTo(lang.code)}
              aria-pressed={lang.code === locale}
              className={[
                "rounded-full border px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition",
                lang.code === locale
                  ? "border-ink bg-ink text-paper shadow-soft"
                  : "border-stone/15 bg-paper text-ink/70 hover:border-olive/30 hover:bg-[#faf7f0]",
              ].join(" ")}
            >
              {lang.code.toUpperCase()}
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
        aria-label={tc("changeLanguage")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-stone/15 bg-white/82 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] text-paper">
          {currentLang.code.toUpperCase()}
        </span>
        <span className="text-earth">{currentLang.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={["h-4 w-4 text-ink/55 transition", open ? "rotate-180" : ""].join(" ")}
        >
          <path
            d="M5.25 7.75 10 12.5l4.75-4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[11rem] overflow-hidden rounded-[1.4rem] border border-stone/15 bg-paper/96 p-2 shadow-lift backdrop-blur-xl">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-earth">{tc("language")}</p>
          <div role="listbox" aria-label={tc("languageSelector")} className="grid gap-1">
            {languages.map((lang) => {
              const isActive = lang.code === locale;
              const btnClass = isActive
                ? "flex w-full items-center justify-between rounded-[1rem] px-3 py-2.5 text-left text-sm transition bg-ink text-paper shadow-soft"
                : "flex w-full items-center justify-between rounded-[1rem] px-3 py-2.5 text-left text-sm transition text-ink/74 hover:bg-[#f6efe5] hover:text-ink";
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => switchTo(lang.code)}
                  aria-selected={isActive}
                  className={btnClass}
                >
                  <span>{lang.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                    {lang.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
