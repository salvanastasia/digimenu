"use client";

import { useEffect, useRef, useState } from "react";
import { FlagIcon } from "@/components/FlagIcon";
import { useClientMenu } from "@/context/ClientMenuContext";
import { LANGUAGES } from "@/lib/languages";
import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/types/translation";

export function LanguageSelector({
  tone = "dark",
  size = "default",
}: {
  tone?: "dark" | "light";
  size?: "default" | "compact";
}) {
  const { locale, setLocale, content, enabledLocales } = useLanguage();
  const clientMenu = useClientMenu();
  const primaryColor = clientMenu?.client.brand.primaryColor ?? "#560200";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const availableLanguages = LANGUAGES.filter((language) =>
    enabledLocales.includes(language.locale),
  );
  const current =
    availableLanguages.find((language) => language.locale === locale) ??
    availableLanguages[0];

  if (!current) {
    return null;
  }

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

  const handleSelect = (nextLocale: Locale) => {
    setOpen(false);
    if (nextLocale !== locale) {
      setLocale(nextLocale);
    }
  };

  return (
    <div ref={rootRef} className="relative z-50">
      <button
        type="button"
        aria-label={content.ui.selectLanguage}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center justify-center overflow-hidden rounded-full border ${
          size === "compact" ? "h-8 w-8" : "h-11 w-11"
        } ${tone === "light" ? "border-[#141415]/25" : "border-white/70"}`}
      >
        <FlagIcon flag={current.flag} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={content.ui.selectLanguage}
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] overflow-hidden rounded-[14px] border border-[#ececec] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        >
          {availableLanguages.map((language) => {
            const selected = language.locale === locale;
            return (
              <button
                key={language.locale}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(language.locale)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[0.92rem] transition-colors ${
                  selected
                    ? "font-semibold"
                    : "text-[#141415] hover:bg-[#f5f5f5]"
                }`}
                style={
                  selected
                    ? {
                        backgroundColor: `color-mix(in srgb, ${primaryColor} 8%, transparent)`,
                        color: primaryColor,
                      }
                    : undefined
                }
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
