import type { AuthResult } from "@/features/auth/shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";
import { AppSettingRepository } from "../data/repository/appSetting.repository";

export interface GetAppSettingUseCase {
  execute(): Promise<AuthResult<AppSettingModel | null>>;
}

export const createGetAppSettingUseCase = (
  repository: AppSettingRepository,
): GetAppSettingUseCase => ({
  async execute(): Promise<AuthResult<AppSettingModel | null>> {
    return repository.getAppSetting();
  },
});