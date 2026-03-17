import type { AuthResult } from "@/features/auth/shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";
import { AppSettingRepository } from "../data/repository/appSetting.repository";

export interface CreateDefaultAppSettingUseCase {
  execute(): Promise<AuthResult<AppSettingModel>>;
}

export const createDefaultAppSettingUseCase = (
  repository: AppSettingRepository,
): CreateDefaultAppSettingUseCase => ({
  async execute(): Promise<AuthResult<AppSettingModel>> {
    return repository.createDefaultAppSetting();
  },
});
