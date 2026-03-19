import type { CountryIsoType } from "./country.types";

type CountryPhonePattern = {
  minLength: number;
  maxLength: number;
  regex: RegExp;
};

const COUNTRY_PHONE_PATTERN_MAP: Record<CountryIsoType, CountryPhonePattern> = {
  NP: {
    minLength: 10,
    maxLength: 10,
    regex: /^9\d{9}$/,
  },
  IN: {
    minLength: 10,
    maxLength: 10,
    regex: /^[6-9]\d{9}$/,
  },
};

export const sanitizePhoneDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const getPhoneLengthForCountry = (
  countryIso: CountryIsoType,
): number => {
  return COUNTRY_PHONE_PATTERN_MAP[countryIso].maxLength;
};

export const isValidPhoneForCountry = (
  phoneDigits: string,
  countryIso: CountryIsoType,
): boolean => {
  const rule = COUNTRY_PHONE_PATTERN_MAP[countryIso];

  if (
    phoneDigits.length < rule.minLength ||
    phoneDigits.length > rule.maxLength
  ) {
    return false;
  }

  return rule.regex.test(phoneDigits);
};

export const buildE164PhoneNumber = (
  countryCode: string,
  phoneDigits: string,
): string => {
  return `${countryCode}${phoneDigits}`;
};

export const maskPhoneNumber = (
  countryCode: string,
  phoneDigits: string,
): string => {
  if (phoneDigits.length <= 4) {
    return `${countryCode} ${phoneDigits}`;
  }

  const lastFourDigits = phoneDigits.slice(-4);
  const maskedPrefix = phoneDigits.slice(0, -4).replace(/\d/g, "x");

  return `${countryCode} ${maskedPrefix}${lastFourDigits}`;
};
