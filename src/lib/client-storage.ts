export {
  cloneClient,
  createEmptyClient,
  createVersion,
  loadStore,
  migrateClientRecord,
  normalizeClientSlug,
  saveClientVersion,
  toStoreEntry,
} from "@/lib/client-store";

export {
  buildCreateTransaction,
  buildDeleteTransaction,
  buildSaveTransaction,
  buildSeedUpsertTransactions,
  entriesFromRows,
  rowToEntry,
  seedDefaultClientsToInstant,
  seedInstantFromLocalStorageIfEmpty,
} from "@/lib/instant-client-sync";

export { db, isInstantConfigured } from "@/lib/db";
