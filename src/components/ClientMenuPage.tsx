"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MenuApp } from "@/components/MenuApp";
import { ClientMenuProvider } from "@/context/ClientMenuContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { db, isInstantConfigured } from "@/lib/db";
import {
  rowToEntry,
  type InstantClientMenuRow,
} from "@/lib/instant-client-sync";
import { clientToMenuContent } from "@/lib/client-to-menu";
import { buildClientTranslationBundle } from "@/lib/static-fixed-translations";
import type { Locale, TranslationBundle } from "@/types/translation";
import {
  CLIENT_ASSET_PATH_PREFIX,
  clientAssetsPathLike,
  mergeConfigWithStoredAssets,
  storedAssetsFromFileRows,
} from "@/lib/instant-file-storage";

type ClientMenuPageProps = {
  slug: string;
};

export function ClientMenuPage({ slug }: ClientMenuPageProps) {
  const { isLoading, error, data } = db.useQuery({
    clientMenus: {
      $: {
        where: {
          slug,
        },
      },
    },
  });

  const menuRow = data?.clientMenus?.[0] as InstantClientMenuRow | undefined;
  const clientId = menuRow?.clientId;

  const { data: filesData, isLoading: filesLoading } = db.useQuery({
    $files: {
      $: {
        where: {
          path: {
            $like: clientId
              ? clientAssetsPathLike(clientId)
              : `${CLIENT_ASSET_PATH_PREFIX}/__no_match__/%`,
          },
        },
      },
    },
  });

  const client = useMemo(() => {
    if (!menuRow) return null;
    const base = rowToEntry(menuRow).config;
    const assets = storedAssetsFromFileRows(
      filesData?.$files as { path: string; url: string }[] | undefined,
    );
    return mergeConfigWithStoredAssets(base, assets);
  }, [menuRow, filesData?.$files]);

  if (!isInstantConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.4rem] font-bold text-[#141415]">
          InstantDB non configurato
        </h1>
        <p className="max-w-md text-[0.95rem] text-[#606060]">
          Imposta <code>NEXT_PUBLIC_INSTANT_APP_ID</code> in <code>.env</code>{" "}
          e sincronizza schema e permessi con Instant CLI.
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

  if (isLoading || (clientId && filesLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] text-[#606060]">
        Caricamento menu…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f7] px-6 text-center">
        <h1 className="text-[1.4rem] font-bold text-[#141415]">
          Errore di connessione
        </h1>
        <p className="max-w-md text-[0.95rem] text-[#606060]">
          Impossibile caricare il menu da InstantDB.
        </p>
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
          Nessun menu configurato per <code>/{slug}</code>.
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

  const getClientBundle = (locale: Exclude<Locale, "it">): TranslationBundle | null =>
    buildClientTranslationBundle(client, locale);

  return (
    <ClientMenuProvider client={client}>
      <LanguageProvider
        baseContent={baseContent}
        enabledLocales={client.header.languages}
        getClientBundle={getClientBundle}
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
