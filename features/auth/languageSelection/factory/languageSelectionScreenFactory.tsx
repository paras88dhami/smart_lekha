import type { Database } from "@nozbe/watermelondb";
import { useMemo } from "react";
import { createLocalAppSettingDataSource } from "../../appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../../appSettings/data/repository/appSetting.repository.impl";
import LanguageSelectionScreen from "../ui/LanguageSelectionScreen";
import { createLoadSelectedLanguageUseCase } from "../useCase/loadSelectedLanguage.useCase";
import { createPersistSelectedLanguageUseCase } from "../useCase/persistSelectedLanguage.useCase.impl";
import { useLanguageSelectionViewModel } from "../viewModel/languageSelection.viewModel.impl";

type LanguageSelectionFactoryParams = {
  database: Database;
  onContinue: () => void;
};

export const createLanguageSelectionFactory = ({
  database,
  onContinue,
}: LanguageSelectionFactoryParams) => {
  return function LanguageSelectionFactory() {
    const appSettingRepository = useMemo(() => {
      const appSettingDataSource = createLocalAppSettingDataSource(database);
      return createAppSettingRepository(appSettingDataSource);
    }, [database]);

    const loadSelectedLanguageUseCase = useMemo(
      () => createLoadSelectedLanguageUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const persistSelectedLanguageUseCase = useMemo(
      () => createPersistSelectedLanguageUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const viewModel = useLanguageSelectionViewModel(
      loadSelectedLanguageUseCase,
      persistSelectedLanguageUseCase,
      { onContinue },
    );

    return <LanguageSelectionScreen viewModel={viewModel} />;
  };
};
