import type { CountryIsoType } from "../../shared/country.types";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import type { StatusType } from "@/shared/types/status.types";

export type OtpVerificationState = {
  status: StatusType;
  otpCode: string;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
  isExistingUser: boolean;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAvailableAt: number;
  secondsUntilResend: number;
  errorMessage: string;
};

export type OtpVerificationResult = {
  accountId: string;
  isExistingUser: boolean;
};
