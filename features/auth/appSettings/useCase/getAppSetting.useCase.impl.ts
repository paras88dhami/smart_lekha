import type { AuthResult } from "@/features/auth/shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";
import { AppSettingRepository } from "../data/repository/appSetting.repository";
import { GetAppSettingUseCase } from "./getAppSetting.useCase";

export const createGetAppSettingUseCase = (
  repository: AppSettingRepository,
): GetAppSettingUseCase => ({
  async execute(): Promise<AuthResult<AppSettingModel | null>> {
    return repository.getAppSetting();
  },
});
