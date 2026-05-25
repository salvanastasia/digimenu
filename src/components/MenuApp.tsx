"use client";

import { useMemo, useState } from "react";
import { AllergenList } from "@/components/AllergenList";
import { FavoritesFab } from "@/components/FavoritesFab";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { FavoritesReceiptPanel } from "@/components/FavoritesReceiptPanel";
import { MenuCategoryAccordion } from "@/components/MenuCategoryAccordion";
import { MenuFooter } from "@/components/MenuFooter";
import { MenuHeader, HEADER_BG } from "@/components/MenuHeader";
import { ThemeColorSync } from "@/components/ThemeColorSync";
import { useClientMenu } from "@/context/ClientMenuContext";
import { useLanguage } from "@/context/LanguageContext";
import { getEffectiveHeader } from "@/lib/client-header";
import { useFavorites } from "@/hooks/useFavorites";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function MenuApp() {
  const { content, translationError } = useLanguage();
  const clientMenu = useClientMenu();
  const favoritesView =
    clientMenu?.client.customizations.favoritesView ?? "panel";
  const {
    favorites,
    totalQuantity,
    toggleFavorite,
    setQuantity,
    clearFavorites,
  } = useFavorites();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const favoriteSet = useMemo(
    () => new Set(favorites.map((entry) => entry.id)),
    [favorites],
  );
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

  const openFavorites = () => setFavoritesOpen(true);
  const closeFavorites = () => setFavoritesOpen(false);

  useLockBodyScroll(favoritesOpen);

  const statusBarColor = clientMenu
    ? getEffectiveHeader(clientMenu.client).backgroundColor
    : HEADER_BG;

  return (
    <>
      <ThemeColorSync color={statusBarColor} />
      <div className="mx-auto min-h-screen w-full max-w-[640px] bg-white shadow-none md:shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <MenuHeader
        favoritesCount={totalQuantity}
        onOpenFavorites={openFavorites}
      />

      <main
        className={`relative z-0 space-y-3 px-3 pt-3 ${totalQuantity > 0 ? "pb-24" : "pb-0"}`}
      >
        {translationError ? (
          <div className="rounded-[15px] bg-[#fff1f1] px-4 py-3 text-[0.88rem] text-[#8a1f1f]">
            {translationError}
          </div>
        ) : null}

        {categories.map((category) => (
          <MenuCategoryAccordion
            key={category.id}
            category={category}
            expanded={expandedCategories.has(category.id)}
            onToggle={toggleCategory}
            favoriteIds={favoriteSet}
            onToggleFavorite={toggleFavorite}
            allergensLabel={ui.allergensPresent}
            veganTagLabel={ui.veganTag}
            vegetarianTagLabel={ui.vegetarianTag}
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
      <MenuFooter restaurant={restaurant} ui={ui} />

      {!favoritesOpen ? (
        <FavoritesFab
          count={totalQuantity}
          showFavoritesLabel={ui.showFavorites}
          onClick={openFavorites}
        />
      ) : null}

      {favoritesView === "receipt" ? (
        <FavoritesReceiptPanel
          open={favoritesOpen}
          title={ui.yourListTitle}
          closeLabel={ui.showFullMenu}
          emptyMessage={ui.noFavorites}
          clearListLabel={ui.clearList}
          totalLabel={ui.listTotal}
          categories={categories}
          favorites={favorites}
          onClose={closeFavorites}
          onClearList={clearFavorites}
        />
      ) : (
        <FavoritesPanel
          open={favoritesOpen}
          title={ui.yourListTitle}
          closeLabel={ui.showFullMenu}
          emptyMessage={ui.noFavorites}
          clearListLabel={ui.clearList}
          totalLabel={ui.listTotal}
          categories={categories}
          favorites={favorites}
          onClose={closeFavorites}
          onQuantityChange={setQuantity}
          onClearList={clearFavorites}
          allergensLabel={ui.allergensPresent}
          decreaseQuantityLabel={ui.decreaseQuantity}
          increaseQuantityLabel={ui.increaseQuantity}
        />
      )}
    </div>
    </>
  );
}
