import { NextResponse } from "next/server";
import { parseMenuFromFileWithGemini } from "@/lib/gemini-translate";
import { isAuthorizedTranslator } from "@/lib/translate-menu-auth";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/csv",
  "text/plain",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const email = (formData.get("email") as string | null)?.trim();
  const restaurantName =
    (formData.get("restaurantName") as string | null)?.trim() ?? undefined;
  const file = formData.get("file") as File | null;

  const authorized = await isAuthorizedTranslator(email ?? "");
  if (!authorized) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 403 });
  }

  if (!file) {
    return NextResponse.json({ error: "File mancante." }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "Formato file non supportato. Usa PDF o CSV." },
      { status: 415 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "File troppo grande (max 10 MB)." },
      { status: 413 },
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(buffer).toString("base64");

    const data = await parseMenuFromFileWithGemini({
      fileBase64,
      mimeType: mimeType as "application/pdf" | "text/csv" | "text/plain",
      restaurantName,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Importazione file non riuscita.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
