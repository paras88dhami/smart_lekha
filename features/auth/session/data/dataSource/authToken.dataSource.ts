import type { Result } from "@/shared/types/result.types";

export type AuthTokenModel = {
  accessToken: string | null;
  refreshToken: string | null;
};

export interface AuthTokenDataSource {
  getTokens(): Promise<Result<AuthTokenModel | null>>;
  setTokens(tokens: AuthTokenModel): Promise<Result<void>>;
  clearTokens(): Promise<Result<void>>;
}
