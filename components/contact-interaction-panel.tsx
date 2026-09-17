"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AvailabilityChecker } from "@/components/availability-checker";
import { ContactForm } from "@/components/contact-form";

type StructureHealth = {
  propertySlug: string;
  propertyName: string;
  hasValidFeed: boolean;
};

type ContactInteractionPanelProps = {
  initialPropertySlug?: string;
  initialMessage?: string;
  showAvailabilityChecker: boolean;
  structureHealth?: StructureHealth[];
  /** "both" = render checker + form (default). "form" = only form. "checker" = only checker, onRequestContactMessage scrolls to #contatti-form. */
  mode?: "both" | "form" | "checker";
};

const PREFILL_EVENT = "3amici:prefill";

export function ContactInteractionPanel({
  initialPropertySlug,
  initialMessage = "",
  showAvailabilityChecker,
  structureHealth = [],
  mode = "both",
}: ContactInteractionPanelProps) {
  const [prefillMessage, setPrefillMessage] = useState(initialMessage);
  const [prefillVersion, setPrefillVersion] = useState(0);
  const [flash, setFlash] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefillMessage(initialMessage);
    setPrefillVersion((version) => version + 1);
  }, [initialMessage]);

  // In form mode: listen for prefill events from the checker instance
  useEffect(() => {
    if (mode !== "form") return;

    // Check for message already stored before this component mounted
    const stored = (window as unknown as Record<string, string>).__3amici_prefill;
    if (stored) {
      delete (window as unknown as Record<string, string | undefined>).__3amici_prefill;
      setPrefillMessage(stored);
      setPrefillVersion((v) => v + 1);
      setFlash(true);
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setPrefillMessage(detail);
      setPrefillVersion((v) => v + 1);
      setFlash(true);
    };

    window.addEventListener(PREFILL_EVENT, handler);
    return () => {
      window.removeEventListener(PREFILL_EVENT, handler);
    };
  }, [mode]);

  // Clear flash after animation
  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(false), 7500);
    return () => clearTimeout(timer);
  }, [flash]);

  const handleRequestContactMessage = useCallback((message: string) => {
    // Store globally so the form instance (if separate) can pick it up
    (window as unknown as Record<string, string>).__3amici_prefill = message;
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: message }));

    window.requestAnimationFrame(() => {
      const el = document.getElementById("contatti-form");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const renderChecker = () => {
    if (!showAvailabilityChecker) return <AvailabilityFallback />;
    return (
      <AvailabilityChecker
        initialPropertySlug={initialPropertySlug}
        onRequestContactMessage={handleRequestContactMessage}
        structureHealth={structureHealth}
      />
    );
  };

  const renderForm = () => (
    <div
      ref={formRef}
      id="contatti-form"
      className={flash ? "form-flash" : ""}
    >
      <ContactForm initialMessage={prefillMessage} prefillVersion={prefillVersion} />
    </div>
  );

  if (mode === "form") return renderForm();
  if (mode === "checker") return renderChecker();

  return (
    <>
      {renderChecker()}
      {renderForm()}
    </>
  );
}

import { useTranslations } from "next-intl";

function AvailabilityFallback() {
  const t = useTranslations("contatti");
  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200/60 bg-amber-50/90 shadow-soft backdrop-blur">
      <div className="border-b border-amber-200/50 bg-gradient-to-b from-amber-50/95 to-[#faf5ed] px-6 py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[#9b6a2f]">{t("availability.title")}</p>
        <h3 className="mt-3 font-serif text-[1.9rem] leading-none text-ink sm:text-[2.1rem]">
          {t("availability.updatingTitle")}
        </h3>
        <p className="mt-3 max-w-[36rem] text-sm leading-7 text-ink/68">
          {t("availability.updatingDescription")}
        </p>
      </div>
      <div className="space-y-4 px-6 py-6">
        <div className="rounded-[1.4rem] border border-amber-200/40 bg-white/80 p-5 text-sm leading-7 text-ink/68">
          <p className="font-medium text-[#9b6a2f]">{t("availability.whatHappened")}</p>
          <p className="mt-2">
            {t("availability.whatHappenedDesc")}
          </p>
          <p className="mt-3">
            {t("availability.whatHappenedNote")}
          </p>
        </div>
        <p className="text-xs leading-6 text-ink/50">
          {t("availability.autoRestore")}
        </p>
      </div>
    </section>
  );
}
