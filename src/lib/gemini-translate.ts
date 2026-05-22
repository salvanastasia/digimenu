import { GoogleGenerativeAI } from "@google/generative-ai";
import { LOCALE_NAMES } from "@/lib/languages";
import type { Locale } from "@/types/translation";

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.5-pro",
  "gemini-1.5-pro-latest",
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
