import { SUBTITLE_MAX_LENGTH } from "@/lib/client-defaults";
import type {
  ClientConfig,
  ClientLocaleTranslation,
} from "@/types/client";
import type { Locale } from "@/types/translation";

export type VariableTranslationSource = {
  categories: Record<string, { name: string }>;
  items: Record<string, { name: string; description?: string }>;
  restaurant?: { subtitle?: string };
};

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
      label: "Sottotitolo",
      data: { restaurant: source.restaurant },
    });
  }

  if (Object.keys(source.categories).length > 0) {
    chunks.push({
      kind: "categories",
      label: "Categorie menu",
      data: { categories: source.categories },
    });
  }

  const itemEntries = Object.entries(source.items);
  for (let i = 0; i < itemEntries.length; i += batchSize) {
    const slice = Object.fromEntries(itemEntries.slice(i, i + batchSize));
    const batchIndex = Math.floor(i / batchSize) + 1;
    const batchCount = Math.ceil(itemEntries.length / batchSize);
    chunks.push({
      kind: "items",
      label:
        batchCount > 1
          ? `Piatti (${batchIndex}/${batchCount})`
          : "Piatti",
      data: { items: slice },
    });
  }

  return chunks;
}

export function mergeVariableTranslationParts(
  version: string,
  parts: Array<Record<string, unknown>>,
): ClientLocaleTranslation {
  const merged: ClientLocaleTranslation = {
    version,
    categories: {},
    items: {},
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

export function ensureLocaleTranslation(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): ClientConfig["translations"] {
  const existing = client.translations?.[locale];
  if (existing) {
    return client.translations;
  }

  const version = computeClientTranslationVersion(client);
  return {
    ...client.translations,
    [locale]: {
      version,
      categories: {},
      items: {},
    },
  };
}

export function hasFreshTranslation(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): boolean {
  const bundle = client.translations?.[locale];
  if (!bundle) return false;
  return bundle.version === computeClientTranslationVersion(client);
}

export function getStaleTranslationLocales(
  client: ClientConfig,
): Exclude<Locale, "it">[] {
  return client.header.languages
    .filter((locale): locale is Exclude<Locale, "it"> => locale !== "it")
    .filter((locale) => !hasFreshTranslation(client, locale));
}
