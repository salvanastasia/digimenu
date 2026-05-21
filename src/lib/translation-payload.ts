import rawMenu from "@/data/menu.json";
import { ALLERGENS } from "@/data/allergens";
import { UI_STRINGS_IT } from "@/lib/ui-strings";
import type { TranslationPayload } from "@/types/translation";

type RawMenuData = {
  restaurant: {
    subtitle?: string;
    notes?: string;
  };
  categories: Array<{
    id: string;
    name: string;
    notes?: string;
    items: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
  }>;
};

const menuData = rawMenu as RawMenuData;

export const MENU_TRANSLATION_VERSION = `${menuData.categories.length}-${menuData.categories.reduce((total, category) => total + category.items.length, 0)}`;

export function buildTranslationPayload(): TranslationPayload {
  const categories: TranslationPayload["categories"] = {};
  const items: TranslationPayload["items"] = {};

  for (const category of menuData.categories) {
    categories[category.id] = {
      name: category.name,
      ...(category.notes ? { notes: category.notes } : {}),
    };

    for (const item of category.items) {
      items[item.id] = {
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      };
    }
  }

  const allergens: TranslationPayload["allergens"] = {};
  for (const allergen of ALLERGENS) {
    allergens[String(allergen.id)] = {
      name: allergen.name,
      description: allergen.description,
    };
  }

  return {
    version: MENU_TRANSLATION_VERSION,
    ui: UI_STRINGS_IT,
    restaurant: {
      subtitle: menuData.restaurant.subtitle,
      notes: menuData.restaurant.notes,
    },
    categories,
    items,
    allergens,
  };
}
