import { getClientBySlug, loadStore, persistStore } from "@/lib/client-store";

export {
  cloneClient,
  createEmptyClient,
  createVersion,
  getClientBySlug,
  loadStore,
  normalizeClientSlug,
  persistStore,
  saveClientVersion,
} from "@/lib/client-store";

export function loadClients() {
  return loadStore().map((entry) => entry.config);
}

export function persistClients(clients: import("@/types/client").ClientConfig[]) {
  const current = loadStore();
  persistStore(
    clients.map((config) => {
      const existing = current.find((entry) => entry.config.id === config.id);
      return (
        existing ?? {
          config,
          versions: [],
        }
      );
    }),
  );
}
