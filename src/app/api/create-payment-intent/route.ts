import Stripe from "stripe";
import { NextResponse } from "next/server";

const ALLOWED_AMOUNTS_EUR = [1900, 14900]; // €19,00 / €149,00

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe non configurato" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);

  const { amountCents, plan } = (await req.json()) as {
    amountCents: number;
    plan: string;
  };

  if (!ALLOWED_AMOUNTS_EUR.includes(amountCents)) {
    return NextResponse.json({ error: "Importo non valido" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: { plan },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
