"use client";

import { useState } from "react";
import type { Allergen } from "@/types/menu";
import { useClientMenu } from "@/context/ClientMenuContext";
import { getMenuTheme, isFramedMenuTheme } from "@/lib/menu-theme";

type AllergenListProps = {
  allergens: Allergen[];
  title: string;
};

export function AllergenList({ allergens, title }: AllergenListProps) {
  const [open, setOpen] = useState(false);
  const clientMenu = useClientMenu();
  const isFramed = isFramedMenuTheme(getMenuTheme(clientMenu?.client));
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";

  if (isFramed) {
    return (
      <section className="border-t-2 border-[#141415] px-4 py-6 text-[0.82rem] leading-relaxed text-[#141415]">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`block w-full text-left text-[0.78rem] font-bold uppercase tracking-[0.24em] ${open ? "mb-3" : ""}`}
          style={{ color: primaryColor }}
        >
          {title} {open ? "−" : "+"}
        </button>

        {open ? (
          <ul className="space-y-2 border-t border-[#141415] pt-3">
            {allergens.map((allergen) => (
              <li key={allergen.id}>
                <strong className="font-bold uppercase tracking-[0.04em]">
                  {allergen.name}
                </strong>
                : {allergen.description}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  return (
    <section className="px-5 py-7 text-[0.85rem] leading-relaxed text-[#141415]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`block w-full text-left text-[1.1rem] font-bold ${open ? "mb-3" : ""}`}
      >
        {title} {open ? "−" : "+"}
      </button>

      {open ? (
        <ul className="space-y-2">
          {allergens.map((allergen) => (
            <li key={allergen.id}>
              <strong className="font-bold">{allergen.name}</strong>:{" "}
              {allergen.description}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
