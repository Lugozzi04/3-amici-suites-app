import Link from "next/link";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import { ImageFrame } from "@/components/image-frame";
import { PropertyCard } from "@/components/property-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { AmenitiesGrid } from "@/components/amenities-grid";
import { amenities, homeHighlights, properties, testimonials, veronaExperiences } from "@/lib/site";
import { getHomeGalleryGroups } from "@/lib/home-gallery";
import { StructureGallery } from "@/components/structure-gallery";

const heroStats = [
  { value: "4", label: "Strutture a Verona" },
  { value: "24h", label: "Supporto e contatto diretto" },
  { value: "100%", label: "Schede Booking aggiornabili" },
];

const homeGalleryGroups = getHomeGalleryGroups();

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden" data-reveal>
        <div className="absolute inset-0 bg-hero-warm" />
        <div className="absolute inset-0 animated-noise opacity-[0.25]" />
        <div className="absolute left-[6%] top-[12%] h-56 w-56 rounded-full bg-olive/10 blur-3xl animate-drift" />
        <div className="absolute right-[8%] top-[8%] h-72 w-72 rounded-full bg-earth/10 blur-3xl animate-float-soft" />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-earth backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                Boutique hospitality a Verona
              </div>

              <h1 className="mt-6 max-w-xl font-serif text-[3.5rem] leading-[0.92] text-ink sm:text-[4.6rem] lg:text-[5.5rem]">
                Quattro soggiorni curati per vivere Verona con stile.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-ink/76 sm:text-xl">
                3 Amici Suites propone quattro strutture essenziali, eleganti e accoglienti, con una presentazione
                chiara pensata per aumentare fiducia, qualità percepita e conversione.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contatti">Prenota</ButtonLink>
                <ButtonLink href="/strutture" variant="secondary">
                  Scopri le strutture
                </ButtonLink>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-white/55 bg-white/65 p-5 shadow-soft backdrop-blur float-on-hover glow-edges"
                  >
                    <p className="font-serif text-3xl text-ink">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ink/60">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[1.6rem] border border-white/60 bg-white/55 p-4 shadow-soft backdrop-blur glow-edges">
                <div className="grid gap-3 sm:grid-cols-3" data-stagger>
                  {homeHighlights.map((item) => (
                    <div key={item.title} className="rounded-2xl bg-paper/55 p-4 float-on-hover">
                      <p className="text-sm font-medium text-ink">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/70">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full border border-white/65 bg-white/45 blur-[1px] animate-float-soft" />
              <ImageFrame
                src="/real/suite-bedroom.jpg"
                alt="3 Amici Suites a Verona"
                priority
                className="aspect-[4/5] shadow-lift"
              />

              <div className="mt-4 grid gap-4 lg:absolute lg:-bottom-5 lg:left-5 lg:right-5 lg:mt-0 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/55 bg-white/75 p-5 shadow-soft backdrop-blur float-on-hover glow-edges">
                  <p className="text-xs uppercase tracking-[0.28em] text-earth">Focus</p>
                  <p className="mt-2 text-sm leading-7 text-ink/78">
                    Un'identità visiva calda, ordinata e credibile, con CTA immediate e leggibilità forte.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-ink/10 bg-ink p-5 text-paper shadow-soft float-on-hover">
                  <p className="text-xs uppercase tracking-[0.28em] text-sand">Percorso</p>
                  <p className="mt-2 text-sm leading-7 text-paper/80">
                    Contatto diretto o prenotazione esterna, senza attriti e senza sezioni superflue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
            <SectionHeading
              eyebrow="Le strutture"
              title="Quattro spazi, una sola firma di ospitalità."
              description="La griglia valorizza il brand con card grandi, riprese di respiro editoriale e gerarchia molto chiara."
            />
            <p className="max-w-2xl text-sm leading-7 text-ink/68 lg:justify-self-end">
              Ogni struttura ha una personalità distinta, ma il racconto resta uniforme: pulito, premium e
              immediatamente comprensibile anche da mobile.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2" data-stagger>
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-[#efe4d6]/80 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              eyebrow="Servizi"
              title="Tutto ciò che serve, senza complicazioni."
              description="Un set di amenity chiare e rassicuranti, presentate con spazio e ordine."
            />
            <div className="rounded-[1.8rem] border border-white/55 bg-white/55 p-6 shadow-soft backdrop-blur glow-edges">
              <AmenitiesGrid items={amenities} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <SectionHeading
            eyebrow="Gallery"
            title="Una composizione pensata per fotografie vere, senza rifare il layout."
            description="Le immagini reali mantengono il peso visivo giusto per accogliere contenuti nuovi senza cambiare il layout."
          />
          <div className="mt-10">
            <StructureGallery groups={homeGalleryGroups} />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-[#efe4d6]/80 section-divider" data-reveal>
        <Container>
          <SectionHeading
            eyebrow="Recensioni"
            title="Una fiducia costruita su ordine, chiarezza e accoglienza."
            description="La prova sociale è trattata con sobrietà, per dare autorevolezza senza sembrare artificiale."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft float-on-hover">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Perché funziona</p>
              <h3 className="mt-4 font-serif text-4xl leading-tight">Più fiducia, più chiarezza, più desiderio di prenotare.</h3>
              <p className="mt-5 text-sm leading-7 text-paper/78">
                La pagina è costruita per valorizzare la percezione di qualità con pochissimi elementi, ma
                disposti con più precisione e più atmosfera.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3" data-stagger>
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 float-on-hover">
                    <p className="font-serif text-2xl text-paper">{stat.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-paper/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-3" data-stagger>
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.author} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr]">
            <div>
              <SectionHeading
                eyebrow="Verona"
                title="Una base elegante per scoprire la città con pochi passaggi."
                description="Arena, centro storico, vino e ristoranti vengono raccontati in modo utile, rapido e senza appesantire la pagina."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2" data-stagger>
                {veronaExperiences.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.6rem] border border-white/60 bg-white/72 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-0.5 float-on-hover glow-edges"
                  >
                    <h3 className="font-serif text-[1.8rem] leading-tight text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-soft float-on-hover">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Perché sceglierci</p>
              <h3 className="mt-4 font-serif text-4xl leading-tight">Una presenza discreta, ma memorabile.</h3>
              <p className="mt-5 text-paper/78">
                Il design resta semplice, ma la composizione, il ritmo e la profondità visiva sono pensati per
                comunicare qualità da boutique stay.
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 glow-edges">
                <p className="text-xs uppercase tracking-[0.28em] text-sand">Highlight</p>
                <p className="mt-3 text-sm leading-7 text-paper/80">
                  Contatto diretto, Booking esterno e una struttura dell'informazione che guida l'utente senza
                  frizioni.
                </p>
              </div>
              <Link href="/verona" className="mt-8 inline-flex text-sm text-sand underline-offset-4 hover:underline">
                Scopri cosa fare a Verona
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 section-divider" data-reveal>
        <Container>
          <div className="grid gap-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-soft backdrop-blur lg:grid-cols-[1.15fr_0.85fr] glow-edges">
            <div>
              <SectionHeading
                eyebrow="Contatto finale"
                title="Parliamone in modo rapido e diretto."
                description="Per informazioni, disponibilità o supporto alla prenotazione, il contatto resta semplice e immediato."
              />
            </div>
            <div className="flex flex-col justify-center gap-4">
              <ButtonLink href="/contatti">Prenota</ButtonLink>
              <ButtonLink href="/strutture" variant="secondary">
                Scopri le strutture
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
