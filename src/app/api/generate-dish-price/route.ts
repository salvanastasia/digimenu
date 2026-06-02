import { NextResponse } from "next/server";
import { generateDishPriceWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";

type GenerateDishPriceBody = {
  email?: string;
  dishName?: string;
  dishDescription?: string;
  categoryName?: string;
  restaurantName?: string;
};

export async function POST(request: Request) {
  let body: GenerateDishPriceBody;

  try {
    body = (await request.json()) as GenerateDishPriceBody;
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
    const price = await generateDishPriceWithGemini({
      dishName,
      dishDescription: body.dishDescription?.trim(),
      categoryName: body.categoryName?.trim(),
      restaurantName: body.restaurantName?.trim(),
    });
    return NextResponse.json({ price });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore generazione prezzo.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
