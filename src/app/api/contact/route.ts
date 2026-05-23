import { NextResponse } from "next/server";
import { init, id, tx } from "@instantdb/admin";
import schema from "../../../../instant.schema";

type ContactBody = {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  email?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo richiesta non valido." },
      { status: 400 },
    );
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const businessName = body.businessName?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";

  if (!firstName || !lastName || !phone || !email) {
    return NextResponse.json(
      { error: "Compila tutti i campi obbligatori." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email non valida." }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID?.trim();
  const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN?.trim();

  if (!appId || !adminToken) {
    return NextResponse.json(
      { error: "Servizio contatti non configurato." },
      { status: 503 },
    );
  }

  try {
    const db = init({ appId, adminToken, schema });
    const requestId = id();

    await db.transact(
      tx.contactRequests[requestId].update({
        firstName,
        lastName,
        phone,
        email: normalizeEmail(email),
        read: false,
        createdAt: new Date().toISOString(),
        ...(businessName ? { businessName } : {}),
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore durante l'invio.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
