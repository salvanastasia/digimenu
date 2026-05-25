"use client";

import { useState } from "react";
import type { Allergen } from "@/types/menu";

type AllergenListProps = {
  allergens: Allergen[];
  title: string;
};

export function AllergenList({ allergens, title }: AllergenListProps) {
  const [open, setOpen] = useState(false);

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
