import { changeLanguage, isSupportedLanguageCode } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import React from "react";
import type { GetAppSettingUseCase } from "../../appSettings/useCase/getAppSetting.useCase";
import type { UpdateLastSelectedCountryIsoUseCase } from "../../appSettings/useCase/updateLastSelectedCountryIso.useCase";
import {
  AuthErrorType,
  InvalidPhoneNumberError,
} from "../../shared/authError.types";
import { getAuthErrorMessage } from "../../shared/authErrorMessage";
import {
  CountryIso,
  isCountryIso,
  type CountryIsoType,
} from "../../shared/country.types";
import {
  buildE164PhoneNumber,
  getPhoneLengthForCountry,
  isValidPhoneForCountry,
  sanitizePhoneDigits,
} from "../../shared/phoneNumber";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import type { PersistSelectedLanguageUseCase } from "../../languageSelection/useCase/persistSelectedLanguage.useCase";
import type { RequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase";
import type { GetCurrentAuthSessionUseCase } from "../../session/useCase/getCurrentAuthSession.useCase";
import type { CountryOption, PhoneEntrySubmitInput, PhoneEntryState } from "../types/types";
import type { PhoneEntryViewModel } from "./phoneEntry.viewModel";

const COUNTRY_OPTIONS: CountryOption[] = [
  {
    iso: CountryIso.Nepal,
    name: "Nepal",
    callingCode: "+977",
    flag: "🇳🇵",
  },
  {
    iso: CountryIso.India,
    name: "India",
    callingCode: "+91",
    flag: "🇮🇳",
  },
];

const DEFAULT_COUNTRY_ISO: CountryIsoType = CountryIso.Nepal;
const DEFAULT_LANGUAGE_CODE: LanguageCodeType = "en";

const getCountryByIso = (countryIso: CountryIsoType): CountryOption => {
  return (
    COUNTRY_OPTIONS.find((country) => country.iso === countryIso) ??
    COUNTRY_OPTIONS[0]
  );
};

type Params = {
  initialPhoneNumber: string;
  getAppSettingUseCase: GetAppSettingUseCase;
  persistSelectedLanguageUseCase: PersistSelectedLanguageUseCase;
  updateLastSelectedCountryIsoUseCase: UpdateLastSelectedCountryIsoUseCase;
  requestOtpUseCase: RequestOtpUseCase;
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  onContinue: (input: PhoneEntrySubmitInput) => void;
  onContinueOffline: () => void;
  onClose: () => void;
};

export function usePhoneEntryViewModel(params: Params): PhoneEntryViewModel {
  const {
    initialPhoneNumber,
    getAppSettingUseCase,
    persistSelectedLanguageUseCase,
    updateLastSelectedCountryIsoUseCase,
    requestOtpUseCase,
    getCurrentAuthSessionUseCase,
    onContinue,
    onContinueOffline,
    onClose,
  } = params;

  const hasUserSelectedLanguage = React.useRef(false);
  const hasUserSelectedCountry = React.useRef(false);
  const isSubmitting = React.useRef(false);

  const [state, setState] = React.useState<PhoneEntryState>({
    status: Status.Idle,
    phoneNumber: sanitizePhoneDigits(initialPhoneNumber).slice(
      0,
      getPhoneLengthForCountry(DEFAULT_COUNTRY_ISO),
    ),
    selectedCountryIso: DEFAULT_COUNTRY_ISO,
    selectedLanguageCode: DEFAULT_LANGUAGE_CODE,
    countries: COUNTRY_OPTIONS,
    canContinueOffline: false,
    showOfflineHint: false,
    errorMessage: "",
  });

  const loadPreferences = React.useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    const result = await getAppSettingUseCase.execute();

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: getAuthErrorMessage(result.error),
      }));
      return;
    }

    const savedLanguage = result.value?.selectedLanguage;
    const savedCountryIso = result.value?.lastSelectedCountryIso;

    const languageCode =
      savedLanguage && isSupportedLanguageCode(savedLanguage)
        ? savedLanguage
        : DEFAULT_LANGUAGE_CODE;
    const countryIso =
      savedCountryIso && isCountryIso(savedCountryIso)
        ? savedCountryIso
        : DEFAULT_COUNTRY_ISO;

    if (!hasUserSelectedLanguage.current) {
      changeLanguage(languageCode);
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Success,
      selectedLanguageCode: hasUserSelectedLanguage.current
        ? currentState.selectedLanguageCode
        : languageCode,
      selectedCountryIso: hasUserSelectedCountry.current
        ? currentState.selectedCountryIso
        : countryIso,
      errorMessage: "",
    }));
  }, [getAppSettingUseCase]);

  const changePhoneNumber = React.useCallback((value: string): void => {
    const maxLength = getPhoneLengthForCountry(state.selectedCountryIso);

    setState((currentState) => ({
      ...currentState,
      phoneNumber: sanitizePhoneDigits(value).slice(0, maxLength),
      canContinueOffline: false,
      showOfflineHint: false,
      errorMessage: "",
    }));
  }, [state.selectedCountryIso]);

  const selectCountry = React.useCallback((countryIso: CountryIsoType): void => {
    hasUserSelectedCountry.current = true;
    const maxLength = getPhoneLengthForCountry(countryIso);

    setState((currentState) => ({
      ...currentState,
      selectedCountryIso: countryIso,
      phoneNumber: currentState.phoneNumber.slice(0, maxLength),
      canContinueOffline: false,
      showOfflineHint: false,
      errorMessage: "",
    }));
  }, []);

  const selectLanguage = React.useCallback(
    (languageCode: LanguageCodeType): void => {
      hasUserSelectedLanguage.current = true;
      changeLanguage(languageCode);

      setState((currentState) => ({
        ...currentState,
        selectedLanguageCode: languageCode,
        canContinueOffline: false,
        showOfflineHint: false,
        errorMessage: "",
      }));
    },
    [],
  );

  const continueFlow = React.useCallback(async (): Promise<void> => {
    if (isSubmitting.current) {
      return;
    }

    const selectedCountry = getCountryByIso(state.selectedCountryIso);
    const normalizedPhone = sanitizePhoneDigits(state.phoneNumber);
    const isValidPhone = isValidPhoneForCountry(
      normalizedPhone,
      state.selectedCountryIso,
    );

    if (!isValidPhone) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: getAuthErrorMessage(InvalidPhoneNumberError),
      }));
      return;
    }

    isSubmitting.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const languageResult = await persistSelectedLanguageUseCase.execute({
        languageCode: state.selectedLanguageCode,
      });

      if (!languageResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(languageResult.error),
        }));
        return;
      }

      const countryResult =
        await updateLastSelectedCountryIsoUseCase.execute({
          countryIso: state.selectedCountryIso,
        });

      if (!countryResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(countryResult.error),
        }));
        return;
      }

      const requestOtpResult = await requestOtpUseCase.execute({
        phoneNumber: buildE164PhoneNumber(
          selectedCountry.callingCode,
          normalizedPhone,
        ),
        countryIso: state.selectedCountryIso,
        countryCode: selectedCountry.callingCode,
        languageCode: state.selectedLanguageCode,
      });

      if (!requestOtpResult.success) {
        const hasOfflineFallbackCandidate =
          requestOtpResult.error.type === AuthErrorType.AuthServiceUnavailable ||
          requestOtpResult.error.type === AuthErrorType.AuthServiceNotConfigured;
        let canContinueOffline = false;

        if (hasOfflineFallbackCandidate) {
          const sessionResult = await getCurrentAuthSessionUseCase.execute();
          canContinueOffline = Boolean(
            sessionResult.success &&
              sessionResult.value?.isLoggedIn &&
              sessionResult.value?.isVerified,
          );
        }

        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          canContinueOffline,
          showOfflineHint: hasOfflineFallbackCandidate,
          errorMessage: getAuthErrorMessage(requestOtpResult.error),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        errorMessage: "",
      }));

      onContinue({
        phoneNumber: normalizedPhone,
        countryIso: selectedCountry.iso,
        countryCode: selectedCountry.callingCode,
        languageCode: state.selectedLanguageCode,
        otpReferenceId: requestOtpResult.value.otpReferenceId,
        otpExpiresAt: requestOtpResult.value.expiresAt,
        resendAfterSeconds: requestOtpResult.value.resendAfterSeconds,
        isExistingUser: requestOtpResult.value.isExistingUser,
      });
    } finally {
      isSubmitting.current = false;
    }
  }, [
    getCurrentAuthSessionUseCase,
    onContinue,
    persistSelectedLanguageUseCase,
    requestOtpUseCase,
    state.phoneNumber,
    state.selectedCountryIso,
    state.selectedLanguageCode,
    updateLastSelectedCountryIsoUseCase,
  ]);

  const continueOfflineFlow = React.useCallback((): void => {
    if (!state.canContinueOffline) {
      return;
    }

    onContinueOffline();
  }, [onContinueOffline, state.canContinueOffline]);

  const closeFlow = React.useCallback((): void => {
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    void loadPreferences();
  }, [loadPreferences]);

  return {
    state,
    changePhoneNumber,
    selectCountry,
    selectLanguage,
    continueFlow,
    continueOfflineFlow,
    closeFlow,
  };
}
