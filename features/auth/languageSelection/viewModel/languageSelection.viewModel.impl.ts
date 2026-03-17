import { Status } from "@/shared/types/status.types";
import { useEffect, useState } from "react";
import type { LanguageCodeType, LanguageSelectionState } from "../types/types";
import type { LoadSelectedLanguageUseCase } from "../useCase/loadSelectedLanguage.useCase";
import type { PersistSelectedLanguageUseCase } from "../useCase/persistSelectedLanguage.useCase";
import type { LanguageSelectionViewModel } from "./languageSelection.viewModel";
import { changeLanguage } from "@/shared/i18n/resources";
import { LANGUAGE_OPTIONS } from "./languageOptions";

export const useLanguageSelectionViewModel = (
  loadSelectedLanguageUseCase: LoadSelectedLanguageUseCase,
  persistSelectedLanguageUseCase: PersistSelectedLanguageUseCase,
  deps?: {onContinue?: () => void;},
): LanguageSelectionViewModel => {
  const [state, setState] = useState<LanguageSelectionState>({
    status: Status.Idle,
    selectedLanguageCode: "en",
    options: LANGUAGE_OPTIONS,
    errorMessage: "",
  });

  const onLanguagePress = (languageCode: LanguageCodeType): void => {
    changeLanguage(languageCode);

    setState((currentState) => ({
      ...currentState,
      selectedLanguageCode: languageCode,
      errorMessage: "",
    }));
  };

  const onContinuePress = async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    const selectedLanguageCode = state.selectedLanguageCode;

    const result = await persistSelectedLanguageUseCase.execute({
      languageCode: selectedLanguageCode,
    });

    if (result.success) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        errorMessage: "",
      }));

      deps?.onContinue?.();
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Failure,
      errorMessage: result.error.message,
    }));
  };

  const handleLoadSelectedLanguage = async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    const result = await loadSelectedLanguageUseCase.execute();

    if (result.success) {
      changeLanguage(result.value);

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        selectedLanguageCode: result.value,
        errorMessage: "",
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Failure,
      errorMessage: result.error.message,
    }));
  };

  useEffect(() => {
    void handleLoadSelectedLanguage();
  }, []);

  return {
    state,
    handleLoadSelectedLanguage,
    onLanguagePress,
    onContinuePress,
  };
};
