import rawMenu from "@/data/menu.json";
import { allergenById } from "@/data/allergens";
import type { MenuCategory, MenuItem, RestaurantConfig } from "@/types/menu";

type RawMenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  measureUnit?: string;
  allergens?: number[];
  tags?: ("vegan" | "vegetarian")[];
};

type RawMenuCategory = {
  id: string;
  name: string;
  notes?: string;
  items: RawMenuItem[];
};

type RawMenuData = {
  restaurant: RestaurantConfig;
  categories: RawMenuCategory[];
};

const data = rawMenu as RawMenuData;

function mapItem(item: RawMenuItem): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    measureUnit: item.measureUnit,
    allergens: item.allergens?.length
      ? allergenById(item.allergens)
      : undefined,
    tags: item.tags,
  };
}

function mapCategory(category: RawMenuCategory): MenuCategory {
  return {
    id: category.id,
    name: category.name,
    notes: category.notes,
    items: category.items.map(mapItem),
  };
}

export const restaurant: RestaurantConfig = data.restaurant;
export const menuCategories: MenuCategory[] = data.categories.map(mapCategory);
