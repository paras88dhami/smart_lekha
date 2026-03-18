import type { AuthResult } from "@/features/auth/shared/authError.types";
import { AppSettingRepository } from "../data/repository/appSetting.repository";
import { UpdateSelectedLanguageInput } from "../types/types";
import { UpdateSelectedLanguageUseCase } from "./updateSelectedLanguage.useCase";

export const createUpdateSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): UpdateSelectedLanguageUseCase => ({
  async execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>> {
    return repository.updateSelectedLanguage(input.languageCode);
  },
});
