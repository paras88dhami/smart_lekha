import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface LogoutFromFeatureHubUseCase {
  execute(): Promise<AuthResult<void>>;
}
