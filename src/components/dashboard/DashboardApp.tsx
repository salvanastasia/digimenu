"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardAdminsPanel } from "@/components/dashboard/DashboardAdminsPanel";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { ClientEditor } from "@/components/dashboard/ClientEditor";
import { useClients } from "@/hooks/useClients";
import { useDashboardAdmin } from "@/hooks/useDashboardAdmin";
import { db } from "@/lib/db";
import { usePendingClientAssets } from "@/hooks/usePendingClientAssets";
import type { ClientAssetKind } from "@/lib/instant-file-storage";
import type { ClientConfig } from "@/types/client";

export function DashboardApp() {
  const {
    clients,
    ready,
    error,
    addClient,
    removeClient,
    getEntry,
    saveClient,
    cloneClient,
  } = useClients({ canWrite: true });
  const { email: adminEmail } = useDashboardAdmin();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClientConfig | null>(null);
  const [versionIndex, setVersionIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedBaseline, setSavedBaseline] = useState<ClientConfig | null>(null);
  const pendingAssets = usePendingClientAssets();

  const entry = selectedId ? getEntry(selectedId) : null;

  const closeClient = () => {
    pendingAssets.reset();
    setSelectedId(null);
    setDraft(null);
    setSavedBaseline(null);
    setVersionIndex(0);
    setSaveStatus("idle");
    setSaveError(null);
  };

  const isDirty = useMemo(() => {
    if (!draft || !savedBaseline) return false;
    return JSON.stringify(draft) !== JSON.stringify(savedBaseline);
  }, [draft, savedBaseline]);

  useEffect(() => {
    if (isDirty && saveStatus === "saved") {
      setSaveStatus("idle");
    }
  }, [isDirty, saveStatus]);

  const headerFieldForKind = (kind: ClientAssetKind) =>
    kind === "logo" ? "logoUrl" : "backgroundImageUrl";

  const handleAssetFileSelect = (kind: ClientAssetKind, file: File) => {
    if (!draft) return;

    const preview = pendingAssets.stageFile(kind, file);
    setSaveError(null);
    setDraft({
      ...draft,
      header: {
        ...draft.header,
        [headerFieldForKind(kind)]: preview,
      },
    });
  };

  const handleAssetRemove = (kind: ClientAssetKind) => {
    if (!draft || !savedBaseline) return;

    setSaveError(null);

    if (pendingAssets.hasPending(kind)) {
      pendingAssets.clearPending(kind);
      setDraft({
        ...draft,
        header: {
          ...draft.header,
          [headerFieldForKind(kind)]:
            savedBaseline.header[headerFieldForKind(kind)],
        },
      });
      return;
    }

    pendingAssets.stageRemove(kind);
    setDraft({
      ...draft,
      header: {
        ...draft.header,
        [headerFieldForKind(kind)]: "",
      },
    });
  };

  const handleAssetUrlChange = (kind: ClientAssetKind, url: string) => {
    if (!draft) return;

    pendingAssets.clearPending(kind);
    pendingAssets.clearRemoved(kind);
    setSaveError(null);
    setDraft({
      ...draft,
      header: {
        ...draft.header,
        [headerFieldForKind(kind)]: url,
      },
    });
  };

  const handleSave = async () => {
    if (!selectedId || !draft || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const nextDraft = await pendingAssets.flush(selectedId, draft);
      const savedEntry = saveClient(selectedId, nextDraft);
      if (!savedEntry) return;

      pendingAssets.reset();
      const savedConfig = cloneClient(savedEntry.config);
      setDraft(savedConfig);
      setSavedBaseline(savedConfig);
      setVersionIndex(savedEntry.versions.length - 1);
      setSaveStatus("saved");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const goToVersion = (nextIndex: number) => {
    if (!entry) return;
    pendingAssets.reset();
    setSaveError(null);
    setSaveStatus("idle");
    const safeIndex = Math.max(
      0,
      Math.min(nextIndex, entry.versions.length - 1),
    );
    const versionConfig = cloneClient(entry.versions[safeIndex].config);
    setVersionIndex(safeIndex);
    setDraft(versionConfig);
    setSavedBaseline(versionConfig);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f7f7f7] text-[#606060]">
        <p>{error ? "Errore connessione InstantDB…" : "Caricamento dashboard…"}</p>
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
            <button
              type="button"
              onClick={() => void db.auth.signOut()}
              className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.84rem] font-semibold text-[#606060] transition-colors hover:bg-[#f5f5f5]"
            >
              Esci
            </button>
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
                  pendingAssets.reset();
                  setSaveStatus("idle");
                  setSaveError(null);
                  const clientCopy = cloneClient(client);
                  setSelectedId(client.id);
                  setDraft(clientCopy);
                  setSavedBaseline(clientCopy);
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
              onAssetFileSelect={handleAssetFileSelect}
              onAssetRemove={handleAssetRemove}
              onAssetUrlChange={handleAssetUrlChange}
              versionIndex={versionIndex}
              versionCount={entry.versions.length}
              versionSavedAt={entry.versions[versionIndex]?.savedAt}
              onPreviousVersion={() => goToVersion(versionIndex - 1)}
              onNextVersion={() => goToVersion(versionIndex + 1)}
              isDirty={isDirty}
              saveStatus={saveStatus}
              saveError={saveError}
              isSaving={isSaving}
              onSave={() => void handleSave()}
            />
        ) : (
          <>
            <DashboardAdminsPanel currentEmail={adminEmail} />

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
                    pendingAssets.reset();
                    setSaveStatus("idle");
                    setSaveError(null);
                    const config = cloneClient(nextEntry.config);
                    setSelectedId(client.id);
                    setDraft(config);
                    setSavedBaseline(config);
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
