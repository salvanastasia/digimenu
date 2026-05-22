"use client";

import { FavoritesList } from "@/components/FavoritesList";
import { useClientMenu } from "@/context/ClientMenuContext";
import { getEffectiveHeader } from "@/lib/client-header";
import { BRAND_ACCENT } from "@/components/MenuHeader";
import type { MenuCategory } from "@/types/menu";
import type { FavoriteEntry } from "@/hooks/useFavorites";

type FavoritesPanelProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  emptyMessage: string;
  clearListLabel: string;
  categories: MenuCategory[];
  favorites: FavoriteEntry[];
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onClearList: () => void;
  allergensLabel: string;
  decreaseQuantityLabel: string;
  increaseQuantityLabel: string;
  totalLabel: string;
};

export function FavoritesPanel({
  open,
  title,
  closeLabel,
  emptyMessage,
  clearListLabel,
  categories,
  favorites,
  onClose,
  onQuantityChange,
  onClearList,
  allergensLabel,
  decreaseQuantityLabel,
  increaseQuantityLabel,
  totalLabel,
}: FavoritesPanelProps) {
  const clientMenu = useClientMenu();
  const effectiveHeader = clientMenu
    ? getEffectiveHeader(clientMenu.client)
    : null;
  const barColor = effectiveHeader?.fabBackground ?? BRAND_ACCENT;
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";
  const fontFamily = clientMenu?.client.brand.fontFamily;
  const hasItems = favorites.length > 0;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 bg-[#141415]/25"
      />

      <div
        className="relative z-10 flex max-h-[min(92vh,920px)] w-full max-w-[640px] flex-col overflow-hidden rounded-t-[22px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)]"
        style={fontFamily ? { fontFamily } : undefined}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-4 px-5 py-4"
          style={{ backgroundColor: barColor }}
        >
          <h2 className="text-[1.2rem] font-bold text-[#141415]">{title}</h2>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#141415] text-[1.1rem] leading-none"
            style={{ color: barColor }}
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <FavoritesList
            emptyMessage={emptyMessage}
            categories={categories}
            favorites={favorites}
            onQuantityChange={onQuantityChange}
            allergensLabel={allergensLabel}
            decreaseQuantityLabel={decreaseQuantityLabel}
            increaseQuantityLabel={increaseQuantityLabel}
            showQuantity={
              clientMenu?.client.customizations.showFavoritesQuantity ?? true
            }
            showPrices={
              clientMenu?.client.customizations.showFavoritesPrices ?? true
            }
            totalLabel={totalLabel}
          />
        </div>

        {hasItems ? (
          <div className="shrink-0 border-t border-[#e4e4e4] px-4 py-4">
            <button
              type="button"
              onClick={onClearList}
              className="mx-auto block w-full max-w-[280px] rounded-full border bg-white px-5 py-2.5 text-[0.82rem] font-semibold transition-colors hover:opacity-90"
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                fontFamily,
              }}
            >
              {clearListLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
