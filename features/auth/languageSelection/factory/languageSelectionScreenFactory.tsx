import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalAppSettingDataSource } from "../../appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../../appSettings/data/repository/appSetting.repository.impl";
import LanguageSelectionScreen from "../ui/LanguageSelectionScreen";
import { createGetSelectedLanguageUseCase } from "../useCase/getSelectedLanguage.useCase.impl";
import { createUpdateSelectedLanguageUseCase } from "../useCase/updateSelectedLanguage.useCase.impl";
import { useLanguageSelectionViewModel } from "../viewModel/languageSelection.viewModel.impl";

type CreateLanguageSelectionScreenParams = {
  database: Database;
  onContinue: () => void;
};

export function createLanguageSelectionScreen(
  params: CreateLanguageSelectionScreenParams,
): () => React.JSX.Element {
  return function LanguageSelectionScreenFactory(): React.JSX.Element {
    const appSettingDataSource = React.useMemo(
      () => createLocalAppSettingDataSource(params.database),
      [params.database],
    );

    const appSettingRepository = React.useMemo(
      () => createAppSettingRepository(appSettingDataSource),
      [appSettingDataSource],
    );

    const getSelectedLanguageUseCase = React.useMemo(
      () => createGetSelectedLanguageUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const updateSelectedLanguageUseCase = React.useMemo(
      () => createUpdateSelectedLanguageUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const onContinue = React.useCallback((): void => {
      params.onContinue();
    }, [params]);

    const viewModel = useLanguageSelectionViewModel({
      getSelectedLanguageUseCase,
      updateSelectedLanguageUseCase,
      onContinue,
    });

    return <LanguageSelectionScreen viewModel={viewModel} />;
  };
}
