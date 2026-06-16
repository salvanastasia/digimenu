import type { Metadata } from "next";
import Link from "next/link";
import { DigiMenuLogo } from "@/components/DigiMenuLogo";

export const metadata: Metadata = {
  title: "Termini e Condizioni · DigiMenu",
  description:
    "Termini e condizioni del servizio DigiMenu — menu digitale per ristoranti.",
};

const LAST_UPDATED = "16 giugno 2026";

export default function TerminiPage() {
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
            Termini e Condizioni
          </h1>
          <p className="mt-3 text-[0.88rem] text-[#888]">
            Ultimo aggiornamento: {LAST_UPDATED}
          </p>
        </div>

        <div className="prose-digimenu space-y-10 text-[0.97rem] leading-relaxed text-[#2a2a2a]">

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">1. Identificazione del Gestore</h2>
            <p>
              Il servizio DigiMenu è gestito da{" "}
              <strong>Salvatore Anastasia</strong>, con sede in Via Capirro I,
              76125 Trani (BT), Italia. Per qualsiasi comunicazione:
              info@digi-menu.it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">2. Oggetto del Contratto</h2>
            <p>
              DigiMenu è un servizio SaaS (Software as a Service) che consente a
              ristoratori e titolari di pubblici esercizi di creare, gestire e
              condividere un menu digitale personalizzato accessibile via QR code
              o link diretto. Acquistando un piano di abbonamento, l'utente
              ottiene accesso alla piattaforma di gestione (dashboard) e all'URL
              pubblico del proprio menu per la durata dell'abbonamento
              sottoscritto.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">3. Accettazione dei Termini</h2>
            <p>
              L'utilizzo del servizio e/o il completamento del pagamento
              costituisce accettazione integrale dei presenti Termini e
              Condizioni. Se non si accettano le presenti condizioni, non è
              possibile utilizzare il servizio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">4. Piani e Prezzi</h2>
            <p>
              DigiMenu è disponibile nei seguenti piani di abbonamento:
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <li className="list-disc">
                <strong>Piano Mensile</strong> — €19,00 IVA inclusa al mese,
                rinnovato automaticamente ogni 30 giorni.
              </li>
              <li className="list-disc">
                <strong>Piano Annuale</strong> — €149,00 IVA inclusa all'anno,
                rinnovato automaticamente ogni 12 mesi.
              </li>
            </ul>
            <p className="mt-3">
              I prezzi sono espressi in Euro e comprensivi di IVA ove applicabile.
              Il Gestore si riserva il diritto di modificare i prezzi con un
              preavviso di 30 giorni via email.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">5. Modalità di Pagamento</h2>
            <p>
              Il pagamento avviene tramite i metodi accettati al momento
              dell'acquisto (carta di credito/debito, Apple Pay, Google Pay,
              PayPal). I dati di pagamento sono gestiti direttamente dagli
              operatori Stripe e/o PayPal, certificati PCI-DSS. DigiMenu non
              conserva dati di pagamento in chiaro.
            </p>
            <p className="mt-3">
              Al termine del periodo di abbonamento, l'abbonamento si rinnova
              automaticamente addebitando il metodo di pagamento salvato, salvo
              disdetta nei termini indicati all'art. 7.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">6. Diritto di Recesso (14 giorni)</h2>
            <p>
              Ai sensi del D.Lgs. 206/2005 (Codice del Consumo), il consumatore
              ha diritto di recedere dal contratto entro <strong>14 giorni</strong>{" "}
              dalla data di acquisto, senza necessità di fornire motivazioni.
            </p>
            <p className="mt-3">
              Per esercitare il diritto di recesso, è sufficiente inviare una
              comunicazione esplicita a{" "}
              <a
                href="mailto:info@digi-menu.it"
                className="font-semibold text-[#560200] hover:underline"
              >
                info@digi-menu.it
              </a>{" "}
              prima della scadenza del termine. Il rimborso verrà effettuato entro
              14 giorni dalla ricezione della comunicazione, con lo stesso mezzo
              di pagamento utilizzato.
            </p>
            <p className="mt-3">
              Il diritto di recesso non si applica qualora il servizio sia stato
              interamente fruito e l'esecuzione sia iniziata su esplicita richiesta
              dell'utente e con il suo accordo alla perdita del diritto di recesso.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">7. Disdetta dell'Abbonamento</h2>
            <p>
              L'utente può disdire l'abbonamento in qualsiasi momento inviando
              una email a{" "}
              <a
                href="mailto:info@digi-menu.it"
                className="font-semibold text-[#560200] hover:underline"
              >
                info@digi-menu.it
              </a>
              . La disdetta avrà effetto al termine del periodo già pagato: il
              servizio rimarrà attivo fino alla scadenza, dopodiché non verrà
              rinnovato automaticamente. Non sono previsti rimborsi parziali per
              il periodo residuo, salvo esercizio del diritto di recesso entro i
              14 giorni.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">8. Obblighi dell'Utente</h2>
            <p>L'utente si impegna a:</p>
            <ul className="mt-3 space-y-2 pl-5">
              <li className="list-disc">
                Fornire informazioni accurate e aggiornate in fase di
                registrazione e utilizzo;
              </li>
              <li className="list-disc">
                Non pubblicare contenuti illegali, diffamatori, osceni o che
                violino diritti di terzi;
              </li>
              <li className="list-disc">
                Non tentare di accedere in modo non autorizzato ai sistemi o ai
                dati di altri utenti;
              </li>
              <li className="list-disc">
                Rispettare tutte le normative applicabili, inclusa la normativa
                sugli allergeni alimentari (Reg. UE 1169/2011).
              </li>
            </ul>
            <p className="mt-3">
              Il Gestore si riserva il diritto di sospendere o terminare l'accesso
              in caso di violazione dei presenti termini.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">9. Limitazione di Responsabilità</h2>
            <p>
              DigiMenu è fornito "così com'è" ("<em>as is</em>"). Il Gestore non
              garantisce la disponibilità continua e ininterrotta del servizio e
              non è responsabile per interruzioni di servizio dovute a cause di
              forza maggiore, guasti di terze parti o manutenzione pianificata.
            </p>
            <p className="mt-3">
              In nessun caso la responsabilità del Gestore potrà eccedere
              l'importo pagato dall'utente negli ultimi 3 mesi di abbonamento.
            </p>
            <p className="mt-3">
              Le informazioni sugli allergeni inserite nella dashboard sono di
              esclusiva responsabilità dell'utente (ristoratore). DigiMenu
              fornisce unicamente uno strumento di visualizzazione e non può
              essere ritenuto responsabile per omissioni o errori nei contenuti
              pubblicati.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">10. Proprietà Intellettuale</h2>
            <p>
              Il software, il codice, il design e i marchi di DigiMenu sono di
              proprietà di Salvatore Anastasia e sono protetti dalle leggi sul
              diritto d'autore. I contenuti del menu (foto, testi, loghi) caricati
              dall'utente rimangono di proprietà dell'utente, che concede a
              DigiMenu una licenza limitata per la loro visualizzazione sul
              servizio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">11. Modifiche ai Termini</h2>
            <p>
              Il Gestore si riserva il diritto di aggiornare i presenti Termini.
              Le modifiche saranno comunicate via email con un preavviso di almeno
              15 giorni. L'utilizzo continuato del servizio dopo la data di
              entrata in vigore costituisce accettazione delle modifiche.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">12. Legge Applicabile e Foro Competente</h2>
            <p>
              I presenti Termini sono regolati dal diritto italiano. Per qualsiasi
              controversia, salvo diversa disposizione di legge a tutela del
              consumatore, è competente in via esclusiva il Tribunale di Trani
              (BT).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[1.1rem] font-bold text-[#141415]">13. Contatti</h2>
            <p>
              Per qualsiasi questione relativa ai presenti Termini, è possibile
              contattare:{" "}
              <a
                href="mailto:info@digi-menu.it"
                className="font-semibold text-[#560200] hover:underline"
              >
                info@digi-menu.it
              </a>
            </p>
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
