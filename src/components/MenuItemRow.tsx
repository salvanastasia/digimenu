"use client";

import type { MenuItem } from "@/types/menu";
import { HeartIcon } from "@/components/HeartIcon";
import { useClientMenu } from "@/context/ClientMenuContext";
import { getEffectiveHeader } from "@/lib/client-header";
import {
  formatMenuDescription,
  shouldShowDietTags,
} from "@/lib/format-menu-text";
import { getMenuTheme, isFramedMenuTheme } from "@/lib/menu-theme";

type MenuItemRowProps = {
  item: MenuItem;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  allergensLabel: string;
  veganTagLabel: string;
  vegetarianTagLabel: string;
  addFavoriteLabel: string;
  removeFavoriteLabel: string;
};

function formatPrice(item: MenuItem) {
  if (item.price == null) return null;

  const formatted = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: item.price % 1 === 0 ? 0 : 2,
  }).format(item.price);

  if (item.measureUnit) {
    return `${formatted} · ${item.measureUnit}`;
  }

  return formatted;
}

export function MenuItemRow({
  item,
  favorite,
  onToggleFavorite,
  allergensLabel,
  veganTagLabel,
  vegetarianTagLabel,
  addFavoriteLabel,
  removeFavoriteLabel,
}: MenuItemRowProps) {
  const clientMenu = useClientMenu();
  const isFramed = isFramedMenuTheme(getMenuTheme(clientMenu?.client));
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";
  const effectiveHeader = clientMenu
    ? getEffectiveHeader(clientMenu.client)
    : null;
  const fabBackground = effectiveHeader?.fabBackground ?? "#F2E8D8";
  const fabIconColor = effectiveHeader?.fabIconColor ?? "#560200";

  const price = formatPrice(item);
  const allergenIds =
    item.allergens?.map((allergen) => allergen.id).join(", ") ?? null;
  const showDietTags = shouldShowDietTags();
  const tagLabels = {
    vegan: veganTagLabel,
    vegetarian: vegetarianTagLabel,
  } as const;
  const description = item.description
    ? formatMenuDescription(item.description)
    : null;

  if (isFramed) {
    return (
      <article className="border-t border-[#141415] px-4 py-4 first:border-t-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[0.92rem] font-bold uppercase leading-snug tracking-[0.06em] text-[#141415]">
                {item.name}
              </p>
              {showDietTags
                ? item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="border px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.12em]"
                      style={{
                        borderColor: primaryColor,
                        color: primaryColor,
                      }}
                    >
                      {tagLabels[tag]}
                    </span>
                  ))
                : null}
            </div>
            {description ? (
              <p className="mt-2 text-[0.84rem] leading-relaxed text-[#404040]">
                {description}
              </p>
            ) : null}
            {allergenIds ? (
              <p className="mt-1.5 text-[0.68rem] uppercase tracking-[0.08em] text-[#808080]">
                {allergensLabel} {allergenIds}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-end self-stretch">
            <button
              type="button"
              aria-label={
                favorite
                  ? `${removeFavoriteLabel}: ${item.name}`
                  : `${addFavoriteLabel}: ${item.name}`
              }
              aria-pressed={favorite}
              onClick={() => onToggleFavorite(item.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center border-2 transition-colors"
              style={
                favorite
                  ? {
                      backgroundColor: fabBackground,
                      borderColor: fabBackground,
                      color: fabIconColor,
                    }
                  : {
                      borderColor: "#141415",
                      color: "#141415",
                    }
              }
            >
              <HeartIcon filled={favorite} />
            </button>
            {price ? (
              <p
                className="mt-auto whitespace-nowrap pt-3 text-[0.95rem] font-bold tabular-nums"
                style={{ color: primaryColor }}
              >
                {price}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border-t border-[#e4e4e4] px-4 py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[1rem] font-bold leading-snug text-[#141415]">
              {item.name}
            </p>
            {showDietTags
              ? item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]"
                    style={{
                      backgroundColor:
                        tag === "vegan"
                          ? "rgba(86,2,0,0.08)"
                          : "rgba(86,2,0,0.06)",
                      color: "#560200",
                    }}
                  >
                    {tagLabels[tag]}
                  </span>
                ))
              : null}
          </div>
          {description ? (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[#141415]">
              {description}
            </p>
          ) : null}
          {allergenIds ? (
            <p className="mt-1.5 text-[0.72rem] leading-snug text-[#a3a3a3]">
              {allergensLabel} {allergenIds}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end self-stretch">
          <button
            type="button"
            aria-label={
              favorite
                ? `${removeFavoriteLabel}: ${item.name}`
                : `${addFavoriteLabel}: ${item.name}`
            }
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(item.id)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              favorite
                ? "shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                : "bg-transparent text-[#141415] hover:bg-[#ececec]"
            }`}
            style={
              favorite
                ? { backgroundColor: fabBackground, color: fabIconColor }
                : undefined
            }
          >
            <HeartIcon filled={favorite} />
          </button>
          {price ? (
            <p className="mt-auto whitespace-nowrap pt-3 text-[0.95rem] font-bold tabular-nums text-[#141415]">
              {price}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
