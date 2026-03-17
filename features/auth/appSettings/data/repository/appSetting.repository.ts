import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import type { AppSettingModel } from "../dataSource/appSetting.model";

export interface AppSettingRepository {
  getAppSetting(): Promise<AuthResult<AppSettingModel | null>>;
  createDefaultAppSetting(): Promise<AuthResult<AppSettingModel>>;
  updateSelectedLanguage(
    languageCode: LanguageCodeType,
  ): Promise<AuthResult<void>>;
}
