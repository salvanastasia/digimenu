"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

type Plan = { id: string; label: string; amountCents: number };

type PayPalCheckoutProps = {
  plan: Plan;
  clientId: string;
};

export function PayPalCheckout({ plan, clientId }: PayPalCheckoutProps) {
  const router = useRouter();
  const amountValue = (plan.amountCents / 100).toFixed(2);

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "EUR",
        locale: "it_IT",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", label: "pay", height: 48 }}
        createOrder={(_data, actions) =>
          actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `DigiMenu – ${plan.label}`,
                amount: { currency_code: "EUR", value: amountValue },
              },
            ],
          })
        }
        onApprove={(_data, actions) =>
          actions.order!.capture().then(() => {
            router.push(`/attiva/success?plan=${plan.id}&via=paypal`);
          })
        }
        onError={(err) => {
          console.error("PayPal error", err);
        }}
      />
    </PayPalScriptProvider>
  );
}
