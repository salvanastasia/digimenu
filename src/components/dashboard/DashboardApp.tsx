"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { ClientEditor } from "@/components/dashboard/ClientEditor";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useClients } from "@/hooks/useClients";
import { useDashboardAdmin } from "@/hooks/useDashboardAdmin";
import { usePendingClientAssets } from "@/hooks/usePendingClientAssets";
import {
  fetchClientAssetUrls,
  mergeConfigWithStoredAssets,
  type ClientAssetKind,
} from "@/lib/instant-file-storage";
import { getInstantErrorMessage } from "@/lib/instant-query";
import type { ClientConfig } from "@/types/client";

export function DashboardApp() {
  const { email: adminEmail } = useDashboardAdmin();
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClientConfig | null>(null);
  const [versionIndex, setVersionIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedBaseline, setSavedBaseline] = useState<ClientConfig | null>(null);
  const pendingAssets = usePendingClientAssets();

  const entry = selectedId ? getEntry(selectedId) : null;

  const newClientFromQueryHandled = useRef(false);

  const openClientEditor = useCallback(
    async (clientId: string) => {
      const nextEntry = getEntry(clientId);
      if (!nextEntry) return;

      pendingAssets.reset();
      setSaveStatus("idle");
      setSaveError(null);

      const assets = await fetchClientAssetUrls(clientId);
      const config = mergeConfigWithStoredAssets(
        cloneClient(nextEntry.config),
        assets,
      );

      setSelectedId(clientId);
      setDraft(config);
      setSavedBaseline(config);
      setVersionIndex(Math.max(0, nextEntry.versions.length - 1));
    },
    [cloneClient, getEntry, pendingAssets],
  );

  const openNewClient = useCallback(() => {
    const client = addClient();
    void openClientEditor(client.id);
  }, [addClient, openClientEditor]);

  useEffect(() => {
    if (
      !ready ||
      searchParams.get("newClient") !== "1" ||
      newClientFromQueryHandled.current
    ) {
      return;
    }
    newClientFromQueryHandled.current = true;
    openNewClient();
    router.replace("/dashboard");
  }, [ready, searchParams, router, openNewClient]);

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
      const savedEntry = await saveClient(selectedId, nextDraft);
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
        <p>
          {error
            ? getInstantErrorMessage(error)
            : "Caricamento dashboard…"}
        </p>
      </div>
    );
  }

  return (
    <DashboardShell
      title={draft?.name ?? "Dashboard clienti"}
      hidden={draft?.hidden}
      onNewClient={openNewClient}
    >
        {draft && entry ? (
            <ClientEditor
              client={draft}
              adminEmail={adminEmail}
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
              onRestoreVersion={() => void handleSave()}
              isDirty={isDirty}
              saveStatus={saveStatus}
              saveError={saveError}
              isSaving={isSaving}
              onSave={() => void handleSave()}
            />
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
                  onOpen={() => void openClientEditor(client.id)}
                />
              ))}
            </div>
          </>
        )}
    </DashboardShell>
  );
}
