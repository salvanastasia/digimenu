import { SUBTITLE_MAX_LENGTH } from "@/lib/client-defaults";
import { ensureLocaleTranslation } from "@/lib/client-translation-payload";
import type { ClientConfig, ClientLocaleTranslation } from "@/types/client";
import type { Locale } from "@/types/translation";

export function getCategoryName(
  client: ClientConfig,
  locale: Locale,
  categoryId: string,
): string {
  if (locale === "it") {
    return client.categories.find((c) => c.id === categoryId)?.name ?? "";
  }
  return client.translations?.[locale]?.categories[categoryId]?.name ?? "";
}

export function getCategoryNamePlaceholder(
  client: ClientConfig,
  categoryId: string,
): string {
  return client.categories.find((c) => c.id === categoryId)?.name ?? "";
}

export function setCategoryName(
  client: ClientConfig,
  locale: Locale,
  categoryId: string,
  name: string,
): ClientConfig {
  if (locale === "it") {
    return {
      ...client,
      categories: client.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
      ),
    };
  }

  const translations = ensureLocaleTranslation(client, locale);
  return {
    ...client,
    translations: patchTranslationEntry(
      translations,
      locale,
      (entry) => ({
        ...entry,
        categories: {
          ...entry.categories,
          [categoryId]: { name },
        },
      }),
    ),
  };
}

export function getDishField(
  client: ClientConfig,
  locale: Locale,
  dishId: string,
  field: "name" | "description",
): string {
  if (locale === "it") {
    const dish = client.dishes.find((d) => d.id === dishId);
    return dish?.[field] ?? "";
  }
  const item = client.translations?.[locale]?.items[dishId];
  if (!item) return "";
  return field === "name" ? item.name : (item.description ?? "");
}

export function getDishFieldPlaceholder(
  client: ClientConfig,
  dishId: string,
  field: "name" | "description",
): string {
  return client.dishes.find((d) => d.id === dishId)?.[field] ?? "";
}

export function setDishField(
  client: ClientConfig,
  locale: Locale,
  dishId: string,
  field: "name" | "description",
  value: string,
): ClientConfig {
  if (locale === "it") {
    return {
      ...client,
      dishes: client.dishes.map((dish) =>
        dish.id === dishId ? { ...dish, [field]: value } : dish,
      ),
    };
  }

  const translations = ensureLocaleTranslation(client, locale);
  const existing = translations?.[locale]?.items[dishId] ?? { name: "" };

  return {
    ...client,
    translations: patchTranslationEntry(translations, locale, (entry) => {
      const nextItem = {
        ...existing,
        name: field === "name" ? value : existing.name,
        ...(field === "description"
          ? { description: value || undefined }
          : existing.description
            ? { description: existing.description }
            : {}),
      };
      return {
        ...entry,
        items: {
          ...entry.items,
          [dishId]: nextItem,
        },
      };
    }),
  };
}

export function getSubtitle(client: ClientConfig, locale: Locale): string {
  if (locale === "it") {
    return client.subtitle;
  }
  return client.translations?.[locale]?.restaurant?.subtitle ?? "";
}

export function getSubtitlePlaceholder(client: ClientConfig): string {
  return client.subtitle;
}

export function setSubtitle(
  client: ClientConfig,
  locale: Locale,
  value: string,
): ClientConfig {
  const trimmed = value.slice(0, SUBTITLE_MAX_LENGTH);

  if (locale === "it") {
    return { ...client, subtitle: trimmed };
  }

  const translations = ensureLocaleTranslation(client, locale);
  return {
    ...client,
    translations: patchTranslationEntry(translations, locale, (entry) => ({
      ...entry,
      restaurant: {
        ...entry.restaurant,
        subtitle: trimmed || undefined,
      },
    })),
  };
}

function patchTranslationEntry(
  translations: ClientConfig["translations"],
  locale: Exclude<Locale, "it">,
  patch: (entry: ClientLocaleTranslation) => ClientLocaleTranslation,
): ClientConfig["translations"] {
  const entry = translations?.[locale];
  if (!entry) return translations;
  return {
    ...translations,
    [locale]: patch(entry),
  };
}
