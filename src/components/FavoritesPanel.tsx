"use client";

import { FavoritesList } from "@/components/FavoritesList";
import type { FavoriteEntry } from "@/hooks/useFavorites";
import type { MenuCategory } from "@/types/menu";

type FavoritesPanelProps = {
  open: boolean;
  title: string;
  closeLabel: string;
  emptyMessage: string;
  clearListLabel: string;
  totalLabel: string;
  categories: MenuCategory[];
  favorites: FavoriteEntry[];
  onClose: () => void;
  onClearList: () => void;
};

export function FavoritesPanel({
  open,
  title,
  closeLabel,
  emptyMessage,
  clearListLabel,
  totalLabel,
  categories,
  favorites,
  onClose,
  onClearList,
}: FavoritesPanelProps) {
  if (!open) {
    return null;
  }

  const hasItems = favorites.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 pt-16">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 bg-[#141415]/35"
      />

      <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center gap-4">
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute -top-2 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#141415] text-[1.1rem] leading-none text-[#f8a5b8] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
        >
          ×
        </button>

        <div className="max-h-[min(78vh,720px)] w-full overflow-y-auto overscroll-contain px-1 pb-2 pt-2">
          <div className="flex justify-center">
            <FavoritesList
              emptyMessage={emptyMessage}
              listTitle={title}
              totalLabel={totalLabel}
              categories={categories}
              favorites={favorites}
            />
          </div>
        </div>

        {hasItems ? (
          <button
            type="button"
            onClick={onClearList}
            className="rounded-full border border-[#560200] bg-white/95 px-5 py-2.5 text-[0.82rem] font-semibold text-[#560200] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#560200]/5"
          >
            {clearListLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
