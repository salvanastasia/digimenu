"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createEmptyClient } from "@/lib/client-defaults";
import {
  cloneClient,
  createVersion,
  loadStore,
  persistStore,
  saveClientVersion,
} from "@/lib/client-store";
import type { ClientConfig, ClientStoreEntry } from "@/types/client";

export function useClients() {
  const [entries, setEntries] = useState<ClientStoreEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = loadStore();
    setEntries(initial);
    persistStore(initial);
    setReady(true);
  }, []);

  const clients = useMemo(
    () => entries.map((entry) => entry.config),
    [entries],
  );

  const persist = useCallback((next: ClientStoreEntry[]) => {
    setEntries(next);
    persistStore(next);
  }, []);

  const addClient = useCallback((): ClientConfig => {
    const empty = createEmptyClient();
    const entry = { config: empty, versions: [createVersion(empty)] };
    persist([...entries, entry]);
    return empty;
  }, [entries, persist]);

  const removeClient = useCallback(
    (id: string) => {
      if (entries.length <= 1) return false;
      persist(entries.filter((entry) => entry.config.id !== id));
      return true;
    },
    [entries, persist],
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
      const next = saveClientVersion(entries, id, draft);
      persist(next);
      return next.find((entry) => entry.config.id === id) ?? null;
    },
    [entries, persist],
  );

  return {
    clients,
    entries,
    ready,
    addClient,
    removeClient,
    getClient,
    getEntry,
    saveClient,
    cloneClient,
  };
}
