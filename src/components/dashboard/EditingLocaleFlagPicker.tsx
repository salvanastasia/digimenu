"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/FlagIcon";
import { LANGUAGES } from "@/lib/languages";
import type { Locale } from "@/types/translation";

type EditingLocaleFlagPickerProps = {
  value: Locale;
  onChange: (locale: Locale) => void;
  locales: Locale[];
  ariaLabel?: string;
};

export function EditingLocaleFlagPicker({
  value,
  onChange,
  locales,
  ariaLabel = "Lingua di modifica",
}: EditingLocaleFlagPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const options = LANGUAGES.filter((language) => locales.includes(language.locale));
  const current =
    options.find((language) => language.locale === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!current) {
    return null;
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        title={`${ariaLabel}: ${current.label}`}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-colors ${
          value !== "it"
            ? "border-[#560200] ring-2 ring-[#560200]/20"
            : "border-[#d8dadc] hover:border-[#560200]/40"
        }`}
      >
        <FlagIcon flag={current.flag} />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] overflow-hidden rounded-[14px] border border-[#ececec] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        >
          {options.map((language) => {
            const selected = language.locale === value;
            return (
              <button
                key={language.locale}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setOpen(false);
                  if (language.locale !== value) {
                    onChange(language.locale);
                  }
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[0.92rem] transition-colors ${
                  selected
                    ? "bg-[#560200]/8 font-semibold text-[#560200]"
                    : "text-[#141415] hover:bg-[#f5f5f5]"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10">
                  <FlagIcon flag={language.flag} />
                </span>
                <span>{language.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
