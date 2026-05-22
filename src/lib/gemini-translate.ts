import { GoogleGenerativeAI } from "@google/generative-ai";
import { LOCALE_NAMES } from "@/lib/languages";
import type { Locale } from "@/types/translation";

const GEMINI_MODELS = [
  // 1. Modelli "Lite" (Ultra-economici e fulminei per menu semplici)
  "gemini-2.5-flash-lite", 
  
  // 2. Modelli "Flash" standard (Il perfetto bilanciamento per l'uso quotidiano)
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3.5-flash", // Se disponibile nel tuo tier / SDK region
  "gemini-1.5-flash-latest", // Ottimo fallback storico
  
  // 3. Modelli "Pro" (Massima intelligenza, usati come ultima risorsa per menu complessi)
  "gemini-2.5-pro",
  "gemini-1.5-pro-latest"
] as const;

export async function translateChunkWithGemini(
  locale: Exclude<Locale, "it">,
  chunkData: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY non configurata sul server.");
  }

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

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text) as Record<string, unknown>;
      return parsed;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Traduzione Gemini non riuscita.");
}
