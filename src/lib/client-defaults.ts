import rawMenu from "@/data/menu.json";
import type {
  ClientConfig,
  ClientDish,
  ClientHeader,
} from "@/types/client";
import type { Locale } from "@/types/translation";
import { ensureUniqueSlug, slugify } from "@/lib/client-slug";

export const DEFAULT_PRIMARY = "#560200";
export const DEFAULT_SECONDARY = "#F2E8D8";
export const DEFAULT_FONT = "Manrope, sans-serif";
export const DEFAULT_SUBTITLE =
  rawMenu.restaurant.subtitle ?? "Ristorante · Pizzeria · B&B";
export const SUBTITLE_MAX_LENGTH = 32;
export const DEFAULT_ADDRESS = rawMenu.restaurant.address ?? "";
export const DEFAULT_PHONE = rawMenu.restaurant.phone ?? "";
export const DEFAULT_TABLE_SERVICE_FEE = 2.5;

export function formatTableServiceFee(fee: number | null): string | undefined {
  if (fee == null) return undefined;

  const formatted = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: fee % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(fee);

  return `Servizio al tavolo: ${formatted}€`;
}

export const FONT_OPTIONS = [
  { value: "Manrope, sans-serif", label: "Manrope" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "system-ui, sans-serif", label: "System UI" },
] as const;

const ALL_LOCALES: Locale[] = ["it", "en", "fr", "de", "es"];

function createHeaderFromBrand(
  primaryColor: string,
  secondaryColor: string,
): ClientHeader {
  return {
    logoUrl: "/logo.svg",
    backgroundMode: "color",
    backgroundImageUrl: "",
    languages: [...ALL_LOCALES],
    colorOverrides: {},
  };
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createEmptyClient(name = "Nuovo cliente"): ClientConfig {
  const now = new Date().toISOString();
  const categoryId = createId("cat");
  const slug = slugify(name);

  return {
    id: createId("client"),
    name,
    slug,
    subtitle: DEFAULT_SUBTITLE.slice(0, SUBTITLE_MAX_LENGTH),
    address: DEFAULT_ADDRESS,
    phone: DEFAULT_PHONE,
    tableServiceFee: DEFAULT_TABLE_SERVICE_FEE,
    hidden: false,
    brand: {
      primaryColor: DEFAULT_PRIMARY,
      secondaryColor: DEFAULT_SECONDARY,
      fontFamily: DEFAULT_FONT,
    },
    header: createHeaderFromBrand(DEFAULT_PRIMARY, DEFAULT_SECONDARY),
    categories: [{ id: categoryId, name: "Menu" }],
    dishes: [
      {
        id: createId("dish"),
        categoryId,
        name: "",
        description: "",
        price: null,
        allergenIds: [],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function createAribriSeedClient(): ClientConfig {
  const now = new Date().toISOString();
  const primaryColor = DEFAULT_PRIMARY;
  const secondaryColor = DEFAULT_SECONDARY;

  const categories = rawMenu.categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  const dishes: ClientDish[] = rawMenu.categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      categoryId: category.id,
      name: item.name,
      description:
        "description" in item && typeof item.description === "string"
          ? item.description
          : "",
      price: item.price ?? null,
      allergenIds: "allergens" in item && Array.isArray(item.allergens) ? item.allergens : [],
    })),
  );

  return {
    id: "client-aribri",
    name: rawMenu.restaurant.name,
    slug: "aribri",
    subtitle: DEFAULT_SUBTITLE.slice(0, SUBTITLE_MAX_LENGTH),
    address: DEFAULT_ADDRESS,
    phone: DEFAULT_PHONE,
    tableServiceFee: DEFAULT_TABLE_SERVICE_FEE,
    hidden: false,
    brand: {
      primaryColor,
      secondaryColor,
      fontFamily: DEFAULT_FONT,
    },
    header: createHeaderFromBrand(primaryColor, secondaryColor),
    categories,
    dishes,
    createdAt: now,
    updatedAt: now,
  };
}

export function syncHeaderFabFromBrand(client: ClientConfig): ClientConfig {
  return {
    ...client,
    header: {
      ...client.header,
      colorOverrides: {},
    },
    updatedAt: new Date().toISOString(),
  };
}
