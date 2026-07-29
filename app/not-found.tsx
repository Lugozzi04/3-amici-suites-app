"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/strutture");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[2rem] border border-stone/20 bg-white p-10 text-center shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-earth">Pagina non trovata</p>
          <h1 className="mt-4 font-serif text-5xl text-ink">Stiamo riportando il visitatore alle strutture.</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Se non vieni reindirizzato in automatico, puoi continuare dalla pagina delle strutture.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/strutture">Vai alle strutture</ButtonLink>
            <ButtonLink href="/" variant="ghost">
              Torna alla home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
