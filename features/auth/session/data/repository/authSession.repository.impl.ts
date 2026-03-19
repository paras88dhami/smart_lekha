import {
  AuthDatabaseError,
  AuthServiceNotConfiguredError,
  AuthServiceUnavailableError,
  type AuthError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import { createRemoteAuthSessionDataSource } from "../dataSource/remoteAuthSession.dataSource.impl";
import { createSecureAuthTokenDataSource } from "../dataSource/secureAuthToken.dataSource.impl";
import type { AuthSessionDataSource } from "../dataSource/authSession.datasource";
import type { AuthSessionModel } from "../dataSource/authSession.model";
import type {
  AuthSessionRepository,
  UpsertAuthSessionRepositoryInput,
} from "./authSession.repository";

const createFailure = <T>(error: AuthError): AuthResult<T> => {
  return {
    success: false,
    error,
  };
};

const mapRemoteErrorToAuthError = (errorCode: string): AuthError => {
  if (errorCode === "SERVICE_NOT_CONFIGURED") {
    return AuthServiceNotConfiguredError;
  }

  return AuthServiceUnavailableError;
};

const toSessionPayload = (
  input: UpsertAuthSessionRepositoryInput,
): AuthSessionModel => {
  return {
    accountId: input.accountId?.trim() || null,
    phoneNumber: input.phoneNumber.trim(),
    countryCode: input.countryCode.trim(),
    countryIso: input.countryIso.trim(),
    isVerified: input.isVerified,
    isLoggedIn: input.isLoggedIn,
    accessToken: null,
    refreshToken: null,
  } as AuthSessionModel;
};

const isAuthDevRefreshBypassEnabled = (): boolean => {
  const processObject = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process;
  const rawValue = processObject?.env?.EXPO_PUBLIC_AUTH_DEV_BYPASS_REFRESH ?? "";

  return __DEV__ && rawValue.trim().toLowerCase() === "true";
};

export const createAuthSessionRepository = (
  localDataSource: AuthSessionDataSource,
): AuthSessionRepository => {
  const tokenDataSource = createSecureAuthTokenDataSource();
  const remoteDataSource = createRemoteAuthSessionDataSource();

  const clearLocalAndSecureSession = async (): Promise<boolean> => {
    const [localClearResult, tokenClearResult] = await Promise.all([
      localDataSource.clearSession(),
      tokenDataSource.clearTokens(),
    ]);

    return localClearResult.success && tokenClearResult.success;
  };

  const persistLocalSession = async (
    input: UpsertAuthSessionRepositoryInput,
  ): Promise<AuthResult<AuthSessionModel>> => {
    const localResult = await localDataSource.upsertSession(toSessionPayload(input));

    if (!localResult.success) {
      return createFailure<AuthSessionModel>(AuthDatabaseError);
    }

    return {
      success: true,
      value: localResult.value,
    };
  };

  return {
    async getCurrentSession(): Promise<AuthResult<AuthSessionModel | null>> {
      const result = await localDataSource.getCurrentSession();

      if (!result.success) {
        return createFailure<AuthSessionModel | null>(AuthDatabaseError);
      }

      return {
        success: true,
        value: result.value,
      };
    },

    async validateCurrentSession(): Promise<AuthResult<AuthSessionModel | null>> {
      const localSessionResult = await localDataSource.getCurrentSession();

      if (!localSessionResult.success) {
        return createFailure<AuthSessionModel | null>(AuthDatabaseError);
      }

      const localSession = localSessionResult.value;

      if (
        !localSession ||
        !localSession.isLoggedIn ||
        !localSession.isVerified ||
        !localSession.accountId
      ) {
        return {
          success: true,
          value: null,
        };
      }

      const tokenResult = await tokenDataSource.getTokens();

      if (!tokenResult.success) {
        return createFailure<AuthSessionModel | null>(AuthDatabaseError);
      }

      let accessToken = tokenResult.value?.accessToken?.trim() ?? "";
      let refreshToken = tokenResult.value?.refreshToken?.trim() ?? "";

      if (!refreshToken) {
        const legacyRefreshToken = localSession.refreshToken?.trim() ?? "";
        const legacyAccessToken = localSession.accessToken?.trim() ?? "";

        if (legacyRefreshToken) {
          const migrateTokensResult = await tokenDataSource.setTokens({
            accessToken: legacyAccessToken || null,
            refreshToken: legacyRefreshToken,
          });

          if (!migrateTokensResult.success) {
            return createFailure<AuthSessionModel | null>(AuthDatabaseError);
          }

          const migrateSessionResult = await persistLocalSession({
            accountId: localSession.accountId,
            phoneNumber: localSession.phoneNumber ?? "",
            countryCode: localSession.countryCode ?? "",
            countryIso: localSession.countryIso ?? "",
            isLoggedIn: Boolean(localSession.isLoggedIn),
            isVerified: Boolean(localSession.isVerified),
            accessToken: null,
            refreshToken: null,
          });

          if (!migrateSessionResult.success) {
            return createFailure<AuthSessionModel | null>(AuthDatabaseError);
          }

          accessToken = legacyAccessToken;
          refreshToken = legacyRefreshToken;
        }
      }

      if (!refreshToken) {
        await clearLocalAndSecureSession();

        return {
          success: true,
          value: null,
        };
      }

      const remoteRefreshResult = await remoteDataSource.refreshSession({
        refreshToken,
      });

      if (!remoteRefreshResult.success) {
        if (remoteRefreshResult.error.code === "UNAUTHORIZED") {
          await clearLocalAndSecureSession();

          return {
            success: true,
            value: null,
          };
        }

        if (isAuthDevRefreshBypassEnabled()) {
          return {
            success: true,
            value: localSession,
          };
        }

        return createFailure<AuthSessionModel | null>(
          mapRemoteErrorToAuthError(remoteRefreshResult.error.code),
        );
      }

      const resolvedAccountId =
        remoteRefreshResult.value.accountId.trim() || localSession.accountId || null;

      if (!resolvedAccountId) {
        await clearLocalAndSecureSession();

        return {
          success: true,
          value: null,
        };
      }

      if (
        localSession.accountId &&
        remoteRefreshResult.value.accountId &&
        localSession.accountId !== remoteRefreshResult.value.accountId
      ) {
        await clearLocalAndSecureSession();

        return {
          success: true,
          value: null,
        };
      }

      const upsertResult = await persistLocalSession({
        accountId: resolvedAccountId,
        phoneNumber: localSession.phoneNumber ?? "",
        countryCode: localSession.countryCode ?? "",
        countryIso: localSession.countryIso ?? "",
        isVerified: true,
        isLoggedIn: true,
        accessToken: null,
        refreshToken: null,
      });

      if (!upsertResult.success) {
        return createFailure<AuthSessionModel | null>(AuthDatabaseError);
      }

      const persistTokensResult = await tokenDataSource.setTokens({
        accessToken: remoteRefreshResult.value.accessToken || accessToken || null,
        refreshToken: remoteRefreshResult.value.refreshToken || refreshToken,
      });

      if (!persistTokensResult.success) {
        await clearLocalAndSecureSession();
        return createFailure<AuthSessionModel | null>(AuthDatabaseError);
      }

      return {
        success: true,
        value: upsertResult.value,
      };
    },

    async upsertSession(
      input: UpsertAuthSessionRepositoryInput,
    ): Promise<AuthResult<AuthSessionModel>> {
      const result = await persistLocalSession(input);

      if (!result.success) {
        return createFailure<AuthSessionModel>(AuthDatabaseError);
      }

      const persistTokensResult = await tokenDataSource.setTokens({
        accessToken: input.accessToken?.trim() ?? null,
        refreshToken: input.refreshToken?.trim() ?? null,
      });

      if (!persistTokensResult.success) {
        await clearLocalAndSecureSession();
        return createFailure<AuthSessionModel>(AuthDatabaseError);
      }

      return {
        success: true,
        value: result.value,
      };
    },

    async clearSession(): Promise<AuthResult<void>> {
      const isCleared = await clearLocalAndSecureSession();

      if (!isCleared) {
        return createFailure<void>(AuthDatabaseError);
      }

      return {
        success: true,
        value: undefined,
      };
    },
  };
};
