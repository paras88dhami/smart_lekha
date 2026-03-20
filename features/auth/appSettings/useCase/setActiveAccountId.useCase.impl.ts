import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { SetActiveAccountIdUseCase } from "./setActiveAccountId.useCase";

export const createSetActiveAccountIdUseCase = (
  repository: AppSettingRepository,
): SetActiveAccountIdUseCase => ({
  async execute(accountId: string): Promise<AuthResult<void>> {
    return repository.setActiveAccountId(accountId);
  },
});
