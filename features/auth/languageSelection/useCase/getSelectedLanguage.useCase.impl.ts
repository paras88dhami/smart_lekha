
import type { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";
import type { GetSelectedLanguageUseCase } from "./getSelectedLanguage.useCase";
import type { LanguageSelectionResult } from "../types/types";
import { AppSettingNotFoundError } from "../../shared/authError.types";

export const createGetSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): GetSelectedLanguageUseCase => ({
  async execute(): Promise<LanguageSelectionResult> {
    const result = await repository.getAppSetting();

    if (!result.success) {
      return { success: false, error: result.error };
    }

    if (!result.value) {
      return { success: false, error: AppSettingNotFoundError };
    }

    return {
      success: true,
      value: (result.value.selectedLanguage ?? "en") as any,
    };
  },
});
