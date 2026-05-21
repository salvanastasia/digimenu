export type Locale = "it" | "en" | "fr" | "de" | "es";

export type UiStrings = {
  allergenListTitle: string;
  allergensPresent: string;
  noFavorites: string;
  showFavorites: string;
  showFullMenu: string;
  translationError: string;
  addFavorite: string;
  removeFavorite: string;
  selectLanguage: string;
  tableServiceFee: string;
  frozenProductNote: string;
  treesSavedLabel: string;
  oxygenProducedLabel: string;
  veganTag: string;
  vegetarianTag: string;
  yourListTitle: string;
  clearList: string;
  decreaseQuantity: string;
  increaseQuantity: string;
};

export type TranslationPayload = {
  version: string;
  ui: UiStrings;
  restaurant: {
    subtitle?: string;
    notes?: string;
  };
  categories: Record<string, { name: string; notes?: string }>;
  items: Record<string, { name: string; description?: string }>;
  allergens: Record<string, { name: string; description: string }>;
};

export type TranslationBundle = TranslationPayload;
