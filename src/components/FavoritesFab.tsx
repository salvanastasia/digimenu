"use client";

import { BRAND_ACCENT, HEADER_BG } from "@/components/MenuHeader";

type FavoritesFabProps = {
  count: number;
  active: boolean;
  showFavoritesLabel: string;
  showFullMenuLabel: string;
  onClick: () => void;
};

export function FavoritesFab({
  count,
  active,
  showFavoritesLabel,
  showFullMenuLabel,
  onClick,
}: FavoritesFabProps) {
  if (count === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-22 z-50 flex justify-center">
      <div className="pointer-events-auto relative w-full max-w-[640px] px-5">
        <button
          type="button"
          aria-label={active ? showFullMenuLabel : showFavoritesLabel}
          aria-pressed={active}
          onClick={onClick}
          className="absolute right-5 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform active:scale-95"
          style={{ backgroundColor: BRAND_ACCENT, color: HEADER_BG }}
        >
          <HeartIcon filled={active} />
          <span className="absolute -left-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[0.72rem] font-bold text-[#141415] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            {count}
          </span>
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      className="h-6 w-6"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 36}
    >
      <path d="M352 56h-1c-39.7 0-74.8 21-95 52-20.2-31-55.3-52-95-52h-1c-61.9.6-112 50.9-112 113 0 37 16.2 89.5 47.8 132.7C156 384 256 456 256 456s100-72 160.2-154.3C447.8 258.5 464 206 464 169c0-62.1-50.1-112.4-112-113zm41.6 229.2C351 343.5 286.1 397.3 256 420.8c-30.1-23.5-95-77.4-137.6-135.7C89.1 245.1 76 198 76 169c0-22.6 8.8-43.8 24.6-59.8 15.9-16 37-24.9 59.6-25.1H161.1c14.3 0 28.5 3.7 41.1 10.8 12.2 6.9 22.8 16.7 30.4 28.5 5.2 7.9 14 12.7 23.5 12.7s18.3-4.8 23.5-12.7c7.7-11.8 18.2-21.6 30.4-28.5 12.6-7.1 26.8-10.8 41.1-10.8h.9c22.5.2 43.7 9.1 59.6 25.1 15.9 16 24.6 37.3 24.6 59.8-.2 29-13.3 76.1-42.6 116.2z" />
    </svg>
  );
}
