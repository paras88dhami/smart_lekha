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
    const result = await localDataSource.getCurrentSession();

    if (!result.success) {
      return createDatabaseFailure<AuthSessionModel | null>();
    }

    return {
      success: true,
      value: result.value,
    };
  },

  async upsertSession(
    input: UpsertAuthSessionRepositoryInput,
  ): Promise<AuthResult<AuthSessionModel>> {
    const mappedPayload: AuthSessionModel = {
      accountId: input.accountId?.trim() || null,
      phoneNumber: input.phoneNumber.trim(),
      countryCode: input.countryCode.trim(),
      countryIso: input.countryIso.trim(),
      isVerified: input.isVerified,
      isLoggedIn: input.isLoggedIn,
      accessToken: input.accessToken?.trim() ?? null,
      refreshToken: input.refreshToken?.trim() ?? null,
    } as AuthSessionModel;

    const result = await localDataSource.upsertSession(mappedPayload);

    if (!result.success) {
      return createDatabaseFailure<AuthSessionModel>();
    }

    return {
      success: true,
      value: result.value,
    };
  },

  async clearSession(): Promise<AuthResult<void>> {
    const result = await localDataSource.clearSession();

    if (!result.success) {
      return createDatabaseFailure<void>();
    }

    return {
      success: true,
      value: undefined,
    };
  },
});