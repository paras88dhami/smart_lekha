import type { AppSettingModel } from "../dataSource/appSetting.model";
import type { AuthResult } from "@/features/auth/types/authError.types";

export interface AppSettingRepository {
  getAppSetting(): Promise<AuthResult<AppSettingModel | null>>;
  createDefaultAppSetting(): Promise<AuthResult<AppSettingModel>>;
  updateSelectedLanguage(languageCode: string): Promise<AuthResult<void>>;
}
