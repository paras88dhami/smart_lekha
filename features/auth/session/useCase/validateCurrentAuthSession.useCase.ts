import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../data/dataSource/authSession.model";

export interface ValidateCurrentAuthSessionUseCase {
  execute(): Promise<AuthResult<AuthSessionModel | null>>;
}
