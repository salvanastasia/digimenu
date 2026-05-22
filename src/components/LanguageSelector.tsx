"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LANGUAGES, type FlagSpec } from "@/lib/languages";
import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/types/translation";

export function LanguageSelector() {
  const { locale, setLocale, content, enabledLocales } = useLanguage();
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
        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/70"
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

function FlagIcon({ flag }: { flag: FlagSpec }) {
  if (flag.kind === "union-jack") {
    return <UnionJackIcon />;
  }

  return (
    <span className="flex h-full w-full">
      <span className="w-1/3" style={{ backgroundColor: flag.colors[0] }} />
      <span className="w-1/3" style={{ backgroundColor: flag.colors[1] }} />
      <span className="w-1/3" style={{ backgroundColor: flag.colors[2] }} />
    </span>
  );
}

function UnionJackIcon() {
  const id = useId().replace(/:/g, "");
  const clipId = `union-jack-clip-${id}`;
  const tId = `union-jack-t-${id}`;

  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <clipPath id={clipId}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={tId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${tId})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
