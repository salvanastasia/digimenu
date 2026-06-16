import type { Metadata } from "next";
import Link from "next/link";
import { DigiMenuLogo } from "@/components/DigiMenuLogo";

export const metadata: Metadata = {
  title: "Pagamento completato · DigiMenu",
};

export default function AttivaSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7] text-[#141415]">
      <header className="border-b border-[#e4e4e4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
          <DigiMenuLogo />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#560200]/10">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              className="text-[#560200]"
            >
              <path
                d="M5 12.5L9.5 17 19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-[2rem] font-bold tracking-[-0.02em]">
            Pagamento completato!
          </h1>
          <p className="mt-4 text-[1rem] leading-relaxed text-[#606060]">
            Grazie per aver scelto DigiMenu. Riceverai a breve una email con le
            credenziali di accesso alla dashboard e le istruzioni per configurare
            il tuo menu.
          </p>
          <p className="mt-3 text-[0.88rem] text-[#606060]">
            Non trovi l&apos;email?{" "}
            <a
              href="mailto:info@digi-menu.it"
              className="font-semibold text-[#560200] hover:underline"
            >
              Scrivici subito
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-full bg-[#560200] px-6 py-3 text-[0.92rem] font-bold text-white transition-opacity hover:opacity-90"
            >
              Vai alla dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#d8dadc] px-6 py-3 text-[0.92rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
