import { NextResponse } from "next/server";
import { generateDishDescriptionWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";

type GenerateDishDescriptionBody = {
  email?: string;
  dishName?: string;
  categoryName?: string;
  restaurantName?: string;
};

export async function POST(request: Request) {
  let body: GenerateDishDescriptionBody;

  try {
    body = (await request.json()) as GenerateDishDescriptionBody;
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
    const description = await generateDishDescriptionWithGemini({
      dishName,
      categoryName: body.categoryName?.trim(),
      restaurantName: body.restaurantName?.trim(),
    });
    return NextResponse.json({ description });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore generazione descrizione.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
