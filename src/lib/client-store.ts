import {
  createAribriSeedClient,
  createEmptyClient,
  DEFAULT_ADDRESS,
  DEFAULT_CUSTOMIZATIONS,
  DEFAULT_PHONE,
  DEFAULT_SUBTITLE,
  DEFAULT_TABLE_SERVICE_FEE,
  SUBTITLE_MAX_LENGTH,
} from "@/lib/client-defaults";
import { createPrefixedId } from "@/lib/create-id";
import { ensureUniqueSlug, slugify } from "@/lib/client-slug";
import type { ClientConfig, ClientStoreEntry, ClientVersion } from "@/types/client";

export const CLIENTS_STORAGE_KEY = "digimenu-clients-v2";
const LEGACY_STORAGE_KEY = "digimenu-clients-v1";

function cloneClient(config: ClientConfig): ClientConfig {
  return structuredClone(config);
}

function createVersion(config: ClientConfig): ClientVersion {
  return {
    id: createPrefixedId("v"),
    savedAt: new Date().toISOString(),
    config: cloneClient(config),
  };
}

function migrateLegacyHeader(client: ClientConfig): ClientConfig {
  const legacy = client.header as ClientConfig["header"] & {
    logoColor?: string;
    backgroundColor?: string;
    fabBackground?: string;
    fabIconColor?: string;
  };

  if (legacy.colorOverrides) {
    return client;
  }

  const overrides: ClientConfig["header"]["colorOverrides"] = {};

  if (
    legacy.logoColor &&
    legacy.logoColor !== client.brand.secondaryColor
  ) {
    overrides.logoColor = legacy.logoColor;
  }
  if (
    legacy.backgroundColor &&
    legacy.backgroundColor !== client.brand.primaryColor
  ) {
    overrides.backgroundColor = legacy.backgroundColor;
  }
  if (
    legacy.fabBackground &&
    legacy.fabBackground !== client.brand.secondaryColor
  ) {
    overrides.fabBackground = legacy.fabBackground;
  }
  if (
    legacy.fabIconColor &&
    legacy.fabIconColor !== client.brand.primaryColor
  ) {
    overrides.fabIconColor = legacy.fabIconColor;
  }

  return {
    ...client,
    header: {
      logoUrl: legacy.logoUrl ?? "/logo.svg",
      backgroundMode: legacy.backgroundMode ?? "color",
      backgroundImageUrl: legacy.backgroundImageUrl ?? "",
      languages: legacy.languages ?? ["it"],
      colorOverrides: overrides,
    },
  };
}

function migrateClient(client: ClientConfig): ClientConfig {
  const migrated = migrateLegacyHeader(client);

  return {
    ...migrated,
    hidden: migrated.hidden ?? false,
    subtitle: (migrated.subtitle ?? DEFAULT_SUBTITLE).slice(
      0,
      SUBTITLE_MAX_LENGTH,
    ),
    address: migrated.address ?? DEFAULT_ADDRESS,
    phone: migrated.phone ?? DEFAULT_PHONE,
    tableServiceFee:
      migrated.tableServiceFee ?? DEFAULT_TABLE_SERVICE_FEE,
    customizations: {
      favoritesView:
        migrated.customizations?.favoritesView ??
        DEFAULT_CUSTOMIZATIONS.favoritesView,
    },
    header: {
      ...migrated.header,
      backgroundMode: migrated.header.backgroundMode ?? "color",
      backgroundImageUrl: migrated.header.backgroundImageUrl ?? "",
      colorOverrides: migrated.header.colorOverrides ?? {},
    },
  };
}

function migrateSlugs(entries: ClientStoreEntry[]): ClientStoreEntry[] {
  const usedSlugs: string[] = [];

  return entries.map((entry) => {
    const base = entry.config.slug || slugify(entry.config.name);
    const slug = ensureUniqueSlug(base, usedSlugs);
    usedSlugs.push(slug);
    return {
      ...entry,
      config: { ...entry.config, slug },
    };
  });
}

function toStoreEntry(config: ClientConfig): ClientStoreEntry {
  const migrated = migrateClient(config);
  return {
    config: migrated,
    versions: [createVersion(migrated)],
  };
}

function loadLegacyClients(): ClientConfig[] | null {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as ClientConfig[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function loadStore(): ClientStoreEntry[] {
  try {
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ClientStoreEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return migrateSlugs(
          parsed.map((entry) => ({
            ...entry,
            config: migrateClient(entry.config),
            versions: entry.versions?.length
              ? entry.versions
              : [createVersion(entry.config)],
          })),
        );
      }
    }
  } catch {
    // fall through
  }

  const legacy = loadLegacyClients();
  if (legacy) {
    return migrateSlugs(legacy.map(toStoreEntry));
  }

  return migrateSlugs([toStoreEntry(createAribriSeedClient())]);
}

export function persistStore(entries: ClientStoreEntry[]) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(entries));
}

export function getClientBySlug(slug: string): ClientConfig | null {
  const entry = loadStore().find((item) => item.config.slug === slug);
  return entry?.config ?? null;
}

export function normalizeClientSlug(
  client: ClientConfig,
  otherSlugs: string[],
): ClientConfig {
  return {
    ...client,
    slug: ensureUniqueSlug(slugify(client.slug || client.name), otherSlugs),
  };
}

export function saveClientVersion(
  entries: ClientStoreEntry[],
  clientId: string,
  draft: ClientConfig,
): ClientStoreEntry[] {
  const MAX_VERSIONS = 40;

  return entries.map((entry) => {
    if (entry.config.id !== clientId) return entry;

    const otherSlugs = entries
      .filter((item) => item.config.id !== clientId)
      .map((item) => item.config.slug);
    const savedConfig = normalizeClientSlug(
      { ...draft, updatedAt: new Date().toISOString() },
      otherSlugs,
    );
    const nextVersions = [...entry.versions, createVersion(savedConfig)].slice(
      -MAX_VERSIONS,
    );

    return {
      config: savedConfig,
      versions: nextVersions,
    };
  });
}

export { cloneClient, createEmptyClient, createVersion };
