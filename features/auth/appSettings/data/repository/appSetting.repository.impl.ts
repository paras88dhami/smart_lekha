import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import type { AppSettingDataSource } from "../dataSource/appSetting.dataSource";
import type { AppSettingModel } from "../dataSource/appSetting.model";
import type { AppSettingRepository } from "./appSetting.repository";

const createFailureResult = <T>(): AuthResult<T> => {
  return { success: false, error: AuthDatabaseError };
};

export const createAppSettingRepository = (
  localDataSource: AppSettingDataSource,
): AppSettingRepository => ({
  async getAppSetting(): Promise<AuthResult<AppSettingModel | null>> {
    const result = await localDataSource.getAppSetting();

    if (!result.success) {
      return createFailureResult<AppSettingModel | null>();
    }

    return { success: true, value: result.value };
  },

  async createDefaultAppSetting(): Promise<AuthResult<AppSettingModel>> {
    const result = await localDataSource.createDefaultAppSetting();

    if (!result.success) {
      return createFailureResult<AppSettingModel>();
    }

    return { success: true, value: result.value };
  },

  async updateSelectedLanguage(
    languageCode: LanguageCodeType,
  ): Promise<AuthResult<void>> {
    const result = await localDataSource.updateSelectedLanguage(languageCode);

    if (!result.success) {
      return createFailureResult<void>();
    }

    return { success: true, value: undefined };
  },
});
