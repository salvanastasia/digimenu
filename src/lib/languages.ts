import type { Locale } from "@/types/translation";

export type TricolorFlag = {
  kind: "tricolor";
  colors: [string, string, string];
};

export type UnionJackFlag = {
  kind: "union-jack";
};

export type FlagSpec = TricolorFlag | UnionJackFlag;

export type LanguageOption = {
  locale: Locale;
  label: string;
  flag: FlagSpec;
};

export const LANGUAGES: LanguageOption[] = [
  { locale: "it", label: "Italiano", flag: { kind: "tricolor", colors: ["#009246", "#ffffff", "#CE2B37"] } },
  { locale: "en", label: "English", flag: { kind: "union-jack" } },
  { locale: "fr", label: "Français", flag: { kind: "tricolor", colors: ["#0055A4", "#ffffff", "#EF4135"] } },
  { locale: "de", label: "Deutsch", flag: { kind: "tricolor", colors: ["#000000", "#DD0000", "#FFCE00"] } },
  { locale: "es", label: "Español", flag: { kind: "tricolor", colors: ["#AA151B", "#F1BF00", "#AA151B"] } },
];

export const LOCALE_NAMES: Record<Exclude<Locale, "it">, string> = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
};

export function getLanguage(locale: Locale) {
  return LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];
}
