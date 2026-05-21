"use client";

import { LanguageSelector } from "@/components/LanguageSelector";
import { HeartIcon } from "@/components/HeartIcon";
import { useLanguage } from "@/context/LanguageContext";

export const HEADER_BG = "#560200";
export const BRAND_ACCENT = "#f8a5b8";

type MenuHeaderProps = {
  favoritesCount: number;
  onOpenFavorites: () => void;
};

export function MenuHeader({
  favoritesCount,
  onOpenFavorites,
}: MenuHeaderProps) {
  const { content } = useLanguage();
  const { ui, restaurant } = content;

  return (
    <header
      className="relative z-30 overflow-visible px-5 pb-8 pt-6 text-white"
      style={{ backgroundColor: HEADER_BG }}
    >
      <div className="relative z-30 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <img
            src="/logo.svg"
            alt="aribrì"
            className="block h-9 w-auto max-w-[min(100%,190px)] object-contain object-left"
          />
        </div>

        <div className="relative z-40 flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label={ui.showFavorites}
            onClick={onOpenFavorites}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-colors"
          >
            <HeartIcon filled={favoritesCount > 0} />
            {favoritesCount > 0 ? (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.65rem] font-bold"
                style={{ backgroundColor: BRAND_ACCENT, color: HEADER_BG }}
              >
                {favoritesCount}
              </span>
            ) : null}
          </button>

          <LanguageSelector />
        </div>
      </div>

      {restaurant.subtitle ? (
        <p
          className="mt-3 whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.12em] sm:text-[0.72rem] sm:tracking-[0.28em]"
          style={{ color: BRAND_ACCENT }}
        >
          {restaurant.subtitle}
        </p>
      ) : null}
    </header>
  );
}
