import { LanguageCodeType } from "../../languageSelection/types/types";
import { CountryIsoType } from "../../shared/country.types";

export type UpdateSelectedLanguageInput = {
  languageCode: LanguageCodeType;
};

export type UpdateLastSelectedCountryInput = {
  countryIso: CountryIsoType;
};
