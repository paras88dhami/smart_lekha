import type { Result } from "@/shared/types/result.types";
import type { AuthSessionModel } from "./authSession.model";

export interface AuthSessionDataSource {
  getCurrentSession(): Promise<Result<AuthSessionModel | null>>;
  upsertSession(payload: AuthSessionModel): Promise<Result<AuthSessionModel>>;
  clearSession(): Promise<Result<void>>;
}