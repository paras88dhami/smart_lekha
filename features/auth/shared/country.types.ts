export const CountryIso = {
  Nepal: "NP",
  India: "IN",
} as const;

export type CountryIsoType = (typeof CountryIso)[keyof typeof CountryIso];

export const isCountryIso = (value: string): value is CountryIsoType => {
  return value === CountryIso.Nepal || value === CountryIso.India;
};
