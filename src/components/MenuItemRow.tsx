import type { MenuItem } from "@/types/menu";
import {
  formatMenuDescription,
  shouldShowDietTags,
} from "@/lib/format-menu-text";
import { HeartIcon } from "@/components/HeartIcon";

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

        <div className="flex shrink-0 items-center gap-2">
          {price ? (
            <p className="whitespace-nowrap text-[0.95rem] font-bold text-[#141415]">
              {price}
            </p>
          ) : null}
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
                ? "bg-[#560200] text-[#f8a5b8]"
                : "bg-transparent text-[#141415] hover:bg-[#ececec]"
            }`}
          >
            <HeartIcon filled={favorite} />
          </button>
        </div>
      </div>
    </article>
  );
}
