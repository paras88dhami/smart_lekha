import type { SupportedLanguageCode } from "./types";

const LOCALE_BY_LANGUAGE: Record<SupportedLanguageCode, string> = {
  en: "en-IN",
  ne: "ne-NP",
  hi: "hi-IN",
};

const getLocale = (languageCode: SupportedLanguageCode): string => {
  return LOCALE_BY_LANGUAGE[languageCode] ?? "en-IN";
};

export const formatCurrencyAmount = (params: {
  amount: number;
  currencyCode: string;
  languageCode: SupportedLanguageCode;
}): string => {
  const { amount, currencyCode, languageCode } = params;
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat(getLocale(languageCode), {
      style: "currency",
      currency: currencyCode || "NPR",
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currencyCode || "NPR"} ${safeAmount.toFixed(2)}`;
  }
};

export const formatDateTime = (params: {
  timestamp: number;
  languageCode: SupportedLanguageCode;
}): string => {
  const { timestamp, languageCode } = params;

  if (!Number.isFinite(timestamp)) {
    return "-";
  }

  return new Intl.DateTimeFormat(getLocale(languageCode), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
};
