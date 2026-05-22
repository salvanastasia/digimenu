import { GoogleGenerativeAI } from "@google/generative-ai";
import { LOCALE_NAMES } from "@/lib/languages";
import type { Locale } from "@/types/translation";

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
] as const;

type GeminiGenerationConfig = {
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY non configurata sul server.");
  }
  return new GoogleGenerativeAI(apiKey);
}

async function runGeminiPrompt(
  prompt: string,
  config: GeminiGenerationConfig,
  parse: (text: string) => string,
): Promise<string> {
  const genAI = getGeminiClient();
  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
      });

      const result = await model.generateContent(prompt);
      return parse(result.response.text().trim());
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Richiesta Gemini non riuscita.");
}

export async function translateChunkWithGemini(
  locale: Exclude<Locale, "it">,
  chunkData: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const targetLanguage = LOCALE_NAMES[locale];
  const prompt = [
    `Translate the following JSON from Italian to ${targetLanguage}.`,
    "Context: restaurant digital menu (dishes, categories, short marketing subtitle).",
    "Rules:",
    "- Return ONLY valid JSON with the exact same structure and keys.",
    "- Do not translate JSON keys or ids.",
    "- Keep culinary terms natural for the target locale.",
    "- Preserve empty or missing fields; omit description key if absent in source.",
    "",
    JSON.stringify(chunkData, null, 2),
  ].join("\n");

  const text = await runGeminiPrompt(
    prompt,
    { responseMimeType: "application/json", temperature: 0.2 },
    (raw) => raw,
  );

  return JSON.parse(text) as Record<string, unknown>;
}

export type GenerateDishDescriptionInput = {
  dishName: string;
  categoryName?: string;
  restaurantName?: string;
};

export async function generateDishDescriptionWithGemini(
  input: GenerateDishDescriptionInput,
): Promise<string> {
  const dishName = input.dishName.trim();
  if (!dishName) {
    throw new Error("Nome piatto mancante.");
  }

  const prompt = [
    "Scrivi la descrizione menu di un piatto per un ristorante italiano.",
    `Piatto: ${dishName}`,
    input.categoryName
      ? `Categoria: ${input.categoryName.trim()}`
      : null,
    input.restaurantName
      ? `Ristorante: ${input.restaurantName.trim()}`
      : null,
    "",
    "Stile richiesto (menu digitale, non copy pubblicitario):",
    "- Una sola riga, frasi brevi collegate da virgola.",
    "- Elenca preparazione essenziale e componenti plausibili dal nome del piatto.",
    "- Tono descrittivo e neutro: niente inviti al gusto, niente aggettivi promozionali.",
    "- Evita: morso, croccante, delizioso, intramontabile, stuzzica il palato, alla perfezione, avvolto, tentazione.",
    "- Non ripetere il nome del piatto se già evidente.",
    "- Non inventare ingredienti improbabili rispetto al nome.",
    "",
    "Esempio corretto:",
    "Polpo cotto a bassa temperatura, crema di patate, pomodorino confit, erbette mediterranee.",
    "",
    "Esempio da NON imitare:",
    "Morso croccante di baccalà fresco, avvolto in una delicata pastella dorata e fritto alla perfezione. Un classico intramontabile che stuzzica il palato.",
    "",
    "Restituisci SOLO la descrizione, senza virgolette, titoli o spiegazioni.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return runGeminiPrompt(
    prompt,
    { responseMimeType: "text/plain", temperature: 0.35 },
    (raw) => raw.replace(/^["']|["']$/g, "").trim(),
  );
}

export type GenerateDishAllergensInput = {
  dishName: string;
  dishDescription?: string;
  categoryName?: string;
};

const EU_ALLERGEN_CATALOG = [
  { id: 1, label: "Cereali contenenti glutine (grano, farro, segale, orzo, avena, pasta, pane, impanatura)" },
  { id: 2, label: "Crostacei (gamberi, scampi, aragoste, granchi)" },
  { id: 3, label: "Uova (maionese, pasta all'uovo, frittata, impasti)" },
  { id: 4, label: "Pesce e derivati" },
  { id: 5, label: "Arachidi e prodotti a base di arachidi" },
  { id: 6, label: "Semi di soia e prodotti a base di soia" },
  { id: 7, label: "Latte e prodotti a base di latte (incluso lattosio)" },
  { id: 8, label: "Frutta a guscio (mandorle, nocciole, noci, pistacchi, ecc.)" },
  { id: 9, label: "Sedano e derivati" },
  { id: 10, label: "Senape e prodotti a base di senape" },
  { id: 11, label: "Semi di sesamo e prodotti a base di sesamo" },
  { id: 12, label: "Anidride solforosa e solfiti" },
  { id: 13, label: "Lupini e prodotti a base di lupini" },
  { id: 14, label: "Molluschi (cozze, vongole, polpo, calamari, ecc.)" },
] as const;

const VALID_ALLERGEN_IDS = new Set<number>(
  EU_ALLERGEN_CATALOG.map((allergen) => allergen.id),
);

function parseAllergenIdsResponse(raw: string): number[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Risposta allergeni non valida.");
  }

  const candidate =
    parsed &&
    typeof parsed === "object" &&
    "allergenIds" in parsed &&
    Array.isArray((parsed as { allergenIds: unknown }).allergenIds)
      ? (parsed as { allergenIds: unknown[] }).allergenIds
      : Array.isArray(parsed)
        ? parsed
        : null;

  if (!candidate) {
    throw new Error("Risposta allergeni non valida.");
  }

  const ids = candidate
    .map((value) => Number(value))
    .filter(
      (value) => Number.isInteger(value) && VALID_ALLERGEN_IDS.has(value),
    );

  return [...new Set(ids)].sort((a, b) => a - b);
}

export async function generateDishAllergensWithGemini(
  input: GenerateDishAllergensInput,
): Promise<number[]> {
  const dishName = input.dishName.trim();
  if (!dishName) {
    throw new Error("Nome piatto mancante.");
  }

  const allergenList = EU_ALLERGEN_CATALOG.map(
    (allergen) => `${allergen.id} - ${allergen.label}`,
  ).join("\n");

  const prompt = [
    "Sei un assistente per menu ristorante italiano (Reg. UE 1169/2011).",
    "In base a nome e descrizione del piatto, indica quali allergeni obbligatori sono plausibilmente presenti negli ingredienti tipici di quel piatto.",
    "",
    `Piatto: ${dishName}`,
    input.dishDescription?.trim()
      ? `Descrizione: ${input.dishDescription.trim()}`
      : "Descrizione: (non fornita)",
    input.categoryName ? `Categoria: ${input.categoryName.trim()}` : null,
    "",
    "Elenco allergeni (usa SOLO questi id numerici):",
    allergenList,
    "",
    "Regole:",
    '- Restituisci SOLO JSON valido nel formato {"allergenIds":[1,7]}',
    "- Includi un allergene solo se plausibile dal nome, dalla descrizione o dalla categoria",
    "- Se incerto, non includere l'allergene",
    '- Usa array vuoto {"allergenIds":[]} se nessun allergene è identificabile',
    "- Non inventare ingredienti improbabili rispetto al piatto",
    "- Esempi: pasta al pomodoro -> [1]; carbonara -> [1,3,7]; fritto impanato -> [1,3]; insalata semplice -> []",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const raw = await runGeminiPrompt(
    prompt,
    { responseMimeType: "application/json", temperature: 0.2 },
    (text) => text,
  );

  return parseAllergenIdsResponse(raw);
}
