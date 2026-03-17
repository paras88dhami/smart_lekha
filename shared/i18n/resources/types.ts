export const SUPPORTED_LANGUAGE_CODES = ["en", "ne", "hi"] as const;

export type SupportedLanguageCode =
  (typeof SUPPORTED_LANGUAGE_CODES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguageCode = "en";

export type TranslationValue = string | TranslationTree;

export type TranslationTree = {
  [key: string]: TranslationValue;
};