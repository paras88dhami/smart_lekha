import type { Result } from "@/shared/types/result.types";
import type { AppSettingModel } from "./appSetting.model";

export interface AppSettingDataSource {
  getAppSetting(): Promise<Result<AppSettingModel | null>>;
  createDefaultAppSetting(): Promise<Result<AppSettingModel>>;
  updateSelectedLanguage(languageCode: string): Promise<Result<void>>;
}