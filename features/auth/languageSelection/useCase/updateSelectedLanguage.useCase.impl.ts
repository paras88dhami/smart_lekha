import type { AppSettingRepository } from "../../appSettings/data/repository/appSetting.repository";
import { AuthResult } from "../types/types";
import type {
  UpdateSelectedLanguageInput,
  UpdateSelectedLanguageUseCase,
} from "./updateSelectedLanguage.useCase";

export const createUpdateSelectedLanguageUseCase = (
  repository: AppSettingRepository,
): UpdateSelectedLanguageUseCase => ({
  async execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>> {
    return repository.updateSelectedLanguage(input.languageCode);
  },
});
