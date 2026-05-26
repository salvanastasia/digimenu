import Link from "next/link";
import { JoinUsButton } from "@/components/landing/JoinUsProvider";
import { LandingPhotoCarousel } from "@/components/landing/LandingPhotoCarousel";

const FEATURES = [
  {
    title: "Menu multilingue",
    description:
      "Italiano, inglese, francese, tedesco e spagnolo. Traduci solo ciò che cambia, senza rifare tutto da capo.",
  },
  {
    title: "Lista preferiti",
    description:
      "I clienti segnano i piatti che vogliono ordinare e li consultano in sala, in pannello o in stile scontrino.",
  },
  {
    title: "Brand su misura",
    description:
      "Colori, font, logo e header personalizzati. Ogni locale ha il suo menu, coerente con l’identità del locale.",
  },
  {
    title: "Allergeni in regola",
    description:
      "Gestisci i 14 allergeni obbligatori per piatto, con supporto AI per compilare le checkbox in automatico.",
  },
  {
    title: "Dashboard centralizzata",
    description:
      "Più clienti, versioni salvate, anteprima immediata. Modifica piatti e categorie da un unico pannello.",
  },
  {
    title: "AI integrata",
    description:
      "Genera descrizioni da menu e suggerimenti allergeni con un click, nel tono giusto per la carta.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Configura il locale",
    description: "Logo, colori, lingue attive e informazioni di contatto.",
  },
  {
    step: "02",
    title: "Inserisci il menu",
    description: "Categorie, piatti, prezzi, allergeni e traduzioni.",
  },
  {
    step: "03",
    title: "Condividi il link",
    description: "Un URL dedicato per QR code, sito e social del ristorante.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#141415]">
      <header className="sticky top-0 z-50 border-b border-[#e4e4e4] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="min-w-0">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
              DigiMenu
            </p>
            <p className="truncate text-[1.1rem] font-bold text-[#141415]">
              Menu digitale
            </p>
          </Link>

          <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/aribri"
              className="hidden rounded-full border border-[#d8dadc] px-4 py-2 text-[0.84rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5] sm:inline-flex"
            >
              Esempio live
            </Link>
            <JoinUsButton variant="primary" />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#560200] text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, #f2e8d8 0%, transparent 45%), radial-gradient(circle at 80% 0%, #f8a5b8 0%, transparent 35%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#f2e8d8]">
                Per ristoranti e locali
              </p>
              <h1 className="max-w-xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[3rem]">
                Il menu digitale che i tuoi clienti aprono davvero
              </h1>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[#f2e8d8]/95">
                Sostituisci PDF e carte statiche con un menu mobile veloce,
                multilingue e personalizzato. Aggiornamenti in tempo reale dalla
                dashboard, senza ristampe.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <JoinUsButton variant="secondary" />
                <Link
                  href="/aribri"
                  className="rounded-full border border-white/30 px-5 py-3 text-[0.92rem] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Prova il menu demo
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[320px] lg:max-w-none">
              <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                <div className="bg-[#560200] px-4 pb-5 pt-4 text-white">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[1rem] font-bold">aribrì</p>
                      <p className="text-[0.72rem] text-[#f2e8d8]">
                        Ristorante · Pizzeria · B&B
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e8d8] text-[#560200]">
                      ♥
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-[12px] bg-white/10 px-3 py-2 text-[0.82rem] font-semibold">
                      Antipasti
                    </div>
                    <div className="rounded-[12px] bg-white px-3 py-3 text-[#141415]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.88rem] font-bold">
                            Carpaccio di manzo
                          </p>
                          <p className="mt-1 text-[0.74rem] leading-snug text-[#606060]">
                            Fettine sottili, rucola, grana, olio EVO.
                          </p>
                        </div>
                        <p className="text-[0.82rem] font-bold">€14</p>
                      </div>
                    </div>
                    <div className="rounded-[12px] bg-white/10 px-3 py-2 text-[0.82rem] font-semibold">
                      Primi piatti
                    </div>
                  </div>
                </div>
                <div className="bg-[#f7f7f7] px-4 py-3 text-center text-[0.72rem] font-medium text-[rgba(96,96,96,0)]">
                  Anteprima interfaccia menu
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
              Funzionalità
            </p>
            <h2 className="mt-3 text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.2rem]">
              Tutto ciò che serve al menu, niente di superfluo
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-[#606060]">
              DigiMenu è pensato per chi gestisce un locale: veloce da aggiornare,
              chiaro per chi legge al tavolo, pronto per più lingue e più sedi.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[18px] border border-[#e4e4e4] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <h3 className="text-[1rem] font-bold text-[#141415]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-[#606060]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#e4e4e4] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
                Come funziona
              </p>
              <h2 className="mt-3 text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.2rem]">
                Online in pochi minuti
              </h2>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-stretch md:gap-10">
              <ol className="flex flex-col gap-4 md:h-full md:min-h-0">
                {STEPS.map((item) => (
                  <li
                    key={item.step}
                    className="flex flex-col rounded-[18px] border border-[#ececec] bg-[#fafafa] p-5 md:flex-1 md:p-6"
                  >
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#560200] md:text-[clamp(2.25rem,3.5vw,3.5rem)] md:font-bold md:leading-none md:tracking-[-0.04em]">
                      {item.step}
                    </p>
                    <h3 className="mt-3 text-[1.05rem] font-bold md:mt-3">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-[#606060]">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>

              <LandingPhotoCarousel />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="rounded-[24px] bg-[#560200] px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <h2 className="text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.2rem]">
              Pronto a digitalizzare il tuo menu?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-[#f2e8d8]">
              Raccontaci del tuo locale: il nostro staff ti ricontatta per
              configurare il menu digitale su misura.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <JoinUsButton variant="secondary" />
              <Link
                href="/aribri"
                className="rounded-full border border-white/30 px-5 py-3 text-[0.92rem] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Guarda l&apos;esempio aribrì
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4e4e4] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-[0.84rem] text-[#606060] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-semibold text-[#141415]">DigiMenu</span> — menu
            digitale per ristoranti
          </p>
          <div className="flex flex-wrap gap-4">
            <JoinUsButton variant="ghost" />
            <Link href="/aribri" className="font-semibold hover:text-[#560200]">
              Menu demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
