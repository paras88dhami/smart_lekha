import React from "react";
import type { Database } from "@nozbe/watermelondb";
import LanguageSelectionScreen from "../ui/LanguageSelectionScreen";
import { createLoadSelectedLanguageUseCase } from "../useCase/loadSelectedLanguage.useCase";
import { createPersistSelectedLanguageUseCase } from "../useCase/persistSelectedLanguage.useCase";
import { createLocalAppSettingDataSource } from "../../appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../../appSettings/data/repository/appSetting.repository.impl";
import { useLanguageSelectionViewModel } from "../viewModel/languageSelection.viewModel.impl";

type LanguageSelectionFactoryParams = {
  database: Database;
  onContinue: () => void;
};

export const createLanguageSelectionFactory = ({
  database,
  onContinue,
}: LanguageSelectionFactoryParams): (() => React.JSX.Element) => {
  return function LanguageSelectionFactory(): React.JSX.Element {
    const appSettingDataSource = React.useMemo(() => {
      return createLocalAppSettingDataSource(database);
    }, [database]);

    const appSettingRepository = React.useMemo(() => {
      return createAppSettingRepository(appSettingDataSource);
    }, [appSettingDataSource]);

    const loadSelectedLanguageUseCase = React.useMemo(() => {
      return createLoadSelectedLanguageUseCase(appSettingRepository);
    }, [appSettingRepository]);

    const persistSelectedLanguageUseCase = React.useMemo(() => {
      return createPersistSelectedLanguageUseCase(appSettingRepository);
    }, [appSettingRepository]);

    const viewModel = useLanguageSelectionViewModel(
      loadSelectedLanguageUseCase,
      persistSelectedLanguageUseCase,
      { onContinue },
    );

    return <LanguageSelectionScreen viewModel={viewModel} />;
  };
};
