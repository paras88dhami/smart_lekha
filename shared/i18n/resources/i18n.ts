import en from "../resources/en";
import hi from "../resources/hi";
import ne from "../resources/ne";

export const SUPPORTED_LANGUAGE_CODES = ["en", "ne", "hi"] as const;
export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

type TranslationResources = Record<SupportedLanguageCode, TranslationTree>;

const resources: TranslationResources = {
  en,
  ne,
  hi,
};

const FALLBACK_LANGUAGE: SupportedLanguageCode = "en";

let currentLanguage: SupportedLanguageCode = FALLBACK_LANGUAGE;
const listeners = new Set<() => void>();

const notifyListeners = (): void => {
  listeners.forEach((listener: () => void) => {
    listener();
  });
};

const readNestedValue = (
  tree: TranslationTree,
  keyParts: string[],
): string | null => {
  let currentValue: string | TranslationTree = tree;

  for (const keyPart of keyParts) {
    if (typeof currentValue === "string") {
      return null;
    }

    const nextValue: string | TranslationTree | undefined =
      currentValue[keyPart];

    if (nextValue === undefined) {
      return null;
    }

    currentValue = nextValue;
  }

  return typeof currentValue === "string" ? currentValue : null;
};

export const isSupportedLanguageCode = (
  languageCode: string,
): languageCode is SupportedLanguageCode => {
  return SUPPORTED_LANGUAGE_CODES.includes(
    languageCode as SupportedLanguageCode,
  );
};

export const getCurrentLanguage = (): SupportedLanguageCode => {
  return currentLanguage;
};

export const changeLanguage = (languageCode: SupportedLanguageCode): void => {
  if (currentLanguage === languageCode) {
    return;
  }

  currentLanguage = languageCode;
  notifyListeners();
};

export const translate = (translationKey: string): string => {
  const keyParts = translationKey.split(".");
  const selectedResource = resources[currentLanguage];
  const selectedValue = readNestedValue(selectedResource, keyParts);

  if (selectedValue) {
    return selectedValue;
  }

  const fallbackResource = resources[FALLBACK_LANGUAGE];
  const fallbackValue = readNestedValue(fallbackResource, keyParts);

  return fallbackValue ?? translationKey;
};

export const subscribeToLanguageChange = (
  listener: () => void,
): (() => void) => {
  listeners.add(listener);

  return (): void => {
    listeners.delete(listener);
  };
};
