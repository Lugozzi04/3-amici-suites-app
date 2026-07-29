"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AvailabilitySection } from "@/components/availability-section";
import { ContactForm } from "@/components/contact-form";

type ContactInteractionPanelProps = {
  initialPropertySlug?: string;
  initialMessage?: string;
};

export function ContactInteractionPanel({
  initialPropertySlug,
  initialMessage = "",
}: ContactInteractionPanelProps) {
  const [prefillMessage, setPrefillMessage] = useState(initialMessage);
  const [prefillVersion, setPrefillVersion] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefillMessage(initialMessage);
    setPrefillVersion((version) => version + 1);
  }, [initialMessage]);

  const handleRequestContactMessage = useCallback((message: string) => {
    setPrefillMessage(message);
    setPrefillVersion((version) => version + 1);

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      <AvailabilitySection initialPropertySlug={initialPropertySlug} />

      <div ref={formRef} id="contatti-form">
        <ContactForm initialMessage={prefillMessage} prefillVersion={prefillVersion} />
      </div>
    </>
  );
}
