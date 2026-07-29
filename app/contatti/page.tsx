import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContattiMapSection } from "@/components/contatti-map-section";
import { ContactInteractionPanel } from "@/components/contact-interaction-panel";
import { SectionHeading } from "@/components/section-heading";
import { contactInfo } from "@/src/data/site-content";
import {
  ALL_AVAILABILITY_STRUCTURE_SLUG,
  availabilityStructureMenuOptions,
} from "@/src/data/availabilityFeeds";

export const metadata: Metadata = {
  title: "Contatti | 3 Amici Suites Verona",
  description:
    "Contatta 3 Amici Suites a Verona per richiedere informazioni, assistenza e supporto alla prenotazione.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ structure?: string | string[]; message?: string | string[] }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedStructure = normalizeStructureSlug(resolvedSearchParams.structure);
  const initialMessage = normalizePrefillMessage(resolvedSearchParams.message);

  return (
    <section className="py-16 sm:py-20 lg:py-24" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Contatti"
              title="Scrivici in modo diretto, senza passaggi inutili."
              description="Il modulo invia un messaggio diretto al team, con un flusso rapido e leggibile anche da mobile."
            />

            <div className="rounded-[2rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur" data-reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-earth">Dati utili</p>
              <div className="mt-5 grid gap-3 text-sm text-ink/74">
                <a className="hover:text-ink" href={`mailto:${contactInfo.email}`}>
                  {contactInfo.email}
                </a>
                <a className="hover:text-ink" href={`tel:${contactInfo.phone}`}>
                  {contactInfo.phone}
                </a>
                <span>{contactInfo.address}</span>
                <span>{contactInfo.cin}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink/10 bg-ink p-6 text-paper shadow-soft" data-reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Prenotazione</p>
              <p className="mt-4 text-sm leading-7 text-paper/78">
                Se preferisci, puoi anche prenotare tramite piattaforme esterne. Il sito resta orientato al
                contatto diretto e alla presentazione delle strutture.
              </p>
            </div>

            <ContattiMapSection />
          </div>

          <div className="space-y-6">
            <ContactInteractionPanel initialPropertySlug={selectedStructure} initialMessage={initialMessage} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function normalizeStructureSlug(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate && availabilityStructureMenuOptions.some((option) => option.propertySlug === candidate)) {
    return candidate;
  }

  return ALL_AVAILABILITY_STRUCTURE_SLUG;
}

function normalizePrefillMessage(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) {
    return "";
  }

  return candidate.trim().slice(0, 1200);
}
