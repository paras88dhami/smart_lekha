import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { SetActiveProfileIdUseCase } from "./setActiveProfileId.useCase";

export const createSetActiveProfileIdUseCase = (
  repository: AppSettingRepository,
): SetActiveProfileIdUseCase => ({
  async execute(profileId: string): Promise<AuthResult<void>> {
    return repository.setActiveProfileId(profileId);
  },
});
