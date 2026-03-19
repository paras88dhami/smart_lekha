import type { StatusType } from "@/shared/types/status.types";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import type { CountryIsoType } from "../../shared/country.types";

export type CountryOption = {
  iso: CountryIsoType;
  name: string;
  callingCode: string;
  flag: string;
};

export type PhoneEntrySubmitInput = {
  accountId: string;
  phoneNumber: string;
  countryIso: CountryIsoType;
  countryCode: string;
  languageCode: LanguageCodeType;
};

export type PhoneEntryState = {
  status: StatusType;
  phoneNumber: string;
  selectedCountryIso: CountryIsoType;
  selectedLanguageCode: LanguageCodeType;
  countries: CountryOption[];
  errorMessage: string;
};
