import Link from "next/link";
import { Container } from "@/components/container";
import { contactInfo, navigation } from "@/src/data/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-[#ede3d4]/95 backdrop-blur">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-serif text-3xl text-ink magnetic-link">3 Amici Suites</p>
            <p className="max-w-md text-sm leading-7 text-ink/70">
              Tre strutture a Verona presentate con un'identità chiara, elegante e pronta a convertire
              verso contatto diretto o prenotazione esterna.
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">{contactInfo.cin}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">Navigazione</p>
            <div className="mt-4 grid gap-3">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="magnetic-link text-sm text-ink/75 hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-earth">Contatti</p>
            <div className="mt-4 grid gap-3 text-sm text-ink/75">
              <a className="magnetic-link" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              <a className="magnetic-link" href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              <span>{contactInfo.address}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {contactInfo.social.map((item) => (
                <Link key={item.label} href={item.href} className="magnetic-link text-olive hover:text-[#556146]">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-ink/60">
              <Link href="#">Privacy</Link>
              <Link href="#">Cookie</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
