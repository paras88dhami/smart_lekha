import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import type { CountryIsoType } from "@/features/auth/shared/country.types";
import type { AppSettingModel } from "../dataSource/appSetting.model";

export interface AppSettingRepository {
  getAppSetting(): Promise<AuthResult<AppSettingModel | null>>;
  createDefaultAppSetting(): Promise<AuthResult<AppSettingModel>>;
  updateSelectedLanguage(
    languageCode: LanguageCodeType,
  ): Promise<AuthResult<void>>;
  completeOnboarding(): Promise<AuthResult<void>>;
  setActiveProfileId(profileId: string): Promise<AuthResult<void>>;
  clearActiveProfileId(): Promise<AuthResult<void>>;
  setActiveAccountId(accountId: string): Promise<AuthResult<void>>;
  clearActiveAccountId(): Promise<AuthResult<void>>;
  updateLastSelectedCountryIso(countryIso: CountryIsoType): Promise<AuthResult<void>>;
}
