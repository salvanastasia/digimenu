"use client";

import { useMemo, useState } from "react";
import { AllergenList } from "@/components/AllergenList";
import { MenuCategoryAccordion } from "@/components/MenuCategoryAccordion";
import { MenuFooter } from "@/components/MenuFooter";
import { MenuHeader } from "@/components/MenuHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";

export function MenuApp() {
  const { content, translationError } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [favoritesMode, setFavoritesMode] = useState(false);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const { ui, categories, restaurant } = content;

  const toggleCategory = (id: string) => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const visibleCategories = favoritesMode
    ? categories.filter((category) =>
        category.items.some((item) => favoriteSet.has(item.id)),
      )
    : categories;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[640px] bg-white shadow-none md:shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <MenuHeader
        favoritesMode={favoritesMode}
        favoritesCount={favorites.length}
        onToggleFavoritesMode={() => setFavoritesMode((value) => !value)}
      />

      <main className="relative z-0 space-y-3 px-3 pb-6 pt-3">
        {translationError ? (
          <div className="rounded-[15px] bg-[#fff1f1] px-4 py-3 text-[0.88rem] text-[#8a1f1f]">
            {translationError}
          </div>
        ) : null}

        {favoritesMode && visibleCategories.length === 0 ? (
          <div className="rounded-[15px] bg-[#eef0f1] px-5 py-8 text-center text-[0.95rem] text-[#606060]">
            {ui.noFavorites}
          </div>
        ) : null}

        {visibleCategories.map((category) => (
          <MenuCategoryAccordion
            key={category.id}
            category={category}
            expanded={
              favoritesMode ? true : expandedCategories.has(category.id)
            }
            onToggle={toggleCategory}
            favoriteIds={favoriteSet}
            onToggleFavorite={toggleFavorite}
            visibleItemIds={favoritesMode ? favoriteSet : null}
            allergensLabel={ui.allergensPresent}
            addFavoriteLabel={ui.addFavorite}
            removeFavoriteLabel={ui.removeFavorite}
          />
        ))}
      </main>

      {restaurant.showAllergens ? (
        <AllergenList
          allergens={content.allergens}
          title={ui.allergenListTitle}
        />
      ) : null}
      <MenuFooter restaurant={restaurant} />
    </div>
  );
}
