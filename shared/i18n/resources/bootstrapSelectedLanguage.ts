import { createLocalAppSettingDataSource } from "@/features/auth/appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "@/features/auth/appSettings/data/repository/appSetting.repository.impl";
import { createLoadSelectedLanguageUseCase } from "@/features/auth/languageSelection/useCase/loadSelectedLanguage.useCase.impl";
import { database } from "@/src/database/database";
import { changeLanguage } from "./i18n";

export const bootstrapSelectedLanguage = async (): Promise<void> => {
  const appSettingDataSource = createLocalAppSettingDataSource(database);
  const appSettingRepository = createAppSettingRepository(appSettingDataSource);
  const loadSelectedLanguageUseCase =
    createLoadSelectedLanguageUseCase(appSettingRepository);
  const result = await loadSelectedLanguageUseCase.execute();

  if (!result.success) {
    console.error("Failed to bootstrap selected language", result.error);
    return;
  }

  changeLanguage(result.value);
};
