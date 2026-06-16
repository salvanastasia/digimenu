"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

type Plan = { id: string; label: string; amountCents: number };

// ─── Inner form ─────────────────────────────────────────────────────────────

function CheckoutForm({ plan }: { plan: Plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setLoading(true);
      setError(null);

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/attiva/success?plan=${plan.id}`,
        },
      });

      if (confirmError) {
        setError(confirmError.message ?? "Errore durante il pagamento.");
        setLoading(false);
      }
    },
    [stripe, elements, plan.id],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-[#560200] py-4 text-[0.96rem] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Elaborazione…" : `Paga ${(plan.amountCents / 100).toFixed(2).replace(".", ",")} €`}
      </button>
    </form>
  );
}

// ─── Wrapper that creates the PaymentIntent and mounts Elements ──────────────

type StripeCheckoutProps = {
  plan: Plan;
  publishableKey: string;
};

export function StripeCheckout({ plan, publishableKey }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const stripePromise = loadStripe(publishableKey);

  useEffect(() => {
    setClientSecret(null);
    setFetchError(null);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents: plan.amountCents, plan: plan.id }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (data.error) setFetchError(data.error);
        else setClientSecret(data.clientSecret ?? null);
      })
      .catch(() => setFetchError("Errore di connessione. Riprova."));
  }, [plan.amountCents, plan.id]);

  if (fetchError) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] text-red-700">
        {fetchError}
      </p>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#560200] border-t-transparent" />
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#560200",
        colorBackground: "#ffffff",
        colorText: "#141415",
        borderRadius: "12px",
        fontFamily: "Manrope, sans-serif",
      },
    },
    locale: "it",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm plan={plan} />
    </Elements>
  );
}
