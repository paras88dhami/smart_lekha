import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { ClearActiveProfileIdUseCase } from "./clearActiveProfileId.useCase";

export const createClearActiveProfileIdUseCase = (
  repository: AppSettingRepository,
): ClearActiveProfileIdUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return repository.clearActiveProfileId();
  },
});
