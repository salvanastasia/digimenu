import {
  createAribriSeedClient,
  createBarbayenneSeedClient,
} from "@/lib/client-defaults";
import { toStoreEntry } from "@/lib/client-store";
import type { ClientStoreEntry } from "@/types/client";

export function getDefaultSeedEntries(): ClientStoreEntry[] {
  return [
    toStoreEntry(createAribriSeedClient()),
    toStoreEntry(createBarbayenneSeedClient()),
  ];
}

export const DEFAULT_SEED_CLIENT_IDS = ["client-aribri", "client-barbayenne"] as const;

function mergeDefaultSeedEntry(
  seed: ClientStoreEntry,
  existing?: ClientStoreEntry,
): ClientStoreEntry {
  if (!existing) return seed;

  const { header: existingHeader } = existing.config;
  const keepCustomHeader =
    existingHeader.backgroundMode === "image" &&
    Boolean(existingHeader.backgroundImageUrl);

  return {
    ...seed,
    config: {
      ...seed.config,
      header: keepCustomHeader ? existingHeader : seed.config.header,
    },
  };
}

export function getDefaultSeedEntriesToApply(
  existingEntries: ClientStoreEntry[],
): ClientStoreEntry[] {
  const byId = new Map(existingEntries.map((entry) => [entry.config.id, entry]));

  return getDefaultSeedEntries().filter((seed) => {
    const clientId = seed.config.id as (typeof DEFAULT_SEED_CLIENT_IDS)[number];
    if (!DEFAULT_SEED_CLIENT_IDS.includes(clientId)) return false;

    const existing = byId.get(clientId);
    if (!existing) return true;

    return existing.config.dishes.length === 0;
  }).map((seed) => mergeDefaultSeedEntry(seed, byId.get(seed.config.id)));
}

export function getDuplicateDefaultCleanupClientIds(
  existingEntries: ClientStoreEntry[],
): string[] {
  const canonicalIds = new Set<string>(DEFAULT_SEED_CLIENT_IDS);
  const defaultSlugs = new Map(
    getDefaultSeedEntries().map((entry) => [entry.config.slug, entry.config.id]),
  );

  const removeIds: string[] = [];

  for (const entry of existingEntries) {
    const canonicalId = defaultSlugs.get(entry.config.slug);
    if (!canonicalId || entry.config.id === canonicalId) continue;
    if (canonicalIds.has(entry.config.id)) continue;

    const canonical = existingEntries.find(
      (candidate) => candidate.config.id === canonicalId,
    );
    if (!canonical) continue;

    removeIds.push(entry.config.id);
  }

  return removeIds;
}
