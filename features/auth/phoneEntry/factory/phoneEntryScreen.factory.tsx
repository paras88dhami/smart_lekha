import React from "react";
import type { Database } from "@nozbe/watermelondb";
import { createLocalAppSettingDataSource } from "../../appSettings/data/dataSource/localAppSetting.dataSource.impl";
import { createAppSettingRepository } from "../../appSettings/data/repository/appSetting.repository.impl";
import { createGetAppSettingUseCase } from "../../appSettings/useCase/getAppSetting.useCase.impl";
import { createUpdateLastSelectedCountryIsoUseCase } from "../../appSettings/useCase/updateLastSelectedCountryIso.useCase.impl";
import { createPersistSelectedLanguageUseCase } from "../../languageSelection/useCase/persistSelectedLanguage.useCase.impl";
import { createLocalOtpRequestDataSource } from "../../otp/data/dataSource/localOtpRequest.dataSource.impl";
import { createRemoteOtpAuthDataSource } from "../../otp/data/dataSource/remoteOtpAuth.dataSource.impl";
import { createOtpRepository } from "../../otp/data/repository/otp.repository.impl";
import { createRequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase.impl";
import { createLocalAuthSessionDataSource } from "../../session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "../../session/data/repository/authSession.repository.impl";
import { createValidateCurrentAuthSessionUseCase } from "../../session/useCase/validateCurrentAuthSession.useCase.impl";
import type { PhoneEntrySubmitInput } from "../types/types";
import PhoneEntryScreen from "../ui/PhoneEntryScreen";
import { usePhoneEntryViewModel } from "../viewModel/phoneEntry.viewModel.impl";

type Params = {
  database: Database;
  initialPhoneNumber: string;
  onContinue: (input: PhoneEntrySubmitInput) => void;
  onContinueOffline: () => void;
  onClose: () => void;
};

export function createPhoneEntryScreen(params: Params): React.ComponentType {
  const {
    database,
    initialPhoneNumber,
    onContinue: onContinueParam,
    onContinueOffline: onContinueOfflineParam,
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

    const requestOtpUseCase = React.useMemo(() => {
      const remoteOtpAuthDataSource = createRemoteOtpAuthDataSource();
      const localOtpRequestDataSource = createLocalOtpRequestDataSource(database);
      const otpRepository = createOtpRepository(
        remoteOtpAuthDataSource,
        localOtpRequestDataSource,
      );

      return createRequestOtpUseCase(otpRepository);
    }, []);

    const validateCurrentAuthSessionUseCase = React.useMemo(() => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      const authSessionRepository = createAuthSessionRepository(
        localAuthSessionDataSource,
      );
      return createValidateCurrentAuthSessionUseCase(authSessionRepository);
    }, []);

    const onContinue = React.useCallback(
      (input: PhoneEntrySubmitInput): void => {
        onContinueParam(input);
      },
      [onContinueParam],
    );

    const onContinueOffline = React.useCallback((): void => {
      onContinueOfflineParam();
    }, [onContinueOfflineParam]);

    const onClose = React.useCallback((): void => {
      onCloseParam();
    }, [onCloseParam]);

    const viewModel = usePhoneEntryViewModel({
      initialPhoneNumber,
      getAppSettingUseCase,
      persistSelectedLanguageUseCase,
      updateLastSelectedCountryIsoUseCase,
      requestOtpUseCase,
      validateCurrentAuthSessionUseCase,
      onContinue,
      onContinueOffline,
      onClose,
    });

    return <PhoneEntryScreen viewModel={viewModel} />;
  };
}
