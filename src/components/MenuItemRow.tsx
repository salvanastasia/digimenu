import type { MenuItem } from "@/types/menu";
import {
  formatMenuDescription,
  shouldShowDietTags,
} from "@/lib/format-menu-text";

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
