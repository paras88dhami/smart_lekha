import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";
import type { PersistSelectedLanguageInput } from "../types/types";
import type { PersistSelectedLanguageUseCase } from "./persistSelectedLanguage.useCase";

export const createPersistSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): PersistSelectedLanguageUseCase => ({
  async execute(
    input: PersistSelectedLanguageInput,
  ): Promise<AuthResult<void>> {
    return repository.updateSelectedLanguage(input.languageCode);
  },
});
