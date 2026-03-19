import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../dataSource/authSession.model";

export type UpsertAuthSessionRepositoryInput = {
  accountId: string | null;
  phoneNumber: string;
  countryCode: string;
  countryIso: string;
  isVerified: boolean;
  isLoggedIn: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
};

export interface AuthSessionRepository {
  getCurrentSession(): Promise<AuthResult<AuthSessionModel | null>>;
  upsertSession(
    input: UpsertAuthSessionRepositoryInput,
  ): Promise<AuthResult<AuthSessionModel>>;
  clearSession(): Promise<AuthResult<void>>;
}
