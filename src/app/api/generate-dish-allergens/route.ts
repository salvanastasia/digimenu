import { NextResponse } from "next/server";
import { generateDishAllergensWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";

type GenerateDishAllergensBody = {
  email?: string;
  dishName?: string;
  dishDescription?: string;
  categoryName?: string;
};

export async function POST(request: Request) {
  let body: GenerateDishAllergensBody;

  try {
    body = (await request.json()) as GenerateDishAllergensBody;
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

  const dishName = body.dishName?.trim();
  if (!dishName) {
    return NextResponse.json(
      { error: "Nome piatto mancante." },
      { status: 400 },
    );
  }

  try {
    const allergenIds = await generateDishAllergensWithGemini({
      dishName,
      dishDescription: body.dishDescription?.trim(),
      categoryName: body.categoryName?.trim(),
    });
    return NextResponse.json({ allergenIds });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore generazione allergeni.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
