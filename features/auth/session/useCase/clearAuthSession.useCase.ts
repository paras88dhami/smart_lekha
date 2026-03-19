import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface ClearAuthSessionUseCase {
  execute(): Promise<AuthResult<void>>;
}
