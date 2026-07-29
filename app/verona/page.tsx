import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { properties, veronaExperiences } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verona | 3 Amici Suites",
  description: "Una guida breve e utile a Verona: Arena, centro storico, vino, ristoranti e appuntamenti.",
};

export default function VeronaPage() {
  return (
    <section className="py-16 lg:py-20" data-reveal>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Verona"
              title="Una città da vivere con il giusto ritmo."
              description="Selezione breve di esperienze utili, pensata per orientare l'ospite senza appesantire la pagina."
            />
            <ImageFrame
              src={properties[3].image}
              alt="Interno contemporaneo di 3 Amici all'Arena"
              className="aspect-[4/3]"
              priority
            />
          </div>
          <div className="grid gap-4" data-stagger>
            {veronaExperiences.map((item) => (
              <div key={item.title} className="rounded-3xl border border-stone/20 bg-white p-6 shadow-soft">
                <h2 className="font-serif text-3xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
