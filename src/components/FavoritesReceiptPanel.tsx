"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FavoritesReceiptList } from "@/components/FavoritesReceiptList";
import { useClientMenu } from "@/context/ClientMenuContext";
import type { FavoriteEntry } from "@/hooks/useFavorites";
import type { MenuCategory } from "@/types/menu";

type FavoritesReceiptPanelProps = {
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

export function FavoritesReceiptPanel({
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
}: FavoritesReceiptPanelProps) {
  const clientMenu = useClientMenu();
  const accentColor = clientMenu?.client.brand.secondaryColor ?? "#F2E8D8";
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";
  const receiptRef = useRef<HTMLDivElement>(null);
  const [closePos, setClosePos] = useState<{ top: number; left: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!open) {
      setClosePos(null);
      return;
    }

    const update = () => {
      const el = receiptRef.current;
      if (!el) return;
      const { top, right } = el.getBoundingClientRect();
      setClosePos({ top, left: right });
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [open, favorites, categories]);

  if (!open) {
    return null;
  }

  const hasItems = favorites.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center px-4 pb-8 pt-16">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 touch-none bg-[#141415]/35"
      />

      {closePos ? (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="fixed z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-[#141415] text-[1.1rem] leading-none shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          style={{
            top: closePos.top,
            left: closePos.left,
            transform: "translate(-50%, -50%)",
            color: accentColor,
          }}
        >
          ×
        </button>
      ) : null}

      <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center gap-4">
        <div className="max-h-[min(78vh,720px)] w-full overflow-y-auto overscroll-contain px-1 pb-2 pt-2">
          <FavoritesReceiptList
            ref={receiptRef}
            emptyMessage={emptyMessage}
            listTitle={title}
            totalLabel={totalLabel}
            categories={categories}
            favorites={favorites}
          />
        </div>

        {hasItems ? (
          <button
            type="button"
            onClick={onClearList}
            className="rounded-full border bg-white/95 px-5 py-2.5 text-[0.82rem] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:opacity-90"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            {clearListLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
