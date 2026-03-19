import type { Result } from "@/shared/types/result.types";
import type { CountryIsoType } from "../../../shared/country.types";
import type { LanguageCodeType } from "../../../languageSelection/types/types";

export type OtpRemoteErrorCode =
  | "INVALID_PHONE"
  | "INVALID_OTP"
  | "OTP_EXPIRED"
  | "OTP_REQUEST_NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "SERVICE_NOT_CONFIGURED"
  | "UNKNOWN";

export type OtpRemoteError = {
  code: OtpRemoteErrorCode;
  message: string;
  status?: number;
};

export type RequestOtpRemoteInput = {
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
};

export type RequestOtpRemoteOutput = {
  otpReferenceId: string;
  expiresAt: number;
  resendAfterSeconds: number;
  isExistingUser: boolean;
};

export type VerifyOtpRemoteInput = {
  otpReferenceId: string;
  otpCode: string;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
};

export type VerifyOtpRemoteOutput = {
  accountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  isExistingUser: boolean;
};

export interface OtpAuthRemoteDataSource {
  requestOtp(
    input: RequestOtpRemoteInput,
  ): Promise<Result<RequestOtpRemoteOutput, OtpRemoteError>>;
  verifyOtp(
    input: VerifyOtpRemoteInput,
  ): Promise<Result<VerifyOtpRemoteOutput, OtpRemoteError>>;
}
