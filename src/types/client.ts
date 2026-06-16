import type { Locale } from "@/types/translation";

export type HeaderBackgroundMode = "color" | "image";

export type HeaderColorKey =
  | "logoColor"
  | "backgroundColor"
  | "fabBackground"
  | "fabIconColor";

export type HeaderColorOverrides = Partial<
  Record<HeaderColorKey, string>
>;

export type ClientBrand = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

export type ClientHeader = {
  logoUrl: string;
  backgroundMode: HeaderBackgroundMode;
  backgroundImageUrl: string;
  languages: Locale[];
  colorOverrides: HeaderColorOverrides;
};

export type ClientCategory = {
  id: string;
  name: string;
  /** Se true la categoria non è visibile nel menu pubblico (default: pubblica). */
  hidden?: boolean;
};

export type ClientDish = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number | null;
  allergenIds: number[];
};

export type FavoritesViewMode = "panel" | "receipt";

export type MenuTheme = "classic" | "framed" | "framed-big";

export type ClientWifiAccess = {
  enabled: boolean;
  ssid: string;
  password: string;
};

export type ClientCustomizations = {
  /** Layout e stile del menu pubblico. */
  menuTheme: MenuTheme;
  favoritesView: FavoritesViewMode;
  /** Traduce il nome piatto nelle lingue estere. */
  translateDishNames: boolean;
  /** Selettore quantità nel pannello preferiti. */
  showFavoritesQuantity: boolean;
  /** Prezzi nel pannello e nello scontrino preferiti. */
  showFavoritesPrices: boolean;
  /** Banner Wi-Fi nel menu pubblico. */
  wifiAccess: ClientWifiAccess;
  /** Alternanza colori sulle voci menu (accordion header). */
  menuZebraRows: boolean;
};

/** Impronte del testo italiano all'ultima traduzione automatica per campo. */
export type TranslationSourceFingerprints = {
  categories: Record<string, string>;
  items: Record<string, string>;
  subtitle?: string;
};

/**
 * Traduzioni variabili per una lingua (categorie, piatti, slogan).
 * `version` coincide con il menu IT solo quando nessun campo è obsoleto.
 * `sourceFingerprints` invalida un campo se il testo IT è cambiato dopo Traduci.
 */
export type ClientLocaleTranslation = {
  version: string;
  sourceFingerprints: TranslationSourceFingerprints;
  categories: Record<string, { name: string }>;
  items: Record<
    string,
    { name: string; description?: string }
  >;
  restaurant?: { subtitle?: string };
};

export type ClientConfig = {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  address: string;
  phone: string;
  tableServiceFee: number | null;
  hidden: boolean;
  brand: ClientBrand;
  header: ClientHeader;
  customizations: ClientCustomizations;
  categories: ClientCategory[];
  dishes: ClientDish[];
  translations?: Partial<
    Record<Exclude<Locale, "it">, ClientLocaleTranslation>
  >;
  createdAt: string;
  updatedAt: string;
};

export type ClientVersion = {
  id: string;
  savedAt: string;
  config: ClientConfig;
};

export type ClientStoreEntry = {
  config: ClientConfig;
  versions: ClientVersion[];
};
