"use client";

import { useState } from "react";

type Plan = {
  id: "mensile" | "annuale";
  label: string;
  price: string;
  priceNote: string;
  badge?: string;
  checkoutUrl: string;
};

const PLANS: Plan[] = [
  {
    id: "mensile",
    label: "Piano Mensile",
    price: "19€",
    priceNote: "al mese, IVA incl.",
    checkoutUrl: "https://buy.stripe.com/00w4gy1Zh6E03J8du3fbq00",
  },
  {
    id: "annuale",
    label: "Piano Annuale",
    price: "149€",
    priceNote: "all'anno, IVA incl.",
    badge: "Risparmia 35%",
    checkoutUrl: "https://buy.stripe.com/00wcN4bzRd2o6VkahRfbq01",
  },
];

export function CheckoutSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]);

  return (
    <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-6 shadow-[0_4px_32px_rgba(0,0,0,0.07)] sm:p-8">
      {/* Plan selector */}
      <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#606060]">
        Scegli il piano
      </p>
      <div className="mb-6 grid grid-cols-2 gap-3">
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
              <span className="mt-1 text-[1.6rem] font-bold leading-none text-[#141415]">
                {plan.price}
              </span>
              <span className="mt-1 text-[0.72rem] text-[#888]">
                {plan.priceNote}
              </span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <a
        href={selectedPlan.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#560200] py-4 text-[0.96rem] font-bold text-white transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <rect x="1" y="4" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M1 8h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Acquista {selectedPlan.label}
      </a>

      {selectedPlan.id === "annuale" && (
        <p className="mt-3 text-center text-[0.76rem] leading-snug text-[#888]">
          Continuando accetti i{" "}
          <a
            href="/termini-e-condizioni"
            className="font-semibold text-[#560200] underline decoration-[#560200]/30 underline-offset-2 hover:decoration-[#560200]"
          >
            Termini e Condizioni
          </a>
          , incluso il contratto annuale.
        </p>
      )}

      <p className="mt-3 text-center text-[0.74rem] text-[#adadad]">
        Pagamento sicuro via Stripe ·{" "}
        <a
          href="/termini-e-condizioni"
          className="underline hover:text-[#560200]"
        >
          Termini
        </a>{" "}
        e{" "}
        <a href="/privacy-policy" className="underline hover:text-[#560200]">
          Privacy
        </a>
      </p>

      {/* Payment brand icons */}
      <div className="mt-4 flex flex-nowrap items-center justify-center gap-1.5">
        {[
          { file: "flat/visa.svg",        label: "Visa",       type: "card", border: false },
          { file: "flat/mastercard.svg",  label: "Mastercard", type: "card", border: false },
          { file: "flat/amex.svg",        label: "Amex",       type: "card", border: false },
          { file: "flat/paypal.svg",      label: "PayPal",     type: "card", border: true },
          { file: "applepay-white.svg",   label: "Apple Pay",  type: "logo", bg: "bg-black",    border: false, imgClass: "h-[1.35rem]" },
          { file: "googlepay.svg",        label: "Google Pay", type: "logo", bg: "bg-white",     border: true,  imgClass: "h-[1.3rem]" },
          { file: "klarna.svg",           label: "Klarna",     type: "logo", bg: "bg-[#FFB3C7]", border: false, imgClass: "h-[1.15rem]" },
        ].map(({ file, label, type, bg, border, imgClass }) => (
          <span
            key={file}
            className={`flex h-7 w-[2.65rem] shrink-0 items-center justify-center overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
              type === "card" ? "" : bg
            } ${border ? "border border-[#e8e8e8]" : ""}`}
            aria-label={label}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/payment-icons/${file}`}
              alt={label}
              width={42}
              height={28}
              className={
                type === "card"
                  ? "h-full w-full object-cover"
                  : `${imgClass} w-auto max-w-[90%] object-contain`
              }
            />
          </span>
        ))}
      </div>
    </div>
  );
}
