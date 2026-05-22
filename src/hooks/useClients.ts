"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEmptyClient } from "@/lib/client-defaults";
import { db, isInstantConfigured } from "@/lib/db";
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

export function useClients() {
  const { isLoading, error, data } = db.useQuery({ clientMenus: {} });
  const [seedState, setSeedState] = useState<"idle" | "seeding" | "done">(
    "idle",
  );
  const seedStarted = useRef(false);

  useEffect(() => {
    if (!isInstantConfigured || isLoading || seedStarted.current) return;

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
  }, [data?.clientMenus, isLoading]);

  const entries = useMemo(
    () =>
      entriesFromRows(
        data?.clientMenus as InstantClientMenuRow[] | undefined,
      ),
    [data?.clientMenus],
  );

  useEffect(() => {
    if (!isInstantConfigured || isLoading || seedState !== "done") return;

    const presentIds = new Set(entries.map((entry) => entry.config.id));
    const defaultEntries = getDefaultSeedEntriesToApply(entries);
    const duplicateIds = getDuplicateDefaultCleanupClientIds(entries);
    const transactions = [
      ...buildSeedUpsertTransactions(defaultEntries, presentIds),
      ...duplicateIds.map((clientId) => buildDeleteTransaction(clientId)),
    ];

    if (transactions.length === 0) return;

    void db.transact(transactions);
  }, [entries, isLoading, seedState]);

  const ready =
    isInstantConfigured && !isLoading && seedState === "done" && !error;

  const clients = useMemo(
    () => entries.map((entry) => entry.config),
    [entries],
  );

  const addClient = useCallback((): ClientConfig => {
    const empty = createEmptyClient();
    void db.transact(buildCreateTransaction(empty));
    return empty;
  }, []);

  const removeClient = useCallback(
    (id: string) => {
      if (entries.length <= 1) return false;
      void db.transact(buildDeleteTransaction(id));
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
      void db.transact(transaction);
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
