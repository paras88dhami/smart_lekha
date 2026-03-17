import { AppSettingModel } from "./appSetting.model";

export interface AppSettingDataSource {
  getBootstrapSetting(): Promise<AppSettingModel | null>;
  createDefaultSetting(): Promise<AppSettingModel>;
  updateLanguage(languageCode: string): Promise<void>;
  completeOnboarding(): Promise<void>;
  setActiveProfile(profileId: string | null): Promise<void>;
  setLastSelectedCountry(countryIso: string): Promise<void>;
}
