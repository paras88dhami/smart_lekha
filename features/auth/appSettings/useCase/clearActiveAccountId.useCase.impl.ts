import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { ClearActiveAccountIdUseCase } from "./clearActiveAccountId.useCase";

export const createClearActiveAccountIdUseCase = (
  repository: AppSettingRepository,
): ClearActiveAccountIdUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return repository.clearActiveAccountId();
  },
});
