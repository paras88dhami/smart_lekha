import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface SetActiveAccountIdUseCase {
  execute(accountId: string): Promise<AuthResult<void>>;
}
