import type { Metadata } from "next";
import Link from "next/link";
import { DigiMenuLogo } from "@/components/DigiMenuLogo";

export const metadata: Metadata = {
  title: "Privacy Policy · DigiMenu",
  description:
    "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) — DigiMenu.",
};

const LAST_UPDATED = "16 giugno 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#141415]">
      <header className="sticky top-0 z-50 border-b border-[#e4e4e4] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <DigiMenuLogo />
          <Link
            href="/"
            className="text-[0.84rem] font-semibold text-[#606060] transition-colors hover:text-[#141415]"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#560200]">
            Documento legale
          </p>
          <h1 className="text-[2.2rem] font-bold tracking-[-0.02em]">
            Informativa Privacy
          </h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-[#606060]">
            Ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003
            (Codice Privacy) come modificato dal D.Lgs. 101/2018.
          </p>
          <p className="mt-2 text-[0.88rem] text-[#888]">
            Ultimo aggiornamento: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-[0.97rem] leading-relaxed text-[#2a2a2a]">

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">1. Titolare del Trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati personali è:
            </p>
            <div className="mt-3 rounded-[14px] border border-[#e4e4e4] bg-white p-4 text-[0.9rem]">
              <p><strong>Salvatore Anastasia</strong></p>
              <p>Via Capirro I, 76125 Trani (BT), Italia</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@digi-menu.it"
                  className="font-semibold text-[#560200] hover:underline"
                >
                  info@digi-menu.it
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">2. Dati Raccolti</h2>
            <p>
              DigiMenu raccoglie le seguenti categorie di dati personali:
            </p>
            <ul className="mt-3 space-y-4 pl-5">
              <li className="list-disc">
                <strong>Dati di registrazione e account:</strong> nome, cognome,
                indirizzo email, nome del locale, numero di telefono (opzionale).
              </li>
              <li className="list-disc">
                <strong>Dati di pagamento:</strong> elaborati direttamente da
                Stripe (carta di credito/debito, Apple Pay, Google Pay) o PayPal.
                DigiMenu non conserva i dati della carta in chiaro.
              </li>
              <li className="list-disc">
                <strong>Dati di utilizzo (log tecnici):</strong> indirizzo IP,
                tipo di browser, pagine visitate, data e ora di accesso, durata
                della sessione. Raccolti automaticamente dai server.
              </li>
              <li className="list-disc">
                <strong>Dati dei clienti finali:</strong> i visitatori del menu
                pubblico non devono registrarsi; eventuali dati tecnici anonimi
                (statistiche di accesso) possono essere raccolti attraverso
                strumenti di analisi.
              </li>
              <li className="list-disc">
                <strong>Dati inseriti nel menu:</strong> i contenuti (piatti,
                prezzi, allergeni, foto) inseriti dall'utente nella dashboard
                sono trattati su incarico del Titolare stesso come responsabile
                autonomo dei propri contenuti.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">3. Finalità e Base Giuridica del Trattamento</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead>
                  <tr className="border-b border-[#e4e4e4] bg-[#fafafa]">
                    <th className="py-2 pr-4 text-left font-semibold text-[#141415]">Finalità</th>
                    <th className="py-2 text-left font-semibold text-[#141415]">Base giuridica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {[
                    ["Erogazione del servizio (dashboard, menu pubblico)", "Esecuzione del contratto (art. 6.1.b GDPR)"],
                    ["Gestione pagamenti e fatturazione", "Esecuzione del contratto + obbligo legale (art. 6.1.b/c)"],
                    ["Invio email transazionali (credenziali, ricevute, assistenza)", "Esecuzione del contratto (art. 6.1.b)"],
                    ["Comunicazioni di marketing, aggiornamenti, novità", "Consenso (art. 6.1.a GDPR) — revocabile in ogni momento"],
                    ["Adempimenti fiscali e contabili", "Obbligo legale (art. 6.1.c GDPR)"],
                    ["Sicurezza del servizio e prevenzione frodi", "Legittimo interesse (art. 6.1.f GDPR)"],
                  ].map(([finalita, base]) => (
                    <tr key={finalita}>
                      <td className="py-3 pr-4 align-top text-[#2a2a2a]">{finalita}</td>
                      <td className="py-3 align-top text-[#606060]">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">4. Periodo di Conservazione</h2>
            <ul className="mt-3 space-y-2 pl-5">
              <li className="list-disc">
                <strong>Dati account e contenuti menu:</strong> per tutta la
                durata dell'abbonamento + 12 mesi dopo la cessazione, per
                consentire il recupero in caso di riattivazione.
              </li>
              <li className="list-disc">
                <strong>Dati di pagamento e fatturazione:</strong> 10 anni, in
                ottemperanza agli obblighi fiscali italiani.
              </li>
              <li className="list-disc">
                <strong>Log tecnici:</strong> massimo 12 mesi.
              </li>
              <li className="list-disc">
                <strong>Dati per marketing (con consenso):</strong> fino alla
                revoca del consenso.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">5. Destinatari dei Dati</h2>
            <p>
              I dati personali possono essere comunicati a:
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <li className="list-disc">
                <strong>Stripe, Inc.</strong> — elaborazione pagamenti con carta,
                Apple Pay, Google Pay (con sede negli USA; trasferimento coperto
                da Standard Contractual Clauses). Privacy:{" "}
                <a href="https://stripe.com/it/privacy" target="_blank" rel="noopener" className="text-[#560200] hover:underline">
                  stripe.com/it/privacy
                </a>.
              </li>
              <li className="list-disc">
                <strong>PayPal (Europe) S.à r.l. et Cie, S.C.A.</strong> —
                elaborazione pagamenti PayPal. Privacy:{" "}
                <a href="https://www.paypal.com/it/legalhub/privacy-full" target="_blank" rel="noopener" className="text-[#560200] hover:underline">
                  paypal.com/it/legalhub/privacy-full
                </a>.
              </li>
              <li className="list-disc">
                <strong>Supabase / Vercel / provider di hosting:</strong> per
                l'erogazione tecnica del servizio cloud.
              </li>
              <li className="list-disc">
                <strong>Autorità competenti</strong> — ove richiesto da obblighi
                di legge.
              </li>
            </ul>
            <p className="mt-3">
              I dati non vengono ceduti a terzi per finalità di marketing di
              terze parti.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">6. Trasferimento Dati Extra-UE</h2>
            <p>
              Alcuni fornitori (Stripe, Vercel) trasferiscono dati verso paesi
              extra-UE (principalmente Stati Uniti). Il trasferimento avviene nel
              rispetto delle garanzie previste dal GDPR (Standard Contractual
              Clauses adottate dalla Commissione Europea o decisioni di
              adeguatezza).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">7. Cookie e Tecnologie Analoghe</h2>
            <p>
              DigiMenu utilizza esclusivamente cookie tecnici necessari al
              funzionamento del servizio (sessione di autenticazione, preferenze
              di lingua). Non vengono utilizzati cookie di profilazione o di
              tracciamento di terze parti, salvo diversa comunicazione.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">8. Diritti dell'Interessato</h2>
            <p>
              Ai sensi degli artt. 15–22 GDPR, l'interessato ha il diritto di:
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <li className="list-disc"><strong>Accesso</strong> — ottenere conferma del trattamento e copia dei dati;</li>
              <li className="list-disc"><strong>Rettifica</strong> — richiedere la correzione di dati inesatti o incompleti;</li>
              <li className="list-disc"><strong>Cancellazione ("diritto all'oblio")</strong> — richiedere la cancellazione, salvo obbligo di conservazione;</li>
              <li className="list-disc"><strong>Limitazione</strong> — richiedere la limitazione del trattamento in determinati casi;</li>
              <li className="list-disc"><strong>Portabilità</strong> — ricevere i propri dati in formato strutturato e leggibile da macchina;</li>
              <li className="list-disc"><strong>Opposizione</strong> — opporsi al trattamento basato su legittimo interesse;</li>
              <li className="list-disc"><strong>Revoca del consenso</strong> — in qualsiasi momento, senza pregiudizio per la liceità del trattamento precedente;</li>
              <li className="list-disc"><strong>Reclamo</strong> — presentare reclamo al Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener" className="text-[#560200] hover:underline">garanteprivacy.it</a>).</li>
            </ul>
            <p className="mt-3">
              Per esercitare i propri diritti, scrivere a{" "}
              <a
                href="mailto:info@digi-menu.it"
                className="font-semibold text-[#560200] hover:underline"
              >
                info@digi-menu.it
              </a>
              . Il Titolare risponde entro 30 giorni.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">9. Sicurezza</h2>
            <p>
              DigiMenu adotta misure tecniche e organizzative adeguate a proteggere
              i dati personali da accesso non autorizzato, perdita, distruzione o
              divulgazione (crittografia in transito HTTPS/TLS, accessi autenticati,
              backup periodici).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">10. Modifiche alla Privacy Policy</h2>
            <p>
              Il Titolare si riserva il diritto di aggiornare la presente
              informativa. Le modifiche sostanziali saranno comunicate via email.
              La versione aggiornata sarà sempre disponibile su questa pagina con
              la data di ultimo aggiornamento.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">11. Contatti</h2>
            <p>
              Per qualsiasi domanda relativa alla privacy o per esercitare i propri
              diritti:
            </p>
            <div className="mt-3 rounded-[14px] border border-[#e4e4e4] bg-white p-4 text-[0.9rem]">
              <p><strong>Salvatore Anastasia</strong></p>
              <p>Via Capirro I, 76125 Trani (BT), Italia</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@digi-menu.it"
                  className="font-semibold text-[#560200] hover:underline"
                >
                  info@digi-menu.it
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 border-t border-[#e4e4e4] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[0.82rem] text-[#adadad] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} DigiMenu · Salvatore Anastasia · Via Capirro I, 76125 Trani (BT)</p>
          <div className="flex gap-4">
            <Link href="/termini-e-condizioni" className="hover:text-[#560200]">
              Termini
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#560200]">
              Privacy
            </Link>
            <a href="mailto:info@digi-menu.it" className="hover:text-[#560200]">
              info@digi-menu.it
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
