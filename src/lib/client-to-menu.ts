import rawMenu from "@/data/menu.json";
import { ALLERGENS, allergenById } from "@/data/allergens";
import {
  formatTableServiceFee,
  SUBTITLE_MAX_LENGTH,
} from "@/lib/client-defaults";
import { UI_STRINGS_IT } from "@/lib/ui-strings";
import type { TranslatedContent } from "@/lib/apply-translation";
import type { ClientConfig } from "@/types/client";
import type { MenuCategory } from "@/types/menu";

export function clientToMenuContent(client: ClientConfig): TranslatedContent {
  const categories: MenuCategory[] = client.categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      items: client.dishes
        .filter(
          (dish) => dish.categoryId === category.id && dish.name.trim().length > 0,
        )
        .map((dish) => ({
          id: dish.id,
          name: dish.name,
          description: dish.description || undefined,
          price: dish.price ?? undefined,
          allergens:
            dish.allergenIds.length > 0
              ? allergenById(dish.allergenIds)
              : undefined,
        })),
    }))
    .filter((category) => category.items.length > 0);

  const tableServiceFee =
    formatTableServiceFee(client.tableServiceFee) ?? UI_STRINGS_IT.tableServiceFee;

  return {
    ui: {
      ...UI_STRINGS_IT,
      tableServiceFee,
    },
    restaurant: {
      ...rawMenu.restaurant,
      name: client.name,
      subtitle: client.subtitle.trim().slice(0, SUBTITLE_MAX_LENGTH) || undefined,
      address: client.address.trim() || undefined,
      phone: client.phone.trim() || undefined,
    },
    categories,
    allergens: ALLERGENS,
  };
}
