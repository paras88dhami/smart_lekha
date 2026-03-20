import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface ClearActiveAccountIdUseCase {
  execute(): Promise<AuthResult<void>>;
}
