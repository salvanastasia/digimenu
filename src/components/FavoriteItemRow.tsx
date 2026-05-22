"use client";

import { useState } from "react";
import type { MenuItem } from "@/types/menu";
import { formatMenuDescription } from "@/lib/format-menu-text";
import { QuantitySelector } from "@/components/QuantitySelector";

type FavoriteItemRowProps = {
  item: MenuItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  allergensLabel: string;
  decreaseQuantityLabel: string;
  increaseQuantityLabel: string;
  showQuantity?: boolean;
  showPrice?: boolean;
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

export function FavoriteItemRow({
  item,
  quantity,
  onQuantityChange,
  allergensLabel,
  decreaseQuantityLabel,
  increaseQuantityLabel,
  showQuantity = true,
  showPrice = true,
}: FavoriteItemRowProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const price = showPrice ? formatPrice(item) : null;
  const allergenIds =
    item.allergens?.map((allergen) => allergen.id).join(", ") ?? null;
  const description = item.description
    ? formatMenuDescription(item.description)
    : null;
  const hasDescription = Boolean(description);

  return (
    <article className="border-t border-[#e4e4e4] py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          className={`min-w-0 flex-1 text-left ${hasDescription ? "cursor-pointer" : "cursor-default"}`}
          aria-expanded={hasDescription ? descriptionOpen : undefined}
          onClick={() => {
            if (hasDescription) {
              setDescriptionOpen((open) => !open);
            }
          }}
        >
          <p className="text-[1rem] font-bold leading-snug text-[#141415]">
            {item.name}
          </p>
          {descriptionOpen && description ? (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[#555555]">
              {description}
            </p>
          ) : null}
          {allergenIds ? (
            <p className="mt-1.5 text-[0.72rem] leading-snug text-[#a3a3a3]">
              {allergensLabel} {allergenIds}
            </p>
          ) : null}
        </button>

        {showQuantity || price ? (
          <div className="flex shrink-0 flex-col items-end gap-2">
            {showQuantity ? (
              <QuantitySelector
                value={quantity}
                onChange={onQuantityChange}
                decreaseLabel={`${decreaseQuantityLabel}: ${item.name}`}
                increaseLabel={`${increaseQuantityLabel}: ${item.name}`}
              />
            ) : null}
            {price ? (
              <p className="whitespace-nowrap text-[0.95rem] font-bold text-[#141415]">
                {price}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
