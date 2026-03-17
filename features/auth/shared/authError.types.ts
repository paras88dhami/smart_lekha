import { Result } from "@/shared/types/result.types";

export type AuthError = {
  type: string;
  message: string;
};

export const AuthErrorType = {
  DatabaseError: "DATABASE_ERROR",
  AppSettingNotFound: "APP_SETTING_NOT_FOUND",
  AuthSessionNotFound: "AUTH_SESSION_NOT_FOUND",
  ProfileNotFound: "PROFILE_NOT_FOUND",
  BusinessProfileNotFound: "BUSINESS_PROFILE_NOT_FOUND",
  BusinessCategoryNotFound: "BUSINESS_CATEGORY_NOT_FOUND",
  OtpRequestNotFound: "OTP_REQUEST_NOT_FOUND",
  OtpExpired: "OTP_EXPIRED",
  OtpInvalid: "OTP_INVALID",
  BootstrapFailed: "BOOTSTRAP_FAILED",
} as const;

export const AuthDatabaseError: AuthError = {
  type: AuthErrorType.DatabaseError,
  message: "An error occurred while accessing the auth database.",
} as const;

export const AppSettingNotFoundError: AuthError = {
  type: AuthErrorType.AppSettingNotFound,
  message: "The requested app setting was not found.",
} as const;

export const AuthSessionNotFoundError: AuthError = {
  type: AuthErrorType.AuthSessionNotFound,
  message: "The current auth session was not found.",
} as const;

export const ProfileNotFoundError: AuthError = {
  type: AuthErrorType.ProfileNotFound,
  message: "The requested profile was not found.",
} as const;

export const BusinessProfileNotFoundError: AuthError = {
  type: AuthErrorType.BusinessProfileNotFound,
  message: "The requested business profile was not found.",
} as const;

export const BusinessCategoryNotFoundError: AuthError = {
  type: AuthErrorType.BusinessCategoryNotFound,
  message: "The requested business category was not found.",
} as const;

export const OtpRequestNotFoundError: AuthError = {
  type: AuthErrorType.OtpRequestNotFound,
  message: "The OTP request was not found.",
} as const;

export const OtpExpiredError: AuthError = {
  type: AuthErrorType.OtpExpired,
  message: "The OTP has expired. Please request a new one.",
} as const;

export const OtpInvalidError: AuthError = {
  type: AuthErrorType.OtpInvalid,
  message: "The OTP you entered is invalid.",
} as const;

export const AuthBootstrapFailedError: AuthError = {
  type: AuthErrorType.BootstrapFailed,
  message: "Failed to prepare the auth bootstrap state.",
} as const;

export type AppSettingResult<T> = Result<T, AuthError>;
export type AuthSessionResult<T> = Result<T, AuthError>;
export type ProfileResult<T> = Result<T, AuthError>;
export type BusinessProfileResult<T> = Result<T, AuthError>;
export type BusinessCategoryResult<T> = Result<T, AuthError>;
export type OtpRequestResult<T> = Result<T, AuthError>;
export type AuthBootstrapResult<T> = Result<T, AuthError>;
