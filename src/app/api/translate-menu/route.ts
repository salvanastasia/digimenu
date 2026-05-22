import { NextResponse } from "next/server";
import { translateChunkWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";
import type { Locale } from "@/types/translation";

const TARGET_LOCALES = new Set<Exclude<Locale, "it">>([
  "en",
  "fr",
  "de",
  "es",
]);

type TranslateChunkBody = {
  email?: string;
  locale?: string;
  chunk?: {
    data?: Record<string, unknown>;
  };
};

export async function POST(request: Request) {
  let body: TranslateChunkBody;

  try {
    body = (await request.json()) as TranslateChunkBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo richiesta non valido." },
      { status: 400 },
    );
  }

  const authorized = await isAuthorizedTranslator(body.email);
  if (!authorized) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 403 });
  }

  const locale = body.locale;
  if (!locale || !TARGET_LOCALES.has(locale as Exclude<Locale, "it">)) {
    return NextResponse.json({ error: "Lingua non valida." }, { status: 400 });
  }

  const chunkData = body.chunk?.data;
  if (!chunkData || typeof chunkData !== "object") {
    return NextResponse.json({ error: "Chunk mancante." }, { status: 400 });
  }

  try {
    const part = await translateChunkWithGemini(
      locale as Exclude<Locale, "it">,
      chunkData,
    );
    return NextResponse.json({ part });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore di traduzione.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
