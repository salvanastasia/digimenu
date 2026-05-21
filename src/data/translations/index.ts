import de from "@/data/translations/de.json";
import en from "@/data/translations/en.json";
import es from "@/data/translations/es.json";
import fr from "@/data/translations/fr.json";
import { MENU_TRANSLATION_VERSION } from "@/lib/translation-payload";
import type { Locale, TranslationBundle } from "@/types/translation";

const bundles = {
  en,
  fr,
  de,
  es,
} as const satisfies Record<Exclude<Locale, "it">, TranslationBundle>;

export function getStaticTranslation(
  locale: Exclude<Locale, "it">,
): TranslationBundle {
  const bundle = bundles[locale];

  if (bundle.version !== MENU_TRANSLATION_VERSION) {
    throw new Error(
      `Traduzione ${locale} non aggiornata (attesa ${MENU_TRANSLATION_VERSION}, trovata ${bundle.version}). Esegui npm run generate:translations`,
    );
  }

  return bundle;
}

export const AVAILABLE_TRANSLATION_LOCALES = Object.keys(
  bundles,
) as Array<Exclude<Locale, "it">>;
