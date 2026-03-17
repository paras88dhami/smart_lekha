import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { LanguageCodeType } from "../types/types";
import { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";

export type PersistSelectedLanguageInput = {
  languageCode: LanguageCodeType;
};

export interface PersistSelectedLanguageUseCase {
  execute(input: PersistSelectedLanguageInput): Promise<AuthResult<void>>;
}

export const createPersistSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): PersistSelectedLanguageUseCase => ({
  async execute(
    input: PersistSelectedLanguageInput,
  ): Promise<AuthResult<void>> {
    return repository.updateSelectedLanguage(input.languageCode);
  },
});
