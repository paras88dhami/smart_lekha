import type { AuthResult } from "@/features/auth/shared/authError.types";

export interface CompleteOnboardingUseCase {
  execute(): Promise<AuthResult<void>>;
}
