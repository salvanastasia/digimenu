"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const StripeCheckout = dynamic(
  () => import("./StripeCheckout").then((m) => m.StripeCheckout),
  { ssr: false },
);

const PayPalCheckout = dynamic(
  () => import("./PayPalCheckout").then((m) => m.PayPalCheckout),
  { ssr: false },
);

export type Plan = {
  id: "mensile" | "annuale";
  label: string;
  price: string;
  priceNote: string;
  amountCents: number;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "mensile",
    label: "Piano Mensile",
    price: "€19",
    priceNote: "al mese, IVA incl.",
    amountCents: 1900,
  },
  {
    id: "annuale",
    label: "Piano Annuale",
    price: "€149",
    priceNote: "all'anno, IVA incl.",
    amountCents: 14900,
    badge: "Risparmia 35%",
  },
];

type CheckoutSectionProps = {
  stripeKey: string | null;
  paypalClientId: string | null;
};

export function CheckoutSection({
  stripeKey,
  paypalClientId,
}: CheckoutSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]);

  const isConfigured = stripeKey || paypalClientId;

  return (
    <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-6 shadow-[0_4px_32px_rgba(0,0,0,0.07)] sm:p-8">
      {/* Plan selector */}
      <div className="mb-6">
        <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#606060]">
          Scegli il piano
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PLANS.map((plan) => {
            const active = plan.id === selectedPlan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`relative flex flex-col rounded-[16px] border-2 p-4 text-left transition-all ${
                  active
                    ? "border-[#560200] bg-[#fdf5f5]"
                    : "border-[#e4e4e4] hover:border-[#c0c0c0]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-[#560200] px-2.5 py-0.5 text-[0.68rem] font-bold text-white">
                    {plan.badge}
                  </span>
                )}
                <span className="text-[0.78rem] font-semibold text-[#606060]">
                  {plan.label}
                </span>
                <span className="mt-1 text-[1.6rem] font-bold text-[#141415] leading-none">
                  {plan.price}
                </span>
                <span className="mt-1 text-[0.72rem] text-[#888]">
                  {plan.priceNote}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment forms */}
      {!isConfigured ? (
        <div className="rounded-[16px] border border-dashed border-[#d4d4d4] bg-[#fafafa] px-5 py-8 text-center">
          <p className="text-[0.92rem] font-semibold text-[#141415]">
            Pagamento in configurazione
          </p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-[#606060]">
            Aggiungi{" "}
            <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5 text-[0.8rem]">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            </code>{" "}
            e/o{" "}
            <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5 text-[0.8rem]">
              NEXT_PUBLIC_PAYPAL_CLIENT_ID
            </code>{" "}
            nel tuo <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5 text-[0.8rem]">.env.local</code>.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {stripeKey && (
            <div>
              <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#606060]">
                Carta · Apple Pay · Google Pay
              </p>
              <StripeCheckout plan={selectedPlan} publishableKey={stripeKey} />
            </div>
          )}

          {paypalClientId && (
            <div>
              {stripeKey && (
                <div className="relative my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#e4e4e4]" />
                  <span className="text-[0.78rem] font-medium text-[#adadad]">
                    oppure
                  </span>
                  <div className="h-px flex-1 bg-[#e4e4e4]" />
                </div>
              )}
              <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#606060]">
                PayPal
              </p>
              <PayPalCheckout plan={selectedPlan} clientId={paypalClientId} />
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-center text-[0.74rem] text-[#adadad]">
        Pagamento sicuro · Cancella quando vuoi ·{" "}
        <a href="/termini-e-condizioni" className="underline hover:text-[#560200]">
          Termini
        </a>{" "}
        e{" "}
        <a href="/privacy-policy" className="underline hover:text-[#560200]">
          Privacy
        </a>
      </p>
    </div>
  );
}
