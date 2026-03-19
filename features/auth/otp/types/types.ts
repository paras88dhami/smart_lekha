import type { CountryIsoType } from "../../shared/country.types";
import type { LanguageCodeType } from "../../languageSelection/types/types";

export type RequestOtpInput = {
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
};

export type RequestOtpResult = {
  otpReferenceId: string;
  expiresAt: number;
  resendAfterSeconds: number;
  isExistingUser: boolean;
};

export type VerifyOtpInput = {
  otpReferenceId: string;
  otpCode: string;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
};

export type VerifyOtpResult = {
  accountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  isExistingUser: boolean;
};
