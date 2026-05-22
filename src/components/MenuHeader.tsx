"use client";

import { LanguageSelector } from "@/components/LanguageSelector";
import { HeartIcon } from "@/components/HeartIcon";
import { useClientMenu } from "@/context/ClientMenuContext";
import { useLanguage } from "@/context/LanguageContext";
import { getEffectiveHeader, getHeaderBackgroundStyle, hasHeaderBackgroundImage } from "@/lib/client-header";

export const HEADER_BG = "#560200";
export const BRAND_ACCENT = "#F2E8D8";

type MenuHeaderProps = {
  favoritesCount: number;
  onOpenFavorites: () => void;
};

export function MenuHeader({
  favoritesCount,
  onOpenFavorites,
}: MenuHeaderProps) {
  const { content } = useLanguage();
  const clientMenu = useClientMenu();
  const { ui, restaurant } = content;
  const effectiveHeader = clientMenu
    ? getEffectiveHeader(clientMenu.client)
    : null;

  const headerBg = effectiveHeader?.backgroundColor ?? HEADER_BG;
  const headerBackgroundStyle = effectiveHeader
    ? getHeaderBackgroundStyle(effectiveHeader)
    : { backgroundColor: headerBg };
  const accentColor = effectiveHeader?.fabBackground ?? BRAND_ACCENT;
  const sloganColor =
    clientMenu?.client.brand.secondaryColor ?? BRAND_ACCENT;
  const badgeTextColor = effectiveHeader?.fabIconColor ?? HEADER_BG;
  const logoUrl = effectiveHeader?.logoUrl ?? "/logo.svg";
  const logoAlt = clientMenu?.client.name ?? "aribrì";
  const showBackgroundOverlay = effectiveHeader
    ? hasHeaderBackgroundImage(effectiveHeader)
    : false;

  return (
    <header
      className="relative z-30 overflow-visible px-5 pb-8 pt-6 text-white"
      style={headerBackgroundStyle}
    >
      {showBackgroundOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-black/70"
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-30 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <img
            src={logoUrl}
            alt={logoAlt}
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
                style={{ backgroundColor: accentColor, color: badgeTextColor }}
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
          className="relative z-30 mt-3 truncate whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.12em] sm:text-[0.72rem] sm:tracking-[0.28em]"
          style={{ color: sloganColor }}
        >
          {restaurant.subtitle}
        </p>
      ) : null}
    </header>
  );
}
