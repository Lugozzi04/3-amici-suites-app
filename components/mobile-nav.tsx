"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { contactInfo, navigation } from "@/src/data/site-content";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-stone/30 bg-white/85 px-4 py-2 text-sm text-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        Menu
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] h-[100dvh] w-screen bg-ink/38 backdrop-blur-sm"
              role="presentation"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-full items-start justify-center px-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
                <div
                  id="mobile-navigation"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigazione mobile"
                  className={cn(
                    "w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-paper/96 shadow-lift",
                  )}
                  style={{
                    maxHeight: "calc(100dvh - 1.5rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-stone/15 px-5 py-4">
                    <div>
                      <p className="font-serif text-2xl leading-none text-ink">3 Amici Suites</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-earth">
                        Verona boutique hospitality
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-stone/25 bg-white/85 px-4 py-2 text-sm text-ink shadow-sm transition hover:bg-white"
                    >
                      Chiudi
                    </button>
                  </div>

                  <div className="max-h-[calc(100dvh-9.25rem)] overflow-y-auto px-5 py-5">
                    <nav className="grid gap-3">
                      {navigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="rounded-[1.4rem] border border-stone/15 bg-white px-4 py-4 text-base text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-olive/30 hover:bg-[#faf8f3]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-5">
                      <LanguageSwitcher variant="mobile" />
                    </div>

                    <div className="mt-5 rounded-[1.5rem] border border-stone/15 bg-[#f8f3eb] p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-earth">Contatti</p>
                      <a className="mt-3 block text-sm text-ink" href={`mailto:${contactInfo.email}`}>
                        {contactInfo.email}
                      </a>
                      <a className="mt-2 block text-sm text-ink" href={`tel:${contactInfo.phone}`}>
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
