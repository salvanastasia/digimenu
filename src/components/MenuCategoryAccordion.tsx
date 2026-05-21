"use client";

import type { MenuCategory } from "@/types/menu";
import { MenuItemRow } from "@/components/MenuItemRow";

type MenuCategoryAccordionProps = {
  category: MenuCategory;
  expanded: boolean;
  onToggle: (id: string) => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  visibleItemIds?: Set<string> | null;
  allergensLabel: string;
  addFavoriteLabel: string;
  removeFavoriteLabel: string;
};

export function MenuCategoryAccordion({
  category,
  expanded,
  onToggle,
  favoriteIds,
  onToggleFavorite,
  visibleItemIds = null,
  allergensLabel,
  addFavoriteLabel,
  removeFavoriteLabel,
}: MenuCategoryAccordionProps) {
  const items = visibleItemIds
    ? category.items.filter((item) => visibleItemIds.has(item.id))
    : category.items;

  if (visibleItemIds && items.length === 0) {
    return null;
  }

  const panelId = `panel-${category.id}`;
  const buttonId = `button-${category.id}`;

  return (
    <section className="overflow-hidden rounded-[15px] bg-[#eef0f1]">
      <button
        id={buttonId}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(category.id)}
        className="flex w-full items-center justify-between px-[15px] py-[18px] text-left"
      >
        <span className="text-[1rem] font-bold text-[#141415]">
          {category.name}
        </span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#141415] transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <ChevronIcon />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!expanded}
        className={expanded ? "block" : "hidden"}
      >
        {category.notes ? (
          <div
            className="border-t border-[#d8dadc] px-4 py-3 text-[0.82rem] leading-relaxed text-[#606060]"
            dangerouslySetInnerHTML={{ __html: category.notes }}
          />
        ) : null}

        <div className="border-t border-[#d8dadc] bg-white">
          {items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              favorite={favoriteIds.has(item.id)}
              onToggleFavorite={onToggleFavorite}
              allergensLabel={allergensLabel}
              addFavoriteLabel={addFavoriteLabel}
              removeFavoriteLabel={removeFavoriteLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
