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

const ALL_LOCALES: Locale[] = ["it", "en", "fr", "de", "es"];

type LanguageContextValue = {
  locale: Locale;
  content: TranslatedContent;
  translationError: string | null;
  enabledLocales: Locale[];
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
  baseContent?: TranslatedContent;
  enabledLocales?: Locale[];
};

export function LanguageProvider({
  children,
  baseContent,
  enabledLocales = ALL_LOCALES,
}: LanguageProviderProps) {
  const italianContent = baseContent ?? getItalianContent();
  const [locale, setLocaleState] = useState<Locale>(
    enabledLocales.includes("it") ? "it" : enabledLocales[0],
  );
  const [content, setContent] = useState<TranslatedContent>(italianContent);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (!enabledLocales.includes(nextLocale)) {
        return;
      }

      setTranslationError(null);

      if (nextLocale === "it") {
        setLocaleState("it");
        setContent(italianContent);
        return;
      }

      try {
        const bundle = getStaticTranslation(nextLocale);
        const translated = applyTranslation(bundle);

        setLocaleState(nextLocale);
        setContent(
          baseContent
            ? {
                ...translated,
                ui: {
                  ...translated.ui,
                  tableServiceFee: italianContent.ui.tableServiceFee,
                  listTotal: italianContent.ui.listTotal,
                },
                categories: italianContent.categories,
                restaurant: {
                  ...translated.restaurant,
                  name: italianContent.restaurant.name,
                  subtitle: italianContent.restaurant.subtitle,
                  address: italianContent.restaurant.address,
                  phone: italianContent.restaurant.phone,
                },
              }
            : translated,
        );
      } catch {
        setTranslationError(italianContent.ui.translationError);
        setLocaleState("it");
        setContent(italianContent);
      }
    },
    [baseContent, enabledLocales, italianContent],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (locale === "it") {
      setContent(italianContent);
    }
  }, [italianContent, locale]);

  const value = useMemo(
    () => ({
      locale,
      content,
      translationError,
      enabledLocales,
      setLocale,
    }),
    [content, enabledLocales, locale, setLocale, translationError],
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
