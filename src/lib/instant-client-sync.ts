import { id, lookup, tx } from "@instantdb/react";
import { createAribriSeedClient } from "@/lib/client-defaults";
import { getDefaultSeedEntries } from "@/lib/client-seeds";
import { db } from "@/lib/db";
import { migrateClientTranslations } from "@/lib/client-translation-payload";
import {
  cloneClient,
  createVersion,
  loadStore,
  migrateClientRecord,
  saveClientVersion,
  toStoreEntry,
} from "@/lib/client-store";
import type { ClientConfig, ClientStoreEntry, ClientVersion } from "@/types/client";

export type InstantClientMenuRow = {
  id: string;
  clientId: string;
  slug: string;
  hidden: boolean;
  config: ClientConfig;
  versions: ClientVersion[];
  updatedAt: string;
};

export function rowToEntry(row: InstantClientMenuRow): ClientStoreEntry {
  const config = migrateClientTranslations(migrateClientRecord(row.config));
  const versions =
    Array.isArray(row.versions) && row.versions.length > 0
      ? row.versions.map((version) => ({
          ...version,
          config: migrateClientRecord(version.config),
        }))
      : [createVersion(config)];

  return { config, versions };
}

export function entriesFromRows(
  rows: InstantClientMenuRow[] | undefined,
): ClientStoreEntry[] {
  if (!rows?.length) return [];
  return rows.map(rowToEntry);
}

function buildRowPayload(entry: ClientStoreEntry) {
  return {
    clientId: entry.config.id,
    slug: entry.config.slug,
    hidden: entry.config.hidden,
    config: entry.config,
    versions: entry.versions,
    updatedAt: entry.config.updatedAt,
  };
}

export function buildUpsertTransactions(entries: ClientStoreEntry[]) {
  return entries.map((entry) =>
    tx.clientMenus[id()].update(buildRowPayload(entry)),
  );
}

export function buildSeedUpsertTransactions(
  entries: ClientStoreEntry[],
  existingClientIds: ReadonlySet<string> = new Set(),
) {
  return entries.map((entry) => {
    const payload = buildRowPayload(entry);

    if (existingClientIds.has(entry.config.id)) {
      return tx.clientMenus[lookup("clientId", entry.config.id)].update(payload);
    }

    return tx.clientMenus[id()].update(payload);
  });
}

export function buildSaveTransaction(
  entries: ClientStoreEntry[],
  clientId: string,
  draft: ClientConfig,
) {
  const nextEntries = saveClientVersion(entries, clientId, draft);
  const saved = nextEntries.find((entry) => entry.config.id === clientId);
  if (!saved) return null;

  return tx.clientMenus[lookup("clientId", clientId)].update(
    buildRowPayload(saved),
  );
}

export function buildDeleteTransaction(clientId: string) {
  return tx.clientMenus[lookup("clientId", clientId)].delete();
}

export function buildCreateTransaction(client: ClientConfig) {
  const entry = toStoreEntry(client);
  return tx.clientMenus[id()].update(buildRowPayload(entry));
}

function hasPersistedLocalClients(): boolean {
  if (typeof window === "undefined") return false;

  try {
    for (const key of ["digimenu-clients-v2", "digimenu-clients-v1"]) {
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function seedInstantFromLocalStorageIfEmpty() {
  const snapshot = await db.queryOnce({ clientMenus: {} });
  if ((snapshot.data.clientMenus?.length ?? 0) > 0) {
    return false;
  }

  const entries = hasPersistedLocalClients()
    ? loadStore()
    : getDefaultSeedEntries();

  await db.transact(buildSeedUpsertTransactions(entries, new Set()));
  return true;
}

export async function seedDefaultClientsToInstant() {
  const snapshot = await db.queryOnce({ clientMenus: {} });
  const existingClientIds = new Set(
    (snapshot.data.clientMenus ?? []).map(
      (row) => (row as InstantClientMenuRow).clientId,
    ),
  );
  const entries = getDefaultSeedEntries();

  await db.transact(buildSeedUpsertTransactions(entries, existingClientIds));
  return entries.map((entry) => entry.config.slug);
}

export { cloneClient };
