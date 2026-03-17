import type { Result } from "@/shared/types/result.types";

export type AuthError = {
  type: string;
  message: string;
};

export const AuthErrorType = {
  DatabaseError: "DATABASE_ERROR",
  AppSettingNotFound: "APP_SETTING_NOT_FOUND",
  InvalidLanguageCode: "INVALID_LANGUAGE_CODE",
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

export type AuthResult<T> = Result<T, AuthError>;