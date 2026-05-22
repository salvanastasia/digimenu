import { SUBTITLE_MAX_LENGTH } from "@/lib/client-defaults";
import type {
  ClientConfig,
  ClientLocaleTranslation,
  TranslationSourceFingerprints,
} from "@/types/client";
import type { Locale } from "@/types/translation";

export type VariableTranslationSource = {
  categories: Record<string, { name: string }>;
  items: Record<string, { name: string; description?: string }>;
  restaurant?: { subtitle?: string };
};

export type OutdatedTranslationKey =
  | { kind: "subtitle" }
  | { kind: "category"; id: string }
  | { kind: "item"; id: string };

export type StaleLocaleSummary = {
  locale: Exclude<Locale, "it">;
  subtitle: number;
  categories: number;
  items: number;
  total: number;
};

export type StaleTranslationSummary = {
  locales: StaleLocaleSummary[];
  totalFields: number;
};

export function fingerprintField(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

function fingerprintItem(name: string, description: string): string {
  return fingerprintField(`${name}\n${description}`);
}

export function buildCurrentFingerprints(
  client: ClientConfig,
): TranslationSourceFingerprints {
  const categories: TranslationSourceFingerprints["categories"] = {};
  const items: TranslationSourceFingerprints["items"] = {};

  for (const category of client.categories) {
    if (!category.name.trim()) continue;
    categories[category.id] = fingerprintField(category.name);
  }

  for (const dish of client.dishes) {
    if (!dish.name.trim()) continue;
    items[dish.id] = fingerprintItem(dish.name, dish.description);
  }

  const subtitle = client.subtitle.trim().slice(0, SUBTITLE_MAX_LENGTH);

  return {
    categories,
    items,
    ...(subtitle ? { subtitle: fingerprintField(subtitle) } : {}),
  };
}

export function emptySourceFingerprints(): TranslationSourceFingerprints {
  return { categories: {}, items: {} };
}

/**
 * Bundle salvati prima di `sourceFingerprints`: se esistono traduzioni per
 * categorie/piatti ma manca l'impronta IT, assumiamo allineamento al testo IT
 * attuale (solo per quelle chiavi). Lo slogan non viene backfillato così resta
 * obsoleto se manca o se l'IT è cambiato dopo l'ultima traduzione.
 */
export function backfillLegacySourceFingerprints(
  client: ClientConfig,
  bundle: ClientLocaleTranslation,
): TranslationSourceFingerprints {
  const current = buildCurrentFingerprints(client);
  const existing = bundle.sourceFingerprints ?? emptySourceFingerprints();
  const categories = { ...existing.categories };
  const items = { ...existing.items };

  for (const id of Object.keys(bundle.categories)) {
    if (bundle.categories[id]?.name?.trim() && current.categories[id]) {
      categories[id] = current.categories[id];
    }
  }

  for (const id of Object.keys(bundle.items)) {
    if (bundle.items[id]?.name?.trim() && current.items[id]) {
      items[id] = current.items[id];
    }
  }

  return {
    categories,
    items,
    ...(existing.subtitle ? { subtitle: existing.subtitle } : {}),
  };
}

function bundleNeedsLegacyFingerprintBackfill(
  bundle: ClientLocaleTranslation,
): boolean {
  const fp = bundle.sourceFingerprints ?? emptySourceFingerprints();

  for (const id of Object.keys(bundle.categories)) {
    if (bundle.categories[id]?.name?.trim() && !fp.categories[id]) {
      return true;
    }
  }

  for (const id of Object.keys(bundle.items)) {
    if (bundle.items[id]?.name?.trim() && !fp.items[id]) {
      return true;
    }
  }

  return false;
}

export function normalizeLocaleTranslation(
  client: ClientConfig,
  bundle: ClientLocaleTranslation | undefined,
): ClientLocaleTranslation | undefined {
  if (!bundle) return undefined;

  const withFingerprints: ClientLocaleTranslation = {
    ...bundle,
    sourceFingerprints: bundle.sourceFingerprints ?? emptySourceFingerprints(),
  };

  if (!bundleNeedsLegacyFingerprintBackfill(withFingerprints)) {
    return withFingerprints;
  }

  return {
    ...withFingerprints,
    sourceFingerprints: backfillLegacySourceFingerprints(
      client,
      withFingerprints,
    ),
  };
}

export function migrateClientTranslations(
  client: ClientConfig,
): ClientConfig {
  if (!client.translations) return client;

  const translations = { ...client.translations };
  for (const locale of Object.keys(translations) as Array<Exclude<Locale, "it">>) {
    const bundle = translations[locale];
    if (!bundle) continue;
    translations[locale] = normalizeLocaleTranslation(client, bundle)!;
  }

  return { ...client, translations };
}

export function computeClientTranslationVersion(client: ClientConfig): string {
  const parts = [
    client.subtitle,
    client.categories.map((c) => `${c.id}:${c.name}`).join("|"),
    client.dishes
      .map((d) => `${d.id}:${d.name}:${d.description}`)
      .join("|"),
  ];
  let hash = 0;
  const text = parts.join("\n");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return `${client.categories.length}-${client.dishes.length}-${hash.toString(36)}`;
}

export function buildVariableTranslationSource(
  client: ClientConfig,
): VariableTranslationSource {
  const categories: VariableTranslationSource["categories"] = {};
  const items: VariableTranslationSource["items"] = {};

  for (const category of client.categories) {
    if (!category.name.trim()) continue;
    categories[category.id] = { name: category.name };
  }

  for (const dish of client.dishes) {
    if (!dish.name.trim()) continue;
    items[dish.id] = {
      name: dish.name,
      ...(dish.description.trim() ? { description: dish.description } : {}),
    };
  }

  const subtitle = client.subtitle.trim().slice(0, SUBTITLE_MAX_LENGTH);

  return {
    categories,
    items,
    ...(subtitle ? { restaurant: { subtitle } } : {}),
  };
}

export function isVariableSourceEmpty(source: VariableTranslationSource): boolean {
  return (
    Object.keys(source.categories).length === 0 &&
    Object.keys(source.items).length === 0 &&
    !source.restaurant?.subtitle
  );
}

export function getOutdatedKeys(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): OutdatedTranslationKey[] {
  const bundle = normalizeLocaleTranslation(client, client.translations?.[locale]);
  const current = buildCurrentFingerprints(client);
  const saved = bundle?.sourceFingerprints ?? emptySourceFingerprints();
  const keys: OutdatedTranslationKey[] = [];

  if (current.subtitle) {
    if (!saved.subtitle || saved.subtitle !== current.subtitle) {
      keys.push({ kind: "subtitle" });
    }
  }

  for (const [id, fp] of Object.entries(current.categories)) {
    if (saved.categories[id] !== fp) {
      keys.push({ kind: "category", id });
    }
  }

  for (const [id, fp] of Object.entries(current.items)) {
    if (saved.items[id] !== fp) {
      keys.push({ kind: "item", id });
    }
  }

  return keys;
}

export function buildIncrementalTranslationSource(
  client: ClientConfig,
  keys: OutdatedTranslationKey[],
): VariableTranslationSource {
  const full = buildVariableTranslationSource(client);
  const source: VariableTranslationSource = {
    categories: {},
    items: {},
  };

  for (const key of keys) {
    if (key.kind === "subtitle" && full.restaurant?.subtitle) {
      source.restaurant = { subtitle: full.restaurant.subtitle };
    }
    if (key.kind === "category" && full.categories[key.id]) {
      source.categories[key.id] = full.categories[key.id];
    }
    if (key.kind === "item" && full.items[key.id]) {
      source.items[key.id] = full.items[key.id];
    }
  }

  return source;
}

export function chunkLabelForSource(
  source: VariableTranslationSource,
  kind: TranslationChunkKind,
  itemIds?: string[],
): string {
  if (kind === "restaurant") return "Slogan";
  if (kind === "categories") {
    const count = Object.keys(source.categories).length;
    return count === 1 ? "Categoria" : `Categorie (${count})`;
  }
  if (itemIds?.length === 1) {
    const dish = clientDishNamePlaceholder(source, itemIds[0]);
    return dish ? `Piatto: ${dish}` : "Piatto";
  }
  const count = itemIds?.length ?? Object.keys(source.items).length;
  return count === 1 ? "Piatto" : `Piatti (${count})`;
}

function clientDishNamePlaceholder(
  source: VariableTranslationSource,
  id: string,
): string | undefined {
  return source.items[id]?.name;
}

export type TranslationChunkKind = "restaurant" | "categories" | "items";

export type TranslationChunk = {
  kind: TranslationChunkKind;
  label: string;
  data: Record<string, unknown>;
};

export function buildTranslationChunks(
  source: VariableTranslationSource,
  batchSize = 28,
): TranslationChunk[] {
  const chunks: TranslationChunk[] = [];

  if (source.restaurant?.subtitle) {
    chunks.push({
      kind: "restaurant",
      label: chunkLabelForSource(source, "restaurant"),
      data: { restaurant: source.restaurant },
    });
  }

  if (Object.keys(source.categories).length > 0) {
    chunks.push({
      kind: "categories",
      label: chunkLabelForSource(source, "categories"),
      data: { categories: source.categories },
    });
  }

  const itemEntries = Object.entries(source.items);
  for (let i = 0; i < itemEntries.length; i += batchSize) {
    const slice = Object.fromEntries(itemEntries.slice(i, i + batchSize));
    const ids = Object.keys(slice);
    const batchIndex = Math.floor(i / batchSize) + 1;
    const batchCount = Math.ceil(itemEntries.length / batchSize);
    chunks.push({
      kind: "items",
      label:
        batchCount > 1
          ? `Piatti (${batchIndex}/${batchCount})`
          : chunkLabelForSource(source, "items", ids),
      data: { items: slice },
    });
  }

  return chunks;
}

export function mergeVariableTranslationParts(
  version: string,
  parts: Array<Record<string, unknown>>,
  base?: ClientLocaleTranslation,
): ClientLocaleTranslation {
  const merged: ClientLocaleTranslation = {
    version,
    sourceFingerprints:
      base?.sourceFingerprints ?? emptySourceFingerprints(),
    categories: { ...base?.categories },
    items: { ...base?.items },
    restaurant: base?.restaurant ? { ...base.restaurant } : undefined,
  };

  for (const part of parts) {
    if (part.restaurant && typeof part.restaurant === "object") {
      merged.restaurant = {
        ...merged.restaurant,
        ...(part.restaurant as ClientLocaleTranslation["restaurant"]),
      };
    }
    if (part.categories && typeof part.categories === "object") {
      merged.categories = {
        ...merged.categories,
        ...(part.categories as ClientLocaleTranslation["categories"]),
      };
    }
    if (part.items && typeof part.items === "object") {
      merged.items = {
        ...merged.items,
        ...(part.items as ClientLocaleTranslation["items"]),
      };
    }
  }

  return merged;
}

export function mergeIncrementalTranslation(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
  existing: ClientLocaleTranslation | undefined,
  parts: Array<Record<string, unknown>>,
  keys: OutdatedTranslationKey[],
): ClientLocaleTranslation {
  const base = normalizeLocaleTranslation(client, existing);
  const currentFp = buildCurrentFingerprints(client);
  const merged = mergeVariableTranslationParts(
    computeClientTranslationVersion(client),
    parts,
    base,
  );

  const nextFp: TranslationSourceFingerprints = {
    ...(base?.sourceFingerprints ?? emptySourceFingerprints()),
  };

  for (const key of keys) {
    if (key.kind === "subtitle" && currentFp.subtitle) {
      nextFp.subtitle = currentFp.subtitle;
    }
    if (key.kind === "category" && currentFp.categories[key.id]) {
      nextFp.categories[key.id] = currentFp.categories[key.id];
    }
    if (key.kind === "item" && currentFp.items[key.id]) {
      nextFp.items[key.id] = currentFp.items[key.id];
    }
  }

  merged.sourceFingerprints = nextFp;

  const stillOutdated = getOutdatedKeys(
    {
      ...client,
      translations: {
        ...client.translations,
        [locale]: merged,
      },
    },
    locale,
  );

  if (stillOutdated.length === 0) {
    merged.version = computeClientTranslationVersion(client);
  } else if (base?.version) {
    merged.version = base.version;
  }

  return merged;
}

export function ensureLocaleTranslation(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): ClientConfig["translations"] {
  const existing = normalizeLocaleTranslation(client, client.translations?.[locale]);
  if (existing) {
    return client.translations;
  }

  return {
    ...client.translations,
    [locale]: {
      version: computeClientTranslationVersion(client),
      sourceFingerprints: emptySourceFingerprints(),
      categories: {},
      items: {},
    },
  };
}

export function hasFreshTranslation(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): boolean {
  const bundle = normalizeLocaleTranslation(client, client.translations?.[locale]);
  if (!bundle) return false;
  return getOutdatedKeys(client, locale).length === 0;
}

export function getStaleTranslationLocales(
  client: ClientConfig,
): Exclude<Locale, "it">[] {
  return client.header.languages
    .filter((locale): locale is Exclude<Locale, "it"> => locale !== "it")
    .filter((locale) => !hasFreshTranslation(client, locale));
}

export function getStaleTranslationSummary(
  client: ClientConfig,
): StaleTranslationSummary {
  const locales: StaleLocaleSummary[] = [];

  for (const locale of client.header.languages) {
    if (locale === "it") continue;
    const keys = getOutdatedKeys(client, locale);
    if (keys.length === 0) continue;

    let subtitle = 0;
    let categories = 0;
    let items = 0;

    for (const key of keys) {
      if (key.kind === "subtitle") subtitle += 1;
      if (key.kind === "category") categories += 1;
      if (key.kind === "item") items += 1;
    }

    locales.push({
      locale,
      subtitle,
      categories,
      items,
      total: keys.length,
    });
  }

  return {
    locales,
    totalFields: locales.reduce((sum, entry) => sum + entry.total, 0),
  };
}

export function formatStaleFieldsLabel(counts: {
  subtitle: number;
  categories: number;
  items: number;
}): string {
  const parts: string[] = [];
  if (counts.subtitle > 0) {
    parts.push(counts.subtitle === 1 ? "1 slogan" : `${counts.subtitle} slogan`);
  }
  if (counts.categories > 0) {
    parts.push(
      counts.categories === 1
        ? "1 categoria"
        : `${counts.categories} categorie`,
    );
  }
  if (counts.items > 0) {
    parts.push(
      counts.items === 1 ? "1 piatto" : `${counts.items} piatti`,
    );
  }
  return parts.join(", ");
}

export function getTotalOutdatedFieldCount(client: ClientConfig): number {
  return getStaleTranslationSummary(client).totalFields;
}
