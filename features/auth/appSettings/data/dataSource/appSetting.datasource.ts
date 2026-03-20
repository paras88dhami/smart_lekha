import type { Result } from "@/shared/types/result.types";
import type { AppSettingModel } from "./appSetting.model";

export interface AppSettingDataSource {
  getAppSetting(): Promise<Result<AppSettingModel | null>>;
  createDefaultAppSetting(): Promise<Result<AppSettingModel>>;
  updateSelectedLanguage(languageCode: string): Promise<Result<void>>;
  completeOnboarding(): Promise<Result<void>>;
  setActiveProfileId(profileId: string): Promise<Result<void>>;
  clearActiveProfileId(): Promise<Result<void>>;
  setActiveAccountId(accountId: string): Promise<Result<void>>;
  clearActiveAccountId(): Promise<Result<void>>;
  updateLastSelectedCountryIso(countryIso: string): Promise<Result<void>>;
}
