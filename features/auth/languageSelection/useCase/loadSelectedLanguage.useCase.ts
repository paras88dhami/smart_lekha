import {
  InvalidLanguageCodeError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "../types/types";
import { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";

export interface LoadSelectedLanguageUseCase {
  execute(): Promise<AuthResult<LanguageCodeType>>;
}

const isLanguageCode = (
  languageCode: string,
): languageCode is LanguageCodeType => {
  return (
    languageCode === "en" || languageCode === "ne" || languageCode === "hi"
  );
};

export const createLoadSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): LoadSelectedLanguageUseCase => ({
  async execute(): Promise<AuthResult<LanguageCodeType>> {
    const appSettingResult = await repository.getAppSetting();

    if (!appSettingResult.success) {
      return appSettingResult;
    }

    if (!appSettingResult.value) {
      const createdResult = await repository.createDefaultAppSetting();

      if (!createdResult.success) {
        return createdResult;
      }

      return { success: true, value: "en" };
    }

    const selectedLanguage = appSettingResult.value.selectedLanguage ?? "en";

    if (!isLanguageCode(selectedLanguage)) {
      return { success: false, error: InvalidLanguageCodeError };
    }

    return { success: true, value: selectedLanguage };
  },
});
