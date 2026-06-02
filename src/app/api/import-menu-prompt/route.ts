import { NextResponse } from "next/server";
import { parseMenuFromTextWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";

type ImportMenuPromptBody = {
  email?: string;
  menuText?: string;
  restaurantName?: string;
};

export async function POST(request: Request) {
  let body: ImportMenuPromptBody;

  try {
    body = (await request.json()) as ImportMenuPromptBody;
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

  const menuText = body.menuText?.trim();
  if (!menuText) {
    return NextResponse.json(
      { error: "Testo menu mancante." },
      { status: 400 },
    );
  }

  try {
    const data = await parseMenuFromTextWithGemini({
      menuText,
      restaurantName: body.restaurantName?.trim(),
    });
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Importazione menu non riuscita.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
