import { menuCategories, restaurant } from "@/data/menu";
import { ALLERGENS } from "@/data/allergens";
import { UI_STRINGS_IT } from "@/lib/ui-strings";
import type { MenuCategory, RestaurantConfig } from "@/types/menu";
import type { Allergen } from "@/types/menu";
import type { TranslationBundle, UiStrings } from "@/types/translation";

export type TranslatedContent = {
  ui: UiStrings;
  restaurant: RestaurantConfig;
  categories: MenuCategory[];
  allergens: Allergen[];
};

export function getItalianContent(): TranslatedContent {
  return {
    ui: UI_STRINGS_IT,
    restaurant,
    categories: menuCategories,
    allergens: ALLERGENS,
  };
}

function applyBundleToBase(
  base: TranslatedContent,
  bundle: TranslationBundle,
): TranslatedContent {
  const ui = { ...base.ui, ...bundle.ui };

  const translatedRestaurant: RestaurantConfig = {
    ...base.restaurant,
    // Se lo slogan IT è vuoto, resta vuoto in tutte le lingue: non mostriamo
    // eventuali traduzioni "stale" rimaste nel bundle da quando esisteva.
    subtitle: base.restaurant.subtitle
      ? (bundle.restaurant.subtitle ?? base.restaurant.subtitle)
      : undefined,
    notes: bundle.restaurant.notes ?? base.restaurant.notes,
  };

  const translatedCategories = base.categories.map((category) => {
    const categoryTranslation = bundle.categories[category.id];
    return {
      ...category,
      name: categoryTranslation?.name ?? category.name,
      notes: categoryTranslation?.notes ?? category.notes,
      items: category.items.map((item) => {
        const itemTranslation = bundle.items[item.id];
        return {
          ...item,
          name: itemTranslation?.name ?? item.name,
          description: itemTranslation?.description ?? item.description,
          allergens: item.allergens?.map((allergen) => {
            const allergenTranslation = bundle.allergens[String(allergen.id)];
            if (!allergenTranslation) return allergen;
            return {
              ...allergen,
              name: allergenTranslation.name,
              description: allergenTranslation.description,
            };
          }),
        };
      }),
    };
  });

  const translatedAllergens = base.allergens.map((allergen) => {
    const allergenTranslation = bundle.allergens[String(allergen.id)];
    if (!allergenTranslation) return allergen;
    return {
      ...allergen,
      name: allergenTranslation.name,
      description: allergenTranslation.description,
    };
  });

  return {
    ui,
    restaurant: translatedRestaurant,
    categories: translatedCategories,
    allergens: translatedAllergens,
  };
}

export function applyTranslationToBase(
  base: TranslatedContent,
  bundle: TranslationBundle,
): TranslatedContent {
  return applyBundleToBase(base, bundle);
}

export function applyTranslation(bundle: TranslationBundle): TranslatedContent {
  return applyBundleToBase(getItalianContent(), bundle);
}
