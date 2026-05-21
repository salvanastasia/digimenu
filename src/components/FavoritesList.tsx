"use client";

import { FavoriteItemRow } from "@/components/FavoriteItemRow";
import { useLanguage } from "@/context/LanguageContext";
import type { FavoriteEntry } from "@/hooks/useFavorites";
import type { MenuCategory } from "@/types/menu";

type FavoritesListProps = {
  emptyMessage: string;
  listTitle: string;
  totalLabel: string;
  categories: MenuCategory[];
  favorites: FavoriteEntry[];
};

function ReceiptRule() {
  return <div className="my-3 border-t border-dashed border-[#cfc7bc]" aria-hidden="true" />;
}

function ReceiptZigzag() {
  return (
    <svg
      viewBox="0 0 320 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute -bottom-[9px] left-0 h-[10px] w-full text-[#fffdf8]"
    >
      <path
        fill="currentColor"
        d="M0 0 H16 L32 10 H48 L64 0 H80 L96 10 H112 L128 0 H144 L160 10 H176 L192 0 H208 L224 10 H240 L256 0 H272 L288 10 H304 L320 0 V0 H0 Z"
      />
    </svg>
  );
}

function formatTotal(amount: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function FavoritesList({
  emptyMessage,
  listTitle,
  totalLabel,
  categories,
  favorites,
}: FavoritesListProps) {
  const { content, locale } = useLanguage();
  const { restaurant } = content;
  const favoriteMap = new Map(
    favorites.map((entry) => [entry.id, entry.quantity]),
  );

  const sections = categories
    .map((category) => ({
      category,
      items: category.items.filter((item) => favoriteMap.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const total = sections.reduce((sum, { items }) => {
    return (
      sum +
      items.reduce((sectionSum, item) => {
        const quantity = favoriteMap.get(item.id) ?? 1;
        return sectionSum + (item.price ?? 0) * quantity;
      }, 0)
    );
  }, 0);

  const timestamp = new Intl.DateTimeFormat(
    locale === "it" ? "it-IT" : locale,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date());

  if (sections.length === 0) {
    return (
      <div className="relative w-full max-w-[300px] bg-[#fffdf8] px-5 py-8 text-center font-mono text-[0.72rem] leading-relaxed text-[#606060] shadow-[0_10px_36px_rgba(0,0,0,0.16)]">
        {emptyMessage}
        <ReceiptZigzag />
      </div>
    );
  }

  return (
    <article className="relative w-full max-w-[300px] bg-[#fffdf8] px-5 py-6 font-mono text-[0.72rem] leading-relaxed text-[#1a1a1a] shadow-[0_10px_36px_rgba(0,0,0,0.16)]">
      <div className="text-center">
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          className="mx-auto h-7 w-auto max-w-[160px] object-contain"
        />
        <p className="mt-3 text-[0.82rem] font-bold uppercase tracking-[0.18em]">
          {restaurant.name}
        </p>
        {restaurant.subtitle ? (
          <p className="mt-1 text-[0.62rem] uppercase tracking-[0.08em] text-[#666]">
            {restaurant.subtitle}
          </p>
        ) : null}
      </div>

      <ReceiptRule />

      <div className="text-center">
        <p className="text-[0.78rem] font-bold uppercase tracking-[0.22em]">
          {listTitle}
        </p>
        <p className="mt-1 text-[0.62rem] text-[#666]">{timestamp}</p>
      </div>

      <ReceiptRule />

      <div className="space-y-4">
        {sections.map(({ category, items }) => (
          <section key={category.id}>
            <p className="text-center text-[0.68rem] font-bold uppercase tracking-[0.16em]">
              {category.name}
            </p>
            <div className="mt-2 space-y-0.5">
              {items.map((item) => (
                <FavoriteItemRow
                  key={item.id}
                  item={item}
                  quantity={favoriteMap.get(item.id) ?? 1}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {total > 0 ? (
        <>
          <ReceiptRule />
          <div className="flex items-baseline justify-between gap-3 text-[0.78rem] font-bold uppercase tracking-[0.08em]">
            <span>{totalLabel}</span>
            <span className="tabular-nums">{formatTotal(total)}</span>
          </div>
        </>
      ) : null}

      <ReceiptRule />

      <p className="text-center text-[0.62rem] uppercase tracking-[0.06em] text-[#666]">
        {restaurant.name}
      </p>

      <ReceiptZigzag />
    </article>
  );
}
