import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import { AppSettingRepository } from "../data/repository/appSetting.repository";
export type UpdateSelectedLanguageInput = {
  languageCode: LanguageCodeType;
};

export interface UpdateSelectedLanguageUseCase {
  execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>>;
}

export const createUpdateSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): UpdateSelectedLanguageUseCase => ({
  async execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>> {
    return repository.updateSelectedLanguage(input.languageCode);
  },
});
