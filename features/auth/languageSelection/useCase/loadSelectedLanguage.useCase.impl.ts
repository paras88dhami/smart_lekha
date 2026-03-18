import {
  InvalidLanguageCodeError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";
import type { LanguageCodeType } from "../types/types";
import type { LoadSelectedLanguageUseCase } from "./loadSelectedLanguage.useCase";

const DEFAULT_LANGUAGE_CODE: LanguageCodeType = "en";

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

      return {
        success: true,
        value: DEFAULT_LANGUAGE_CODE,
      };
    }

    const selectedLanguage =
      appSettingResult.value.selectedLanguage ?? DEFAULT_LANGUAGE_CODE;

    if (!isLanguageCode(selectedLanguage)) {
      return {
        success: false,
        error: InvalidLanguageCodeError,
      };
    }

    return {
      success: true,
      value: selectedLanguage,
    };
  },
});
