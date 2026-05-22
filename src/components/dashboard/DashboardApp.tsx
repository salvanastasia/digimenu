"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { ClientEditor } from "@/components/dashboard/ClientEditor";
import { useClients } from "@/hooks/useClients";
import type { ClientConfig } from "@/types/client";

export function DashboardApp() {
  const {
    clients,
    ready,
    addClient,
    removeClient,
    getEntry,
    saveClient,
    cloneClient,
  } = useClients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClientConfig | null>(null);
  const [versionIndex, setVersionIndex] = useState(0);

  const entry = selectedId ? getEntry(selectedId) : null;

  const closeClient = () => {
    setSelectedId(null);
    setDraft(null);
    setVersionIndex(0);
  };

  const isDirty = useMemo(() => {
    if (!entry || !draft) return false;
    const baseline =
      entry.versions[versionIndex]?.config ?? entry.config;
    return JSON.stringify(draft) !== JSON.stringify(baseline);
  }, [draft, entry, versionIndex]);

  const handleSave = () => {
    if (!selectedId || !draft) return;
    const savedEntry = saveClient(selectedId, draft);
    if (!savedEntry) return;
    setDraft(cloneClient(savedEntry.config));
    setVersionIndex(savedEntry.versions.length - 1);
  };

  const goToVersion = (nextIndex: number) => {
    if (!entry) return;
    const safeIndex = Math.max(
      0,
      Math.min(nextIndex, entry.versions.length - 1),
    );
    setVersionIndex(safeIndex);
    setDraft(cloneClient(entry.versions[safeIndex].config));
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] text-[#606060]">
        Caricamento dashboard…
      </div>
    );
  }

  const menuHref = draft?.slug ? `/${draft.slug}` : "/aribri";

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b border-[#e4e4e4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#560200]">
              DigiMenu
            </p>
            <h1 className="text-[1.35rem] font-bold text-[#141415]">
              {draft?.name ?? "Dashboard clienti"}
              {draft?.hidden ? (
                <span className="ml-2 align-middle text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8a1f1f]">
                  Nascosto
                </span>
              ) : null}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={menuHref}
              className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.84rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
            >
              Vai al menu
            </Link>
            {!draft ? (
              <button
                type="button"
                onClick={() => {
                  const client = addClient();
                  setSelectedId(client.id);
                  setDraft(cloneClient(client));
                  setVersionIndex(0);
                }}
                className="rounded-full bg-[#560200] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
              >
                + Nuovo cliente
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {draft && entry ? (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#e4e4e4] bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={versionIndex <= 0}
                  onClick={() => goToVersion(versionIndex - 1)}
                  className="rounded-full border border-[#d8dadc] px-3 py-1.5 text-[0.82rem] font-semibold text-[#141415] disabled:opacity-40"
                >
                  ← Versione
                </button>
                <span className="text-[0.82rem] text-[#606060]">
                  {entry.versions.length > 0
                    ? `Versione ${versionIndex + 1} / ${entry.versions.length}`
                    : "Nessuna versione"}
                  {entry.versions[versionIndex]
                    ? ` · ${new Intl.DateTimeFormat("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(entry.versions[versionIndex].savedAt))}`
                    : null}
                </span>
                <button
                  type="button"
                  disabled={versionIndex >= entry.versions.length - 1}
                  onClick={() => goToVersion(versionIndex + 1)}
                  className="rounded-full border border-[#d8dadc] px-3 py-1.5 text-[0.82rem] font-semibold text-[#141415] disabled:opacity-40"
                >
                  Versione →
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isDirty ? (
                  <span className="text-[0.78rem] font-medium text-[#8a1f1f]">
                    Modifiche non salvate
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-[#560200] px-5 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
                >
                  Salva
                </button>
              </div>
            </div>

            <ClientEditor
              client={draft}
              otherSlugs={clients
                .filter((client) => client.id !== draft.id)
                .map((client) => client.slug)}
              onChange={setDraft}
              onBack={closeClient}
              onDelete={() => {
                if (removeClient(draft.id)) {
                  closeClient();
                }
              }}
              canDelete={clients.length > 1}
              canRemoveCategory={draft.categories.length > 1}
            />
          </>
        ) : (
          <>
            <p className="mb-5 text-[0.92rem] text-[#606060]">
              Seleziona un cliente per modificare brand, header, lingue e piatti.
              Usa Salva per creare un backup versionato.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onOpen={() => {
                    const nextEntry = getEntry(client.id);
                    if (!nextEntry) return;
                    setSelectedId(client.id);
                    setDraft(cloneClient(nextEntry.config));
                    setVersionIndex(Math.max(0, nextEntry.versions.length - 1));
                  }}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
