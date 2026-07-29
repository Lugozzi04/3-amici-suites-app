import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { properties } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chi siamo | 3 Amici Suites Verona",
  description: "La storia e l'approccio ospitale di 3 Amici Suites: autenticità, cura e connessione con Verona.",
};

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Chi siamo"
              title="Un'ospitalità familiare, presentata con un linguaggio più maturo e coerente."
              description="Il racconto punta su affidabilità, cura e conoscenza del territorio, con un tono sobrio e caldo."
            />

            <div className="rounded-[2rem] border border-white/60 bg-white/74 p-8 shadow-soft backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">La storia</p>
              <div className="mt-5 space-y-5 text-base leading-8 text-ink/74">
                <p>
                  3 Amici Suites nasce dal desiderio di offrire ospitalità in modo semplice, curato e personale.
                  Ogni struttura è pensata per far sentire l'ospite accolto, con spazi ordinati e informazioni
                  chiare fin dal primo contatto.
                </p>
                <p>
                  La nostra idea di soggiorno unisce comfort, attenzione ai dettagli e un rapporto autentico con
                  Verona. Non promettiamo eccessi: preferiamo essere concreti, affidabili e presenti.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Il tono del brand</p>
              <p className="mt-4 text-sm leading-7 text-paper/78">
                Questa presenza digitale segue la stessa logica: pochi contenuti, ben organizzati, con una
                gerarchia chiara e una forte attenzione alla qualità percepita.
              </p>
            </div>
          </div>

          <div className="grid gap-4" data-stagger>
            <ImageFrame
              src={properties[0].image}
              alt="Interno luminoso di 3 Amici Suites"
              className="aspect-[4/3]"
              priority
            />
            <ImageFrame
              src={properties[1].image}
              alt="3 Amici al Teatro, interno elegante"
              className="aspect-[4/3]"
            />
            <div className="rounded-[2rem] border border-white/60 bg-[#f8f3eb] p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-earth">Valore del progetto</p>
              <p className="mt-4 text-sm leading-7 text-ink/72">
                Un brand curato non deve sembrare complicato: deve essere chiaro, ordinato e affidabile in ogni
                dettaglio.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
