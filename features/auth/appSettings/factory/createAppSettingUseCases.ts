import type { Database } from "@nozbe/watermelondb";
import { createLocalAppSettingDataSource } from "../data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../data/repository/appSetting.repository.impl";
import { createClearActiveAccountIdUseCase } from "../useCase/clearActiveAccountId.useCase.impl";
import { createClearActiveProfileIdUseCase } from "../useCase/clearActiveProfileId.useCase.impl";
import { createCompleteOnboardingUseCase } from "../useCase/completeOnboarding.useCase.impl";
import { createDefaultAppSettingUseCase } from "../useCase/createDefaultAppSetting.useCase.impl";
import { createGetAppSettingUseCase } from "../useCase/getAppSetting.useCase.impl";
import { createSetActiveAccountIdUseCase } from "../useCase/setActiveAccountId.useCase.impl";
import { createSetActiveProfileIdUseCase } from "../useCase/setActiveProfileId.useCase.impl";
import { createUpdateLastSelectedCountryIsoUseCase } from "../useCase/updateLastSelectedCountryIso.useCase.impl";
import { createUpdateSelectedLanguageUseCase } from "../useCase/updateSelectedLanguage.useCase.impl";

export const createAppSettingUseCases = (database: Database) => {
  const appSettingRepository = createAppSettingRepository(
    createLocalAppSettingDataSource(database),
  );

  return {
    appSettingRepository,
    createDefaultAppSettingUseCase:
      createDefaultAppSettingUseCase(appSettingRepository),
    getAppSettingUseCase: createGetAppSettingUseCase(appSettingRepository),
    updateSelectedLanguageUseCase:
      createUpdateSelectedLanguageUseCase(appSettingRepository),
    updateLastSelectedCountryIsoUseCase:
      createUpdateLastSelectedCountryIsoUseCase(appSettingRepository),
    completeOnboardingUseCase:
      createCompleteOnboardingUseCase(appSettingRepository),
    setActiveProfileIdUseCase:
      createSetActiveProfileIdUseCase(appSettingRepository),
    clearActiveProfileIdUseCase:
      createClearActiveProfileIdUseCase(appSettingRepository),
    setActiveAccountIdUseCase:
      createSetActiveAccountIdUseCase(appSettingRepository),
    clearActiveAccountIdUseCase:
      createClearActiveAccountIdUseCase(appSettingRepository),
  };
};
