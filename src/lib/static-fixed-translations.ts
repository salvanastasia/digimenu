import { getStaticTranslation } from "@/data/translations";
import { formatTableServiceFee } from "@/lib/client-defaults";
import type { ClientConfig } from "@/types/client";
import type { Locale, TranslationBundle } from "@/types/translation";

export function getFixedTranslationParts(
  locale: Exclude<Locale, "it">,
  tableServiceFee?: string,
) {
  const bundle = getStaticTranslation(locale);

  return {
    ui: {
      ...bundle.ui,
      ...(tableServiceFee ? { tableServiceFee } : {}),
    },
    allergens: bundle.allergens,
    restaurantNotes: bundle.restaurant.notes,
    defaultSubtitle: bundle.restaurant.subtitle,
  };
}

export function buildClientTranslationBundle(
  client: ClientConfig,
  locale: Exclude<Locale, "it">,
): TranslationBundle | null {
  const variable = client.translations?.[locale];
  if (!variable) return null;

  const tableServiceFee =
    formatTableServiceFee(client.tableServiceFee) ?? undefined;
  const fixed = getFixedTranslationParts(locale, tableServiceFee);
  const translateDishNames =
    client.customizations.translateDishNames ??
    true;

  const items = Object.fromEntries(
    Object.entries(variable.items).map(([id, translation]) => {
      if (translateDishNames) {
        return [id, translation];
      }

      const italianName =
        client.dishes.find((dish) => dish.id === id)?.name ?? translation.name;

      return [id, { ...translation, name: italianName }];
    }),
  );

  return {
    version: variable.version,
    ui: fixed.ui,
    restaurant: {
      subtitle:
        variable.restaurant?.subtitle ??
        (client.subtitle.trim() || fixed.defaultSubtitle),
      notes: fixed.restaurantNotes,
    },
    categories: variable.categories,
    items,
    allergens: fixed.allergens,
  };
}
