import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { CompleteOnboardingUseCase } from "./completeOnboarding.useCase";

export const createCompleteOnboardingUseCase = (
  repository: AppSettingRepository,
): CompleteOnboardingUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return repository.completeOnboarding();
  },
});
