import { translate } from "@/shared/i18n/resources";
import { AuthErrorType, type AuthError } from "./authError.types";

const AUTH_ERROR_KEY_MAP: Record<string, string> = {
  [AuthErrorType.DatabaseError]: "errors.auth.database",
  [AuthErrorType.AppSettingNotFound]: "errors.auth.appSettingNotFound",
  [AuthErrorType.InvalidLanguageCode]: "errors.auth.invalidLanguageCode",
  [AuthErrorType.ProfileNotFound]: "errors.auth.profileNotFound",
  [AuthErrorType.InvalidPhoneNumber]: "errors.auth.invalidPhoneNumber",
  [AuthErrorType.OtpRequestNotFound]: "errors.auth.otpRequestNotFound",
  [AuthErrorType.OtpInvalidCode]: "errors.auth.otpInvalidCode",
  [AuthErrorType.OtpExpired]: "errors.auth.otpExpired",
  [AuthErrorType.OtpRateLimited]: "errors.auth.otpRateLimited",
  [AuthErrorType.AuthServiceUnavailable]: "errors.auth.authServiceUnavailable",
  [AuthErrorType.AuthServiceNotConfigured]:
    "errors.auth.authServiceNotConfigured",
};

export const getAuthErrorMessage = (error: AuthError): string => {
  const translationKey =
    AUTH_ERROR_KEY_MAP[error.type] ?? "errors.auth.fallback";
  const translatedMessage = translate(translationKey);

  if (translatedMessage !== translationKey) {
    return translatedMessage;
  }

  return error.message;
};
