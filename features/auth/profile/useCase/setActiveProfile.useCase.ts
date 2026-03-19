import type { AuthResult } from "../../shared/authError.types";

export interface SetActiveProfileUseCase {
  execute(profileId: string): Promise<AuthResult<void>>;
}
