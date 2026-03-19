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
  phoneNumber: string;
  countryIso: CountryIsoType;
  countryCode: string;
  languageCode: LanguageCodeType;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAfterSeconds: number;
  isExistingUser: boolean;
};

export type PhoneEntryState = {
  status: StatusType;
  phoneNumber: string;
  selectedCountryIso: CountryIsoType;
  selectedLanguageCode: LanguageCodeType;
  countries: CountryOption[];
  canContinueOffline: boolean;
  showOfflineHint: boolean;
  errorMessage: string;
};
