import type { Result } from "@/shared/types/result.types";

export type AuthError = {
  type: string;
  message: string;
};

export const AuthErrorType = {
  DatabaseError: "DATABASE_ERROR",
  AppSettingNotFound: "APP_SETTING_NOT_FOUND",
  InvalidLanguageCode: "INVALID_LANGUAGE_CODE",
  ProfileNotFound: "PROFILE_NOT_FOUND",
  InvalidPhoneNumber: "INVALID_PHONE_NUMBER",
  OtpRequestNotFound: "OTP_REQUEST_NOT_FOUND",
  OtpInvalidCode: "OTP_INVALID_CODE",
  OtpExpired: "OTP_EXPIRED",
  OtpRateLimited: "OTP_RATE_LIMITED",
  AuthServiceUnavailable: "AUTH_SERVICE_UNAVAILABLE",
  AuthServiceNotConfigured: "AUTH_SERVICE_NOT_CONFIGURED",
} as const;

export const AuthDatabaseError: AuthError = {
  type: AuthErrorType.DatabaseError,
  message: "An error occurred while accessing auth data.",
};

export const AppSettingNotFoundError: AuthError = {
  type: AuthErrorType.AppSettingNotFound,
  message: "App setting was not found.",
};

export const InvalidLanguageCodeError: AuthError = {
  type: AuthErrorType.InvalidLanguageCode,
  message: "The selected language code is invalid.",
};

export const ProfileNotFoundError: AuthError = {
  type: AuthErrorType.ProfileNotFound,
  message: "The requested profile was not found.",
};

export const InvalidPhoneNumberError: AuthError = {
  type: AuthErrorType.InvalidPhoneNumber,
  message: "The phone number format is invalid for the selected country.",
};

export const OtpRequestNotFoundError: AuthError = {
  type: AuthErrorType.OtpRequestNotFound,
  message: "The OTP request was not found.",
};

export const OtpInvalidCodeError: AuthError = {
  type: AuthErrorType.OtpInvalidCode,
  message: "The OTP you entered is invalid.",
};

export const OtpExpiredError: AuthError = {
  type: AuthErrorType.OtpExpired,
  message: "OTP expired. Please request a new code.",
};

export const OtpRateLimitedError: AuthError = {
  type: AuthErrorType.OtpRateLimited,
  message: "Too many OTP attempts. Please wait and try again.",
};

export const AuthServiceUnavailableError: AuthError = {
  type: AuthErrorType.AuthServiceUnavailable,
  message: "Auth service is unavailable. Please try again.",
};

export const AuthServiceNotConfiguredError: AuthError = {
  type: AuthErrorType.AuthServiceNotConfigured,
  message: "Auth service URL is not configured.",
};

export type AuthResult<T> = Result<T, AuthError>;
