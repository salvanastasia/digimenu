import { ALLERGENS } from "@/data/allergens";
import { createPrefixedId } from "@/lib/create-id";
import type { ClientCategory, ClientConfig, ClientDish } from "@/types/client";

export type MenuDishesExportFile = {
  version: 1;
  categories: ClientCategory[];
  dishes: ClientDish[];
};

export type ImportedDishRow = {
  category: string;
  name: string;
  description?: string;
  price?: number | null;
  allergenIds?: number[];
};

export type MenuImportPayload = {
  categories?: Array<{ id?: string; name: string }>;
  dishes: ImportedDishRow[];
};

const CSV_HEADERS = [
  "category",
  "name",
  "description",
  "price",
  "allergenIds",
] as const;

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (inQuotes) {
      if (char === '"') {
        if (line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function parsePrice(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function parseAllergenIds(raw: string): number[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const tokens = trimmed.split(/[;|,]/).map((part) => part.trim()).filter(Boolean);
  const ids = new Set<number>();

  for (const token of tokens) {
    const asNumber = Number(token);
    if (Number.isInteger(asNumber) && asNumber > 0) {
      ids.add(asNumber);
      continue;
    }

    const match = ALLERGENS.find(
      (allergen) =>
        allergen.name.toLowerCase() === token.toLowerCase() ||
        allergen.name.toLowerCase().startsWith(`${token.toLowerCase()}-`) ||
        allergen.name.toLowerCase().startsWith(`${token}-`),
    );
    if (match) ids.add(match.id);
  }

  return [...ids].sort((a, b) => a - b);
}

function normalizeCategoryKey(name: string) {
  return name.trim().toLowerCase();
}

export function exportMenuDishesJson(client: ClientConfig): string {
  const payload: MenuDishesExportFile = {
    version: 1,
    categories: client.categories,
    dishes: client.dishes,
  };
  return JSON.stringify(payload, null, 2);
}

export function exportMenuDishesCsv(client: ClientConfig): string {
  const categoryNameById = new Map(
    client.categories.map((category) => [category.id, category.name]),
  );

  const lines = [
    CSV_HEADERS.join(","),
    ...client.dishes.map((dish) => {
      const category =
        categoryNameById.get(dish.categoryId)?.trim() || "Senza categoria";
      return [
        escapeCsvCell(category),
        escapeCsvCell(dish.name),
        escapeCsvCell(dish.description),
        dish.price == null ? "" : String(dish.price),
        escapeCsvCell(dish.allergenIds.join(";")),
      ].join(",");
    }),
  ];

  return lines.join("\n");
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseMenuDishesJson(text: string): MenuImportPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("JSON non valido.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Formato JSON non riconosciuto.");
  }

  const record = parsed as {
    categories?: unknown;
    dishes?: unknown;
  };

  const categories = Array.isArray(record.categories)
    ? record.categories.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const name = "name" in entry ? String(entry.name ?? "").trim() : "";
        if (!name) return [];
        const id =
          "id" in entry && typeof entry.id === "string" ? entry.id : undefined;
        return [{ id, name }];
      })
    : undefined;

  if (!Array.isArray(record.dishes) || record.dishes.length === 0) {
    throw new Error("Il file JSON non contiene piatti.");
  }

  const dishes: ImportedDishRow[] = [];

  for (const entry of record.dishes) {
    if (!entry || typeof entry !== "object") continue;

    const dish = entry as Record<string, unknown>;
    const categoryId =
      typeof dish.categoryId === "string" ? dish.categoryId : undefined;
    const categoryName =
      typeof dish.category === "string"
        ? dish.category.trim()
        : typeof dish.categoryName === "string"
          ? dish.categoryName.trim()
          : "";

    let category = categoryName;
    if (!category && categoryId && categories) {
      category =
        categories.find((item) => item.id === categoryId)?.name.trim() ?? "";
    }

    const name = typeof dish.name === "string" ? dish.name.trim() : "";
    if (!category || !name) continue;

    const description =
      typeof dish.description === "string" ? dish.description.trim() : "";
    const price =
      dish.price === null || dish.price === undefined
        ? null
        : parsePrice(String(dish.price));
    const allergenIds = Array.isArray(dish.allergenIds)
      ? dish.allergenIds
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value > 0)
      : [];

    dishes.push({
      category,
      name,
      description,
      price,
      allergenIds,
    });
  }

  if (dishes.length === 0) {
    throw new Error("Nessun piatto valido nel JSON.");
  }

  return { categories, dishes };
}

export function parseMenuDishesCsv(text: string): MenuImportPayload {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Il file CSV è vuoto.");
  }

  const firstCells = parseCsvLine(lines[0]).map((cell) => cell.trim().toLowerCase());
  const hasHeader = CSV_HEADERS.every(
    (header, index) => firstCells[index] === header,
  );
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const dishes: ImportedDishRow[] = [];

  for (const line of dataLines) {
    const cells = parseCsvLine(line);
    const category = (cells[0] ?? "").trim();
    const name = (cells[1] ?? "").trim();
    if (!category || !name) continue;

    dishes.push({
      category,
      name,
      description: (cells[2] ?? "").trim(),
      price: parsePrice(cells[3] ?? ""),
      allergenIds: parseAllergenIds(cells[4] ?? ""),
    });
  }

  if (dishes.length === 0) {
    throw new Error("Nessun piatto valido nel CSV.");
  }

  return { dishes };
}

export function applyMenuImport(
  client: ClientConfig,
  payload: MenuImportPayload,
): ClientConfig {
  const categoryIdByKey = new Map<string, string>();
  const categories: ClientCategory[] = [];

  const registerCategory = (name: string, preferredId?: string) => {
    const trimmed = name.trim() || "Senza categoria";
    const key = normalizeCategoryKey(trimmed);
    const existingId = categoryIdByKey.get(key);
    if (existingId) return existingId;

    const id = preferredId ?? createPrefixedId("cat");
    categoryIdByKey.set(key, id);
    categories.push({ id, name: trimmed });
    return id;
  };

  for (const category of payload.categories ?? []) {
    registerCategory(category.name, category.id);
  }

  const dishes: ClientDish[] = payload.dishes.map((row) => {
    const categoryId = registerCategory(row.category);
    return {
      id: createPrefixedId("dish"),
      categoryId,
      name: row.name.trim(),
      description: row.description?.trim() ?? "",
      price: row.price ?? null,
      allergenIds: row.allergenIds ?? [],
    };
  });

  return {
    ...client,
    categories,
    dishes,
    updatedAt: new Date().toISOString(),
  };
}
