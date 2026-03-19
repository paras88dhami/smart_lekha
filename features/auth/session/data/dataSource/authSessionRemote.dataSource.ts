import type { Result } from "@/shared/types/result.types";

export type AuthSessionRemoteErrorCode =
  | "UNAUTHORIZED"
  | "SERVICE_UNAVAILABLE"
  | "SERVICE_NOT_CONFIGURED"
  | "UNKNOWN";

export type AuthSessionRemoteError = {
  code: AuthSessionRemoteErrorCode;
  message: string;
  status?: number;
};

export type RefreshSessionRemoteInput = {
  refreshToken: string;
};

export type RefreshSessionRemoteOutput = {
  accountId: string;
  accessToken: string;
  refreshToken: string;
};

export interface AuthSessionRemoteDataSource {
  refreshSession(
    input: RefreshSessionRemoteInput,
  ): Promise<Result<RefreshSessionRemoteOutput, AuthSessionRemoteError>>;
}
