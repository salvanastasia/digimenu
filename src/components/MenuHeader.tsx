"use client";

import { ClientLogo } from "@/components/ClientLogo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { HeartIcon } from "@/components/HeartIcon";
import { useClientMenu } from "@/context/ClientMenuContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  getEffectiveHeader,
  getHeaderBackgroundStyle,
  hasHeaderBackgroundImage,
} from "@/lib/client-header";
import { getMenuTheme, isFramedMenuTheme } from "@/lib/menu-theme";

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
  const isFramed = isFramedMenuTheme(getMenuTheme(clientMenu?.client));
  const effectiveHeader = clientMenu
    ? getEffectiveHeader(clientMenu.client)
    : null;

  const headerBg = effectiveHeader?.backgroundColor ?? HEADER_BG;
  const headerBackgroundStyle = effectiveHeader
    ? getHeaderBackgroundStyle(effectiveHeader)
    : { backgroundColor: headerBg };
  const accentColor = effectiveHeader?.fabBackground ?? BRAND_ACCENT;
  const primaryColor = clientMenu?.client.brand.primaryColor ?? HEADER_BG;
  const sloganColor =
    clientMenu?.client.brand.secondaryColor ?? BRAND_ACCENT;
  const badgeTextColor = effectiveHeader?.fabIconColor ?? HEADER_BG;
  const logoUrl = effectiveHeader?.logoUrl ?? "/logo.svg";
  const logoColor = effectiveHeader?.logoColor ?? BRAND_ACCENT;
  const logoAlt = clientMenu?.client.name ?? "aribrì";
  const showBackgroundOverlay = effectiveHeader
    ? hasHeaderBackgroundImage(effectiveHeader)
    : false;

  if (isFramed) {
    return (
      <header
        className="relative z-30 overflow-visible border-b-4 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#141415]"
        style={{
          backgroundColor: accentColor,
          borderColor: primaryColor,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: primaryColor }}
          aria-hidden="true"
        />
        <div className="relative z-20 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ClientLogo
              client={clientMenu?.client}
              logoUrl={logoUrl}
              logoColor={logoColor}
              alt={logoAlt}
            />
          </div>

          <div className="relative z-40 flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={ui.showFavorites}
              onClick={onOpenFavorites}
              className="relative flex h-11 w-11 items-center justify-center transition-colors"
              style={
                favoritesCount > 0
                  ? {
                      backgroundColor: `color-mix(in srgb, ${primaryColor} 5%, ${sloganColor})`,
                      color: primaryColor,
                    }
                  : { color: primaryColor }
              }
            >
              <HeartIcon filled={favoritesCount > 0} />
              {favoritesCount > 0 ? (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[0.65rem] font-bold leading-none tabular-nums"
                  style={{
                    backgroundColor: sloganColor,
                    color: primaryColor,
                    borderColor: primaryColor,
                  }}
                >
                  {favoritesCount}
                </span>
              ) : null}
            </button>

            <LanguageSelector tone="light" size="compact" />
          </div>
        </div>

        {restaurant.subtitle ? (
          <p
            className="relative z-0 mt-3 truncate whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.32em] sm:text-[0.7rem]"
            style={{ color: primaryColor }}
          >
            {restaurant.subtitle}
          </p>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className="relative z-30 overflow-visible px-5 pb-8 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] text-white"
      style={headerBackgroundStyle}
    >
      {showBackgroundOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-black/70"
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-20 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <ClientLogo
            client={clientMenu?.client}
            logoUrl={logoUrl}
            logoColor={logoColor}
            alt={logoAlt}
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
          className="relative z-0 mt-3 truncate whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.12em] sm:text-[0.72rem] sm:tracking-[0.28em]"
          style={{ color: sloganColor }}
        >
          {restaurant.subtitle}
        </p>
      ) : null}
    </header>
  );
}
