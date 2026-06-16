import Link from "next/link";
import { DigiMenuLogo } from "@/components/DigiMenuLogo";
import { LandingHeroMockup } from "@/components/landing/LandingHeroMockup";
import { JoinUsButton } from "@/components/landing/JoinUsProvider";
import { LandingPhotoCarousel } from "@/components/landing/LandingPhotoCarousel";

const PLAN_FEATURES = [
  "Setup e configurazione completa a cura nostra",
  "Menu digitale con URL e QR code dedicati",
  "5 lingue (IT, EN, FR, DE, ES)",
  "Brand personalizzato: logo, colori, font",
  "AI per descrizioni e allergeni",
  "Lista preferiti per i clienti",
  "2 aggiornamenti stagionali all'anno inclusi",
  "Supporto via email",
] as const;

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.2 11.5 13 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4.5L12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#560200]">
      <span className="h-px w-5 bg-[#560200]/40" />
      {children}
    </p>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#141415]">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#ececec]/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <DigiMenuLogo />

          <nav className="hidden items-center gap-7 md:flex">
            {[
              { href: "#funzionalita", label: "Funzionalità" },
              { href: "#come-funziona", label: "Come funziona" },
              { href: "#prezzi", label: "Prezzi" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[0.86rem] font-medium text-[#606060] transition-colors duration-150 hover:text-[#141415]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/aribri"
              className="hidden rounded-full px-4 py-2 text-[0.84rem] font-medium text-[#606060] transition-colors hover:text-[#141415] sm:inline-flex"
            >
              Demo live
            </Link>
            <Link
              href="/attiva"
              className="inline-flex items-center justify-center rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-bold text-white shadow-[0_4px_14px_rgba(86,2,0,0.22)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:bg-[#6d0200] active:scale-[0.97]"
            >
              Attiva ora
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero ────────────────────────────────────────────────── */}
        <section className="landing-dot-grid relative overflow-hidden border-b border-[#ececec]">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% -20%, rgba(86,2,0,0.055) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 105% 60%, rgba(248,165,184,0.14) 0%, transparent 55%)",
            }}
          />

          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pt-16 pb-0 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-12 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#560200]/15 bg-[#560200]/5 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#560200] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#560200]" />
                </span>
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#560200]">
                  Per ristoranti e locali
                </span>
              </div>

              <h1 className="max-w-[14ch] text-[2.6rem] font-bold leading-[1.03] tracking-[-0.038em] sm:text-[3.4rem] lg:text-[3.9rem]">
                Il menu digitale che i tuoi clienti{" "}
                <em className="not-italic text-[#560200]">aprono davvero</em>
              </h1>

              <p className="mt-6 max-w-lg text-[1.08rem] leading-[1.7] text-[#606060]">
                Configuriamo noi il tuo menu digitale: link dedicato, 5 lingue,
                brand personalizzato, allergeni. Tu condividi il QR code —
                noi aggiorniamo il menu ogni stagione.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/attiva"
                  className="inline-flex items-center gap-2 rounded-full bg-[#560200] px-6 py-3.5 text-[0.96rem] font-bold text-white shadow-[0_8px_28px_rgba(86,2,0,0.24)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:bg-[#6d0200] hover:shadow-[0_12px_36px_rgba(86,2,0,0.3)] active:scale-[0.97]"
                >
                  Inizia ora
                  <ArrowRight />
                </Link>
                <Link
                  href="/aribri"
                  className="inline-flex items-center justify-center rounded-full border border-[#d8dadc] bg-white px-6 py-3.5 text-[0.96rem] font-semibold text-[#141415] transition-[transform,background-color] duration-200 ease-out hover:bg-[#fafafa] active:scale-[0.97]"
                >
                  Prova il menu demo
                </Link>
              </div>

              <p className="mt-5 text-[0.8rem] text-[#c0c0c0]">
                Setup 120€ una tantum · 2 aggiornamenti stagionali inclusi · Cancelli quando vuoi
              </p>
            </div>

            <div className="relative lg:overflow-visible">
              <LandingHeroMockup />
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative border-t border-[#ececec] bg-white/60 backdrop-blur-sm">
            <div className="mx-auto grid max-w-6xl divide-y divide-[#ececec] px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
              {[
                { value: "120€", label: "setup iniziale una tantum" },
                { value: "5 lingue", label: "IT, EN, FR, DE, ES incluse" },
                { value: "2×/anno", label: "aggiornamenti stagionali inclusi" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center px-6 py-6 text-center sm:py-8"
                >
                  <p className="text-[1.85rem] font-bold tracking-[-0.03em] text-[#141415]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.84rem] text-[#888]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Trust strip ─────────────────────────────────────────── */}
        <section className="border-b border-[#ececec] bg-[#fafafa]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: "✦",
                  title: "Fatto per te, non da te",
                  body: "Carichiamo noi piatti, prezzi, allergeni e traduzioni. Il cliente non ha bisogno di imparare nessun gestionale.",
                },
                {
                  icon: "🌍",
                  title: "Multilingue in 5 lingue",
                  body: "Il menu è disponibile in italiano, inglese, francese, tedesco e spagnolo — senza lavoro aggiuntivo.",
                },
                {
                  icon: "🔄",
                  title: "2 aggiornamenti stagionali",
                  body: "Ogni sei mesi aggiorniamo il menu: nuovi piatti, prezzi, promozioni. Incluso nell'abbonamento.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 text-[1.3rem] leading-none">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[0.96rem] font-bold text-[#141415]">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-[0.88rem] leading-[1.65] text-[#606060]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features bento ──────────────────────────────────────── */}
        <section
          id="funzionalita"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="max-w-xl">
            <SectionLabel>Funzionalità</SectionLabel>
            <h2 className="mt-4 text-[2rem] font-bold tracking-[-0.035em] sm:text-[2.6rem]">
              Tutto ciò che serve al menu.{" "}
              <span className="text-[#c0c0c0]">Niente di superfluo.</span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1 — Multilingue */}
            <article className="group relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-7 transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d8dadc] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]/8 text-[#560200]">
                    <svg viewBox="0 0 22 22" width="20" height="20" fill="none" aria-hidden="true">
                      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M2.5 11h17M11 2.5c-2.4 2.6-3.8 5.6-3.8 8.5s1.4 5.9 3.8 8.5M11 2.5c2.4 2.6 3.8 5.6 3.8 8.5S13.4 17.9 11 20.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <h3 className="mt-5 text-[1.1rem] font-bold">Menu multilingue</h3>
                  <p className="mt-2 max-w-sm text-[0.92rem] leading-relaxed text-[#606060]">
                    Italiano, inglese, francese, tedesco e spagnolo. Traduci solo
                    ciò che cambia, senza rifare tutto da capo.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { flag: "🇮🇹", lang: "Italiano" },
                  { flag: "🇬🇧", lang: "English" },
                  { flag: "🇫🇷", lang: "Français" },
                  { flag: "🇩🇪", lang: "Deutsch" },
                  { flag: "🇪🇸", lang: "Español" },
                ].map(({ flag, lang }) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1.5 rounded-full border border-[#ececec] bg-[#fafafa] px-3 py-1.5 text-[0.8rem] font-medium text-[#141415]"
                  >
                    {flag} {lang}
                  </span>
                ))}
              </div>
            </article>

            {/* 2 — AI (dark) */}
            <article className="group relative overflow-hidden rounded-[22px] bg-[#141415] p-7 text-white transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(20,20,21,0.18)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]">
                <svg viewBox="0 0 22 22" width="19" height="19" fill="none" aria-hidden="true">
                  <path d="M11 3l1.4 4.6L17 9l-4.6 1.4L11 15l-1.4-4.6L5 9l4.6-1.4L11 3zM16 14l.8 2.8L19.5 17.5l-2.7.7L16 21l-.8-2.8-2.7-.7 2.7-.8L16 14z" fill="white" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold">AI integrata</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[#a0a0a0]">
                Genera descrizioni da menu e suggerisce allergeni con un click,
                nel tono giusto per la carta.
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/6 px-3.5 py-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#606060]">
                  Generato da AI
                </p>
                <p className="mt-1.5 text-[0.82rem] italic leading-snug text-[#d0d0d0]">
                  "Carpaccio di manzo con rucola fresca, scaglie di Grana Padano
                  e olio extravergine d'oliva..."
                </p>
              </div>
            </article>

            {/* 3 — Brand */}
            <article className="group relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-7 transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d8dadc] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]/8 text-[#560200]">
                <svg viewBox="0 0 22 22" width="20" height="20" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
                  <circle cx="11" cy="7.5" r="1" fill="currentColor" />
                  <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
                  <path d="M7.5 13.5C8 15 9.3 16 11 16s3-.9 3.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold">Brand su misura</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[#606060]">
                Colori, font, logo e header personalizzati. Il menu parla il
                linguaggio visivo del tuo locale.
              </p>
              <div className="mt-5 flex gap-2.5">
                {[
                  "#560200",
                  "#f2e8d8",
                  "#141415",
                  "#4a9b8e",
                  "#2d5fa8",
                ].map((c) => (
                  <span
                    key={c}
                    className="h-8 w-8 rounded-full ring-2 ring-white ring-offset-1 shadow-sm"
                    style={{ background: c }}
                    aria-hidden="true"
                  />
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-[#d8dadc] text-[1rem] text-[#adadad]">
                  +
                </span>
              </div>
            </article>

            {/* 4 — Allergeni */}
            <article className="group relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-7 transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d8dadc] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]/8 text-[#560200]">
                <svg viewBox="0 0 22 22" width="20" height="20" fill="none" aria-hidden="true">
                  <path d="M11 3l7 3.5v5.5c0 3.8-2.5 7-7 8.5C6.5 19 4 15.8 4 12V6.5L11 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M8 11l2.2 2.2L14 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold">Allergeni in regola</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[#606060]">
                I 14 allergeni obbligatori per piatto, con AI che compila le
                checkbox in automatico.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {["Glutine", "Latte", "Uova", "Pesce", "Frutta secca", "+9"].map(
                  (a) => (
                    <span
                      key={a}
                      className="rounded-lg bg-[#fff8f1] px-2.5 py-1 text-[0.74rem] font-semibold text-[#c45200]"
                    >
                      {a}
                    </span>
                  )
                )}
              </div>
            </article>

            {/* 5 — Preferiti */}
            <article className="group relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-7 transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d8dadc] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]/8 text-[#560200]">
                <svg viewBox="0 0 22 22" width="20" height="20" fill="none" aria-hidden="true">
                  <path d="M11 18.5S3.5 13.2 3.5 7.8C3.5 5.1 5.5 3 8.2 3 9.8 3 11 4 11 4s1.2-1 2.8-1c2.7 0 4.7 2.1 4.7 4.8 0 5.4-7.5 10.7-7.5 10.7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold">Lista preferiti</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[#606060]">
                I clienti salvano i piatti che vogliono ordinare e li consultano
                in stile scontrino — dal tavolo.
              </p>
              <div className="mt-5 space-y-2">
                {["Carpaccio di manzo", "Risotto ai funghi"].map((dish) => (
                  <div
                    key={dish}
                    className="flex items-center gap-2 rounded-xl bg-[#fdf5f5] px-3.5 py-2 text-[0.84rem] font-medium text-[#141415]"
                  >
                    <svg viewBox="0 0 12 12" width="11" height="11" fill="#560200" aria-hidden="true">
                      <path d="M6 10.5S1.5 7.3 1.5 4.5C1.5 3 2.7 2 4.1 2c.9 0 1.6.5 2 1.1C6.5 2.5 7.2 2 8.1 2 9.5 2 10.5 3 10.5 4.5c0 2.8-4.5 6-4.5 6z" />
                    </svg>
                    {dish}
                  </div>
                ))}
              </div>
            </article>

            {/* 6 — Gestito per te */}
            <article className="group relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-7 transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d8dadc] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#560200]/8 text-[#560200]">
                <svg viewBox="0 0 22 22" width="20" height="20" fill="none" aria-hidden="true">
                  <path d="M11 3L4 7v5.5c0 3.8 3 7.2 7 8.5 4-1.3 7-4.7 7-8.5V7L11 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M8 11.5l2.2 2.2L14.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold">Gestito da noi</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[#606060]">
                Nessun gestionale da imparare. Carichiamo noi piatti, prezzi,
                allergeni e traduzioni — e aggiorniamo il menu ogni stagione.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  { label: "Setup", tag: "una tantum" },
                  { label: "Aggiornamento primavera", tag: "incluso" },
                  { label: "Aggiornamento autunno", tag: "incluso" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl bg-[#fafafa] px-3.5 py-2 text-[0.84rem]"
                  >
                    <span className="font-semibold text-[#141415]">{row.label}</span>
                    <span className="rounded-full bg-[#560200]/8 px-2 py-0.5 text-[0.7rem] font-semibold text-[#560200]">{row.tag}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ─── How it works ────────────────────────────────────────── */}
        <section
          id="come-funziona"
          className="scroll-mt-20 border-y border-[#ececec] bg-[#fafafa]"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
              <div>
                <SectionLabel>Come funziona</SectionLabel>
                <h2 className="mt-4 text-[2rem] font-bold tracking-[-0.035em] sm:text-[2.6rem]">
                  Online in pochi minuti
                </h2>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-[#606060]">
                  Dal primo contatto al menu live: configuriamo tutto con te, poi
                  gestisci piatti e prezzi in autonomia.
                </p>

                <ol className="mt-10 space-y-3">
                  {[
                    {
                      step: "01",
                      title: "Raccontaci del tuo locale",
                      body: "Logo, colori, lingue, piatti e informazioni di contatto. Basta una email.",
                    },
                    {
                      step: "02",
                      title: "Costruiamo il menu per te",
                      body: "Configuriamo tutto: categorie, piatti, prezzi, allergeni e traduzioni in 5 lingue.",
                    },
                    {
                      step: "03",
                      title: "Ricevi link e QR code",
                      body: "Il tuo menu è online. Stampalo, condividilo, mettilo sul sito — aggiornato ogni stagione.",
                    },
                  ].map((item, i) => (
                    <li
                      key={item.step}
                      className="flex gap-5 rounded-[18px] border border-[#ececec] bg-white p-5 transition-[box-shadow,border-color] duration-200 ease-out hover:border-[#d8dadc] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
                    >
                      <span
                        className="shrink-0 text-[2rem] font-bold leading-none tracking-[-0.04em]"
                        style={{ color: `rgba(86,2,0,${0.12 + i * 0.12})` }}
                      >
                        {item.step}
                      </span>
                      <div>
                        <h3 className="text-[1.02rem] font-bold">{item.title}</h3>
                        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[#606060]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <LandingPhotoCarousel />
            </div>
          </div>
        </section>

        {/* ─── Pricing ─────────────────────────────────────────────── */}
        <section
          id="prezzi"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="text-center">
            <SectionLabel>Prezzi</SectionLabel>
            <h2 className="mt-4 text-[2rem] font-bold tracking-[-0.035em] sm:text-[2.6rem]">
              Semplici, senza sorprese
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-relaxed text-[#606060]">
              Stesso prodotto, stesso supporto. Scegli mensile o annuale.
            </p>
          </div>

          {/* Setup fee block */}
          <div className="mx-auto mt-12 max-w-3xl rounded-[20px] border border-[#ececec] bg-[#fafafa] px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#560200]">
                  Setup iniziale · una tantum
                </p>
                <p className="mt-1.5 text-[1rem] font-bold text-[#141415]">
                  Configurazione completa del menu
                </p>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-[#888]">
                  Carichiamo noi tutto: piatti, categorie, prezzi, allergeni e
                  traduzioni in 5 lingue. Ricevi link e QR code, pronti alla
                  scansione.
                </p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="text-[2.6rem] font-bold leading-none tracking-[-0.04em] text-[#141415]">
                  120€
                </p>
                <p className="mt-1 text-[0.82rem] text-[#adadad]">IVA incl.</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-6 flex max-w-3xl items-center gap-4">
            <span className="h-px flex-1 bg-[#ececec]" />
            <span className="rounded-full border border-[#ececec] bg-white px-4 py-1 text-[0.78rem] font-semibold text-[#888]">
              Poi
            </span>
            <span className="h-px flex-1 bg-[#ececec]" />
          </div>

          {/* Subscription plans */}
          <div className="mx-auto mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
            {/* Mensile */}
            <div className="rounded-[24px] border border-[#ececec] bg-white p-7 transition-[box-shadow] duration-200 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)]">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[#888]">
                Abbonamento mensile
              </p>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[2.8rem] font-bold leading-none tracking-[-0.04em]">
                  19€
                </span>
                <span className="text-[0.9rem] text-[#888]">/mese</span>
              </div>
              <p className="mt-1 text-[0.82rem] text-[#adadad]">
                IVA incl.
              </p>

              <hr className="my-6 border-[#f0f0f0]" />

              <ul className="space-y-3">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9rem] text-[#444]">
                    <span className="mt-0.5 shrink-0 text-[#560200]">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/attiva"
                className="mt-8 flex w-full items-center justify-center rounded-full border border-[#d8dadc] py-3 text-[0.92rem] font-bold text-[#141415] transition-[background-color,border-color] duration-200 hover:border-[#c0c0c0] hover:bg-[#fafafa]"
              >
                Scegli Mensile
              </Link>
            </div>

            {/* Annuale */}
            <div className="relative rounded-[24px] bg-[#560200] p-7 text-white shadow-[0_24px_72px_rgba(86,2,0,0.22)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_32px_80px_rgba(86,2,0,0.28)]">
              <div
                className="pointer-events-none absolute inset-0 rounded-[24px] opacity-30"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 0%, rgba(242,232,216,0.4) 0%, transparent 60%)",
                }}
              />
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f2e8d8] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#560200]">
                Più scelto · Risparmia 35%
              </span>

              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[#f2e8d8]/70">
                Abbonamento annuale
              </p>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[2.8rem] font-bold leading-none tracking-[-0.04em]">
                  149€
                </span>
                <span className="text-[0.9rem] text-[#f2e8d8]/70">/anno</span>
              </div>
              <p className="mt-1 text-[0.82rem] text-[#f2e8d8]/70">
                IVA incl. · equiv. 12,4€/mese
              </p>

              <hr className="my-6 border-white/15" />

              <ul className="space-y-3">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9rem] text-[#f2e8d8]/90">
                    <span className="mt-0.5 shrink-0 text-[#f2e8d8]">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/attiva"
                className="relative mt-8 flex w-full items-center justify-center rounded-full bg-white py-3 text-[0.92rem] font-bold text-[#560200] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-[background-color,transform] duration-200 hover:bg-[#f2e8d8] active:scale-[0.98]"
              >
                Scegli Annuale
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-[0.84rem] text-[#adadad]">
            Il setup (120€) si paga una sola volta, separatamente
            dall&apos;abbonamento.
          </p>
        </section>

        {/* ─── Final CTA (dark) ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="relative overflow-hidden rounded-[28px] bg-[#0d0d0f] px-6 py-16 text-center text-white sm:px-14 sm:py-24">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 15% 110%, rgba(86,2,0,0.55) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 85% -10%, rgba(248,165,184,0.15) 0%, transparent 50%)",
              }}
            />

            {/* subtle grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              aria-hidden="true"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#f2e8d8]">
                Inizia oggi
              </p>
              <h2 className="text-[2rem] font-bold tracking-[-0.035em] sm:text-[2.8rem]">
                Pronto a portare il tuo locale online?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-[#a0a0a0]">
                Raccontaci del tuo ristorante. Configuriamo il menu insieme — il
                tuo locale è online in meno di due ore.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <JoinUsButton
                  variant="secondary"
                  className="rounded-full px-7 py-3.5 text-[0.94rem] font-bold shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
                >
                  Contattaci
                </JoinUsButton>
                <Link
                  href="/attiva"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-[0.94rem] font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-white/10 active:scale-[0.97]"
                >
                  Vedi i prezzi
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#ececec] bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <DigiMenuLogo />
              <p className="mt-3.5 text-[0.88rem] leading-[1.65] text-[#888]">
                Menu digitale multilingue per ristoranti e locali. Brand
                personalizzato, preferiti, allergeni e dashboard centralizzata.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 text-[0.88rem]">
              {[
                {
                  title: "Prodotto",
                  links: [
                    { href: "#funzionalita", label: "Funzionalità" },
                    { href: "/aribri", label: "Demo live" },
                    { href: "/attiva", label: "Prezzi" },
                  ],
                },
                {
                  title: "Contatti",
                  links: [
                    { href: "mailto:info@digi-menu.it", label: "info@digi-menu.it" },
                  ],
                },
                {
                  title: "Legale",
                  links: [
                    { href: "/termini-e-condizioni", label: "Termini" },
                    { href: "/privacy-policy", label: "Privacy" },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#c0c0c0]">
                    {col.title}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith("mailto") ||
                        link.href.startsWith("#") ? (
                          <a
                            href={link.href}
                            className="text-[#888] transition-colors hover:text-[#560200]"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-[#888] transition-colors hover:text-[#560200]"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-1.5 border-t border-[#ececec] pt-8 text-[0.78rem] text-[#c0c0c0] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Salvatore Anastasia · Via Capirro I,
              76125 Trani (BT)
            </p>
            <p>P.IVA / CF in fase di registrazione</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
