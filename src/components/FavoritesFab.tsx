"use client";

import { HeartIcon } from "@/components/HeartIcon";
import { BRAND_ACCENT, HEADER_BG } from "@/components/MenuHeader";
import { useClientMenu } from "@/context/ClientMenuContext";
import { getEffectiveHeader } from "@/lib/client-header";

type FavoritesFabProps = {
  count: number;
  showFavoritesLabel: string;
  onClick: () => void;
};

export function FavoritesFab({
  count,
  showFavoritesLabel,
  onClick,
}: FavoritesFabProps) {
  const clientMenu = useClientMenu();
  const effectiveHeader = clientMenu
    ? getEffectiveHeader(clientMenu.client)
    : null;
  const fabBackground = effectiveHeader?.fabBackground ?? BRAND_ACCENT;
  const fabIconColor = effectiveHeader?.fabIconColor ?? HEADER_BG;

  if (count === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-22 z-40 flex justify-center">
      <div className="pointer-events-auto relative w-full max-w-[640px] px-5">
        <button
          type="button"
          aria-label={showFavoritesLabel}
          onClick={onClick}
          className="absolute right-5 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform active:scale-95"
          style={{ backgroundColor: fabBackground, color: fabIconColor }}
        >
          <HeartIcon filled className="h-6 w-6" />
          <span className="absolute -left-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[0.72rem] font-bold text-[#141415] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            {count}
          </span>
        </button>
      </div>
    </div>
  );
}
