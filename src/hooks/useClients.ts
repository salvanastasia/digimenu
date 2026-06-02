"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEmptyClient } from "@/lib/client-defaults";
import { db, isInstantConfigured } from "@/lib/db";
import { instantTransact } from "@/lib/instant-query";
import {
  buildCreateTransaction,
  buildDeleteTransaction,
  buildSaveTransaction,
  buildSeedUpsertTransactions,
  cloneClient,
  entriesFromRows,
  seedInstantFromLocalStorageIfEmpty,
  type InstantClientMenuRow,
} from "@/lib/instant-client-sync";
import { getDefaultSeedEntriesToApply, getDuplicateDefaultCleanupClientIds } from "@/lib/client-seeds";
import { saveClientVersion } from "@/lib/client-store";
import type { ClientConfig, ClientStoreEntry } from "@/types/client";

type UseClientsOptions = {
  canWrite?: boolean;
};

export function useClients({ canWrite = false }: UseClientsOptions = {}) {
  const { isLoading, error, data } = db.useQuery({ clientMenus: {} });
  const [seedState, setSeedState] = useState<"idle" | "seeding" | "done">(
    "idle",
  );
  const seedStarted = useRef(false);

  useEffect(() => {
    if (!canWrite || !isInstantConfigured || isLoading || seedStarted.current) {
      return;
    }

    if ((data?.clientMenus?.length ?? 0) > 0) {
      setSeedState("done");
      return;
    }

    seedStarted.current = true;
    setSeedState("seeding");

    seedInstantFromLocalStorageIfEmpty()
      .catch((seedError) => {
        console.error("InstantDB seed failed", seedError);
      })
      .finally(() => {
        setSeedState("done");
      });
  }, [canWrite, data?.clientMenus, isLoading]);

  useEffect(() => {
    if (!canWrite) {
      setSeedState("done");
    }
  }, [canWrite]);

  const entries = useMemo(
    () =>
      entriesFromRows(
        data?.clientMenus as InstantClientMenuRow[] | undefined,
      ),
    [data?.clientMenus],
  );

  useEffect(() => {
    if (
      !canWrite ||
      !isInstantConfigured ||
      isLoading ||
      seedState !== "done" ||
      error
    ) {
      return;
    }

    const presentIds = new Set(entries.map((entry) => entry.config.id));
    const defaultEntries = getDefaultSeedEntriesToApply(entries);
    const duplicateIds = getDuplicateDefaultCleanupClientIds(entries);
    const transactions = [
      ...buildSeedUpsertTransactions(defaultEntries, presentIds),
      ...duplicateIds.map((clientId) => buildDeleteTransaction(clientId)),
    ];

    if (transactions.length === 0) return;

    instantTransact(db.transact(transactions), "sync-default-clients");
  }, [canWrite, entries, error, isLoading, seedState]);

  const ready =
    isInstantConfigured && !isLoading && (!canWrite || seedState === "done") && !error;

  const clients = useMemo(
    () => entries.map((entry) => entry.config),
    [entries],
  );

  const addClient = useCallback((): ClientConfig => {
    const empty = createEmptyClient();
    instantTransact(db.transact(buildCreateTransaction(empty)), "create-client");
    return empty;
  }, []);

  const removeClient = useCallback(
    (id: string) => {
      if (entries.length <= 1) return false;
      instantTransact(db.transact(buildDeleteTransaction(id)), "delete-client");
      return true;
    },
    [entries.length],
  );

  const getEntry = useCallback(
    (id: string) => entries.find((entry) => entry.config.id === id) ?? null,
    [entries],
  );

  const getClient = useCallback(
    (id: string) => getEntry(id)?.config ?? null,
    [getEntry],
  );

  const saveClient = useCallback(
    (id: string, draft: ClientConfig) => {
      const transaction = buildSaveTransaction(entries, id, draft);
      if (!transaction) return null;

      const next = saveClientVersion(entries, id, draft);
      instantTransact(db.transact(transaction), "save-client");
      return next.find((entry) => entry.config.id === id) ?? null;
    },
    [entries],
  );

  return {
    clients,
    entries,
    ready,
    error,
    isInstantConfigured,
    addClient,
    removeClient,
    getClient,
    getEntry,
    saveClient,
    cloneClient,
  };
}
