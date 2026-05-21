"use client";

import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export const HEADER_BG = "#560200";
export const BRAND_ACCENT = "#f8a5b8";

type MenuHeaderProps = {
  favoritesMode: boolean;
  favoritesCount: number;
  onToggleFavoritesMode: () => void;
};

export function MenuHeader({
  favoritesMode,
  favoritesCount,
  onToggleFavoritesMode,
}: MenuHeaderProps) {
  const { content } = useLanguage();
  const { ui, restaurant } = content;

  return (
    <header
      className="relative z-30 overflow-visible px-5 pb-8 pt-6 text-white"
      style={{ backgroundColor: HEADER_BG }}
    >
      <div className="relative z-30 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <img
            src="/logo.png"
            alt="aribrì"
            className="block h-[72px] w-auto max-w-[min(100%,260px)] object-contain object-left"
          />
        </div>

        <div className="relative z-40 flex shrink-0 items-center gap-3 pt-1">
          <button
            type="button"
            aria-label={
              favoritesMode ? ui.showFullMenu : ui.showFavorites
            }
            aria-pressed={favoritesMode}
            onClick={onToggleFavoritesMode}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
            style={
              favoritesMode
                ? {
                    borderColor: BRAND_ACCENT,
                    backgroundColor: BRAND_ACCENT,
                    color: HEADER_BG,
                  }
                : {
                    borderColor: "rgba(255,255,255,0.7)",
                    backgroundColor: "transparent",
                    color: "white",
                  }
            }
          >
            <HeartIcon filled={favoritesMode} />
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

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 36}
    >
      <path d="M352 56h-1c-39.7 0-74.8 21-95 52-20.2-31-55.3-52-95-52h-1c-61.9.6-112 50.9-112 113 0 37 16.2 89.5 47.8 132.7C156 384 256 456 256 456s100-72 160.2-154.3C447.8 258.5 464 206 464 169c0-62.1-50.1-112.4-112-113zm41.6 229.2C351 343.5 286.1 397.3 256 420.8c-30.1-23.5-95-77.4-137.6-135.7C89.1 245.1 76 198 76 169c0-22.6 8.8-43.8 24.6-59.8 15.9-16 37-24.9 59.6-25.1H161.1c14.3 0 28.5 3.7 41.1 10.8 12.2 6.9 22.8 16.7 30.4 28.5 5.2 7.9 14 12.7 23.5 12.7s18.3-4.8 23.5-12.7c7.7-11.8 18.2-21.6 30.4-28.5 12.6-7.1 26.8-10.8 41.1-10.8h.9c22.5.2 43.7 9.1 59.6 25.1 15.9 16 24.6 37.3 24.6 59.8-.2 29-13.3 76.1-42.6 116.2z" />
    </svg>
  );
}
