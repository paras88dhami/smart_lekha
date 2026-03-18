import type { AuthResult } from "@/features/auth/shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";
import { AppSettingRepository } from "../data/repository/appSetting.repository";
import { CreateDefaultAppSettingUseCase } from "./createDefaultAppSetting.useCase";

export const createDefaultAppSettingUseCase = (
  repository: AppSettingRepository,
): CreateDefaultAppSettingUseCase => ({
  async execute(): Promise<AuthResult<AppSettingModel>> {
    return repository.createDefaultAppSetting();
  },
});
