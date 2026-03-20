import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface ClearActiveProfileIdUseCase {
  execute(): Promise<AuthResult<void>>;
}
