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
};

export type ClientDish = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number | null;
  allergenIds: number[];
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
  categories: ClientCategory[];
  dishes: ClientDish[];
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
