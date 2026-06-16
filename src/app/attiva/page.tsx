import type { Metadata } from "next";
import Link from "next/link";
import { DigiMenuLogo } from "@/components/DigiMenuLogo";
import { CheckoutSection } from "@/components/attiva/CheckoutSection";

export const metadata: Metadata = {
  title: "Attiva DigiMenu — Menu digitale per ristoranti",
  description:
    "Attiva il tuo menu digitale personalizzato. Paga con Apple Pay, Google Pay, carta o PayPal.",
};

const INCLUSO = [
  "Menu digitale con URL dedicato",
  "Dashboard di gestione piatti e categorie",
  "Multilingue: IT, EN, FR, DE, ES",
  "Brand personalizzato: logo, colori, font",
  "AI integrata: descrizioni, allergeni, prezzi",
  "Lista preferiti per i tuoi clienti",
  "Aggiornamenti illimitati in tempo reale",
  "Supporto via email",
];

export default function AttivaPage() {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null;

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#141415]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e4e4e4] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <DigiMenuLogo />
          <Link
            href="/"
            className="text-[0.84rem] font-semibold text-[#606060] transition-colors hover:text-[#141415]"
          >
            ← Torna alla home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="mb-3 inline-flex rounded-full border border-[#560200]/20 bg-[#560200]/8 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#560200]">
            Attiva il servizio
          </p>
          <h1 className="text-[2.2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[3rem]">
            Il tuo menu digitale,{" "}
            <span className="text-[#560200]">pronto in pochi minuti</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] leading-relaxed text-[#606060]">
            Scegli il piano, paga e ricevi le credenziali di accesso alla
            dashboard. Nessun costo di setup, cancelli quando vuoi.
          </p>
        </div>

        {/* Layout: features + checkout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-start">
          {/* Left: what's included */}
          <div>
            <h2 className="mb-5 text-[1.2rem] font-bold">Cosa è incluso</h2>
            <ul className="space-y-3">
              {INCLUSO.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#560200]/10">
                    <svg
                      viewBox="0 0 12 12"
                      width="10"
                      height="10"
                      fill="none"
                      className="text-[#560200]"
                    >
                      <path
                        d="M2 6.5L4.8 9 10 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.96rem] leading-snug text-[#141415]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Social proof / note */}
            <div className="mt-8 rounded-[18px] border border-[#e4e4e4] bg-white p-5">
              <p className="text-[0.88rem] font-semibold text-[#141415]">
                Hai domande prima di acquistare?
              </p>
              <p className="mt-1 text-[0.84rem] leading-relaxed text-[#606060]">
                Scrivici a{" "}
                <a
                  href="mailto:info@digi-menu.it"
                  className="font-semibold text-[#560200] hover:underline"
                >
                  info@digi-menu.it
                </a>{" "}
                — rispondiamo entro 24 ore.
              </p>
            </div>

            <div className="mt-4 rounded-[18px] border border-[#e4e4e4] bg-white p-5">
              <p className="text-[0.84rem] leading-relaxed text-[#606060]">
                <span className="font-semibold text-[#141415]">
                  Garanzia 14 giorni.
                </span>{" "}
                Hai 14 giorni di tempo per richiedere il rimborso completo, senza
                domande. Come previsto dal Codice del Consumo (D.Lgs. 206/2005).
              </p>
            </div>
          </div>

          {/* Right: checkout */}
          <div className="lg:sticky lg:top-[80px]">
            <CheckoutSection
              stripeKey={stripeKey}
              paypalClientId={paypalClientId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e4e4e4] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[0.82rem] text-[#adadad] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} DigiMenu · Salvatore Anastasia · P.IVA / CF in fase di registrazione</p>
          <div className="flex gap-4">
            <Link href="/termini-e-condizioni" className="hover:text-[#560200]">
              Termini
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#560200]">
              Privacy
            </Link>
            <a href="mailto:info@digi-menu.it" className="hover:text-[#560200]">
              Contatti
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
