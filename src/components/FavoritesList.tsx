"use client";

import type { MenuCategory } from "@/types/menu";
import type { FavoriteEntry } from "@/hooks/useFavorites";
import { FavoriteItemRow } from "@/components/FavoriteItemRow";

type FavoritesListProps = {
  emptyMessage: string;
  clearListLabel: string;
  categories: MenuCategory[];
  favorites: FavoriteEntry[];
  onQuantityChange: (id: string, quantity: number) => void;
  onClearList: () => void;
  allergensLabel: string;
  decreaseQuantityLabel: string;
  increaseQuantityLabel: string;
};

export function FavoritesList({
  emptyMessage,
  clearListLabel,
  categories,
  favorites,
  onQuantityChange,
  onClearList,
  allergensLabel,
  decreaseQuantityLabel,
  increaseQuantityLabel,
}: FavoritesListProps) {
  const favoriteMap = new Map(favorites.map((entry) => [entry.id, entry.quantity]));

  const sections = categories
    .map((category) => ({
      category,
      items: category.items.filter((item) => favoriteMap.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="px-3 pb-8 pt-4">
      {sections.length === 0 ? (
        <p className="rounded-[15px] bg-[#eef0f1] px-5 py-8 text-center text-[0.95rem] text-[#606060]">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-6">
          {sections.map(({ category, items }) => (
            <section key={category.id}>
              <h3 className="px-2 text-[0.95rem] font-bold uppercase tracking-[0.12em] text-[#141415]">
                {category.name}
              </h3>
              <div className="mt-3 border-t border-[#141415]" />
              <div className="overflow-hidden rounded-[15px] bg-white">
                {items.map((item) => (
                  <FavoriteItemRow
                    key={item.id}
                    item={item}
                    quantity={favoriteMap.get(item.id) ?? 1}
                    onQuantityChange={(quantity) =>
                      onQuantityChange(item.id, quantity)
                    }
                    allergensLabel={allergensLabel}
                    decreaseQuantityLabel={decreaseQuantityLabel}
                    increaseQuantityLabel={increaseQuantityLabel}
                  />
                ))}
              </div>
            </section>
          ))}

          <button
            type="button"
            onClick={onClearList}
            className="mx-auto block w-full max-w-[280px] rounded-full border border-[#560200] px-5 py-3 text-[0.92rem] font-semibold text-[#560200] transition-colors hover:bg-[#560200]/5"
          >
            {clearListLabel}
          </button>
        </div>
      )}
    </div>
  );
}
