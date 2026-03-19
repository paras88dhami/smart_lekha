import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { AuthSessionDataSource } from "../dataSource/authSession.datasource";
import type { AuthSessionModel } from "../dataSource/authSession.model";
import type {
  AuthSessionRepository,
  UpsertAuthSessionRepositoryInput,
} from "./authSession.repository";

const createDatabaseFailure = <T>(): AuthResult<T> => {
  return {
    success: false,
    error: AuthDatabaseError,
  };
};

export const createAuthSessionRepository = (
  localDataSource: AuthSessionDataSource,
): AuthSessionRepository => ({
  async getCurrentSession(): Promise<AuthResult<AuthSessionModel | null>> {
    try {
      const session = await localDataSource.getCurrentSession();

      return {
        success: true,
        value: session,
      };
    } catch {
      return createDatabaseFailure<AuthSessionModel | null>();
    }
  },

  async upsertSession(
    input: UpsertAuthSessionRepositoryInput,
  ): Promise<AuthResult<AuthSessionModel>> {
    try {
      const session = await localDataSource.upsertSession({
        accountId: input.accountId?.trim() || null,
        phoneNumber: input.phoneNumber.trim(),
        countryCode: input.countryCode.trim(),
        countryIso: input.countryIso.trim(),
        isVerified: input.isVerified,
        isLoggedIn: input.isLoggedIn,
        accessToken: input.accessToken?.trim() ?? null,
        refreshToken: input.refreshToken?.trim() ?? null,
      });

      return {
        success: true,
        value: session,
      };
    } catch {
      return createDatabaseFailure<AuthSessionModel>();
    }
  },

  async clearSession(): Promise<AuthResult<void>> {
    try {
      await localDataSource.clearSession();

      return {
        success: true,
        value: undefined,
      };
    } catch {
      return createDatabaseFailure<void>();
    }
  },
});
