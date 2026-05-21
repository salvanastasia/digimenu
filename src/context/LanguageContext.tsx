"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTranslation,
  getItalianContent,
  type TranslatedContent,
} from "@/lib/apply-translation";
import { getLanguage } from "@/lib/languages";
import { getStaticTranslation } from "@/data/translations";
import type { Locale } from "@/types/translation";

type LanguageContextValue = {
  locale: Locale;
  content: TranslatedContent;
  translationError: string | null;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");
  const [content, setContent] = useState<TranslatedContent>(getItalianContent);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const setLocale = useCallback((nextLocale: Locale) => {
    setTranslationError(null);

    if (nextLocale === "it") {
      setLocaleState("it");
      setContent(getItalianContent());
      return;
    }

    try {
      const bundle = getStaticTranslation(nextLocale);
      setLocaleState(nextLocale);
      setContent(applyTranslation(bundle));
    } catch {
      setTranslationError(getItalianContent().ui.translationError);
      setLocaleState("it");
      setContent(getItalianContent());
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      content,
      translationError,
      setLocale,
    }),
    [content, locale, setLocale, translationError],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useCurrentLanguage() {
  return getLanguage(useLanguage().locale);
}
