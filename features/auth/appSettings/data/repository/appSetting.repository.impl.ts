import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/types/authError.types";
import type { AppSettingDataSource } from "../dataSource/appSetting.dataSource";
import type { AppSettingRepository } from "./appSetting.repository";

export const createAppSettingRepository = (
  local: AppSettingDataSource,
): AppSettingRepository => ({
  async getAppSetting(): Promise<AuthResult<any>> {
    const result = await local.getAppSetting();

    if (result.success) {
      return { success: true, value: result.value };
    }

    return { success: false, error: AuthDatabaseError };
  },

  async createDefaultAppSetting(): Promise<AuthResult<any>> {
    const result = await local.createDefaultAppSetting();

    if (result.success) {
      return { success: true, value: result.value };
    }

    return { success: false, error: AuthDatabaseError };
  },

  async updateSelectedLanguage(languageCode: string): Promise<AuthResult<void>> {
    const trimmedLanguageCode = languageCode.trim();
    const result = await local.updateSelectedLanguage(trimmedLanguageCode);

    if (result.success) {
      return { success: true, value: undefined };
    }

    return { success: false, error: AuthDatabaseError };
  },
});
