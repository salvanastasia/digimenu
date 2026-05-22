"use client";

import type { MenuCategory } from "@/types/menu";
import type { FavoriteEntry } from "@/hooks/useFavorites";
import { FavoriteItemRow } from "@/components/FavoriteItemRow";

type FavoritesListProps = {
  emptyMessage: string;
  categories: MenuCategory[];
  favorites: FavoriteEntry[];
  onQuantityChange: (id: string, quantity: number) => void;
  allergensLabel: string;
  decreaseQuantityLabel: string;
  increaseQuantityLabel: string;
  showQuantity?: boolean;
  showPrices?: boolean;
  totalLabel?: string;
};

function formatTotal(amount: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function FavoritesList({
  emptyMessage,
  categories,
  favorites,
  onQuantityChange,
  allergensLabel,
  decreaseQuantityLabel,
  increaseQuantityLabel,
  showQuantity = true,
  showPrices = true,
  totalLabel,
}: FavoritesListProps) {
  const favoriteMap = new Map(favorites.map((entry) => [entry.id, entry.quantity]));

  const sections = categories
    .map((category) => ({
      category,
      items: category.items.filter((item) => favoriteMap.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const total = showPrices
    ? sections.reduce((sum, { items }) => {
        return (
          sum +
          items.reduce((sectionSum, item) => {
            const quantity = favoriteMap.get(item.id) ?? 1;
            return sectionSum + (item.price ?? 0) * quantity;
          }, 0)
        );
      }, 0)
    : 0;

  return (
    <div className="px-3 pb-4 pt-4">
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
                    showQuantity={showQuantity}
                    showPrice={showPrices}
                  />
                ))}
              </div>
            </section>
          ))}

          {showPrices && total > 0 && totalLabel ? (
            <div className="flex items-baseline justify-between gap-4 border-t border-[#141415] px-2 pt-4">
              <span className="text-[0.95rem] font-bold uppercase tracking-[0.08em] text-[#141415]">
                {totalLabel}
              </span>
              <span className="text-[0.95rem] font-bold tabular-nums text-[#141415]">
                {formatTotal(total)}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
