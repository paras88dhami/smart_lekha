import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface SetActiveProfileIdUseCase {
  execute(profileId: string): Promise<AuthResult<void>>;
}
