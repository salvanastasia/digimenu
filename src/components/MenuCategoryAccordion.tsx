"use client";

import type { MenuCategory } from "@/types/menu";
import { MenuItemRow } from "@/components/MenuItemRow";
import { useClientMenu } from "@/context/ClientMenuContext";
import { getMenuTheme, getAccordionHeaderBackground, isFramedMenuTheme, isMenuZebraRowsEnabled } from "@/lib/menu-theme";

type MenuCategoryAccordionProps = {
  category: MenuCategory;
  categoryIndex: number;
  expanded: boolean;
  onToggle: (id: string) => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  allergensLabel: string;
  veganTagLabel: string;
  vegetarianTagLabel: string;
  addFavoriteLabel: string;
  removeFavoriteLabel: string;
};

export function MenuCategoryAccordion({
  category,
  categoryIndex,
  expanded,
  onToggle,
  favoriteIds,
  onToggleFavorite,
  allergensLabel,
  veganTagLabel,
  vegetarianTagLabel,
  addFavoriteLabel,
  removeFavoriteLabel,
}: MenuCategoryAccordionProps) {
  const clientMenu = useClientMenu();
  const isFramed = isFramedMenuTheme(getMenuTheme(clientMenu?.client));
  const menuZebraRows = isMenuZebraRowsEnabled(clientMenu?.client);
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";
  const secondaryColor = clientMenu?.client.brand.secondaryColor ?? "#F2E8D8";
  const headerBackground = getAccordionHeaderBackground({
    expanded,
    zebraEnabled: menuZebraRows,
    categoryIndex,
    primaryColor,
    secondaryColor,
  });
  const panelId = `panel-${category.id}`;
  const buttonId = `button-${category.id}`;

  if (isFramed) {
    return (
      <section className="border-b border-[#141415]/15">
        <button
          id={buttonId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(category.id)}
          className={`flex w-full items-center gap-2 px-4 py-3.5 text-left text-[#141415] transition-colors ${
            headerBackground ? "" : "bg-white hover:bg-[#fafafa]"
          }`}
          style={
            headerBackground
              ? { backgroundColor: headerBackground }
              : undefined
          }
        >
          <span
            className="flex shrink-0 items-center gap-1 font-mono text-[0.72rem] font-bold leading-none"
            aria-hidden="true"
          >
            <span>[</span>
            <span className="flex h-2.5 w-2.5 items-center justify-center">
              {expanded ? (
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              ) : (
                <span>○</span>
              )}
            </span>
            <span>]</span>
          </span>

          <span
            className="shrink-0 text-[0.78rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: primaryColor }}
          >
            {category.name}
          </span>

          <span className="min-w-0 flex-1" aria-hidden="true" />

          <span
            className="shrink-0 text-[1rem] font-bold leading-none tabular-nums"
            style={{ color: primaryColor }}
          >
            {expanded ? "−" : "+"}
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          hidden={!expanded}
          className={expanded ? "block bg-white" : "hidden"}
        >
          {category.notes ? (
            <div
              className="border-b border-[#141415] px-4 py-3 text-[0.78rem] uppercase leading-relaxed tracking-[0.04em] text-[#606060]"
              dangerouslySetInnerHTML={{ __html: category.notes }}
            />
          ) : null}

          <div>
            {category.items.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                favorite={favoriteIds.has(item.id)}
                onToggleFavorite={onToggleFavorite}
                allergensLabel={allergensLabel}
                veganTagLabel={veganTagLabel}
                vegetarianTagLabel={vegetarianTagLabel}
                addFavoriteLabel={addFavoriteLabel}
                removeFavoriteLabel={removeFavoriteLabel}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[15px] bg-[#eef0f1]">
      <button
        id={buttonId}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(category.id)}
        className="flex w-full items-center justify-between px-[15px] py-[18px] text-left transition-colors"
        style={
          headerBackground
            ? { backgroundColor: headerBackground }
            : undefined
        }
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
          {category.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              favorite={favoriteIds.has(item.id)}
              onToggleFavorite={onToggleFavorite}
              allergensLabel={allergensLabel}
              veganTagLabel={veganTagLabel}
              vegetarianTagLabel={vegetarianTagLabel}
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
