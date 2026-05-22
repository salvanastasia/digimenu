"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuApp } from "@/components/MenuApp";
import { ClientMenuProvider } from "@/context/ClientMenuContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { clientToMenuContent } from "@/lib/client-to-menu";
import { getClientBySlug } from "@/lib/client-storage";
import type { ClientConfig } from "@/types/client";

type ClientMenuPageProps = {
  slug: string;
};

export function ClientMenuPage({ slug }: ClientMenuPageProps) {
  const [client, setClient] = useState<ClientConfig | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setClient(getClientBySlug(slug));
  }, [slug]);

  if (client === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] text-[#606060]">
        Caricamento menu…
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.4rem] font-bold text-[#141415]">
          Cliente non trovato
        </h1>
        <p className="max-w-md text-[0.95rem] text-[#606060]">
          Nessun menu configurato per <code>/{slug}</code> su questo browser.
        </p>
        <Link
          href="/dashboard"
          className="rounded-full bg-[#560200] px-5 py-2.5 text-[0.88rem] font-semibold text-white"
        >
          Vai alla dashboard
        </Link>
      </div>
    );
  }

  if (client.hidden) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.4rem] font-bold text-[#141415]">
          Menu non disponibile
        </h1>
        <p className="max-w-md text-[0.95rem] text-[#606060]">
          Il menu <code>/{slug}</code> è temporaneamente disattivato.
        </p>
        <Link
          href="/dashboard"
          className="rounded-full bg-[#560200] px-5 py-2.5 text-[0.88rem] font-semibold text-white"
        >
          Vai alla dashboard
        </Link>
      </div>
    );
  }

  const baseContent = clientToMenuContent(client);

  return (
    <ClientMenuProvider client={client}>
      <LanguageProvider
        baseContent={baseContent}
        enabledLocales={client.header.languages}
      >
        <div
          className="client-menu"
          style={
            {
              fontFamily: client.brand.fontFamily,
              "--brand-primary": client.brand.primaryColor,
            } as React.CSSProperties
          }
        >
          <MenuApp />
        </div>
      </LanguageProvider>
    </ClientMenuProvider>
  );
}
