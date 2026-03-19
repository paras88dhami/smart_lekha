import React from "react";
import type { Database } from "@nozbe/watermelondb";
import { createLocalAppSettingDataSource } from "../../appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../../appSettings/data/repository/appSetting.repository.impl";
import { createGetAppSettingUseCase } from "../../appSettings/useCase/getAppSetting.useCase.impl";
import { createUpdateLastSelectedCountryIsoUseCase } from "../../appSettings/useCase/updateLastSelectedCountryIso.useCase.impl";
import { createPersistSelectedLanguageUseCase } from "../../languageSelection/useCase/persistSelectedLanguage.useCase.impl";
import type { PhoneEntrySubmitInput } from "../types/types";
import PhoneEntryScreen from "../ui/PhoneEntryScreen";
import { usePhoneEntryViewModel } from "../viewModel/phoneEntry.viewModel.impl";

type Params = {
  database: Database;
  initialPhoneNumber: string;
  onContinue: (input: PhoneEntrySubmitInput) => void;
  onClose: () => void;
};

export function createPhoneEntryScreen(params: Params): React.ComponentType {
  const {
    database,
    initialPhoneNumber,
    onContinue: onContinueParam,
    onClose: onCloseParam,
  } = params;

  return function PhoneEntryScreenFactory(): React.JSX.Element {
    const appSettingRepository = React.useMemo(() => {
      const appSettingDataSource = createLocalAppSettingDataSource(database);
      return createAppSettingRepository(appSettingDataSource);
    }, []);

    const getAppSettingUseCase = React.useMemo(
      () => createGetAppSettingUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const persistSelectedLanguageUseCase = React.useMemo(
      () => createPersistSelectedLanguageUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const updateLastSelectedCountryIsoUseCase = React.useMemo(
      () => createUpdateLastSelectedCountryIsoUseCase(appSettingRepository),
      [appSettingRepository],
    );

    const onContinue = React.useCallback(
      (input: PhoneEntrySubmitInput): void => {
        onContinueParam(input);
      },
      [onContinueParam],
    );

    const onClose = React.useCallback((): void => {
      onCloseParam();
    }, [onCloseParam]);

    const viewModel = usePhoneEntryViewModel({
      initialPhoneNumber,
      getAppSettingUseCase,
      persistSelectedLanguageUseCase,
      updateLastSelectedCountryIsoUseCase,
      onContinue,
      onClose,
    });

    return <PhoneEntryScreen viewModel={viewModel} />;
  };
}
