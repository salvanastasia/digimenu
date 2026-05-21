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

export function applyTranslation(bundle: TranslationBundle): TranslatedContent {
  const ui = { ...UI_STRINGS_IT, ...bundle.ui };

  const translatedRestaurant: RestaurantConfig = {
    ...restaurant,
    subtitle: bundle.restaurant.subtitle ?? restaurant.subtitle,
    notes: bundle.restaurant.notes ?? restaurant.notes,
  };

  const translatedCategories = menuCategories.map((category) => {
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

  const translatedAllergens = ALLERGENS.map((allergen) => {
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
