import { changeLanguage } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useState } from "react";
import type { LanguageCodeType, LanguageSelectionState } from "../types/types";
import type { LoadSelectedLanguageUseCase } from "../useCase/loadSelectedLanguage.useCase";
import { LANGUAGE_OPTIONS } from "./languageOptions";
import type { LanguageSelectionViewModel } from "./languageSelection.viewModel";
import { PersistSelectedLanguageUseCase } from "../useCase/persistSelectedLanguage.useCase";

type LanguageSelectionDeps = {
  onContinue?: () => void;
};

export const useLanguageSelectionViewModel = (
  loadSelectedLanguageUseCase: LoadSelectedLanguageUseCase,
  persistSelectedLanguageUseCase: PersistSelectedLanguageUseCase,
  deps?: LanguageSelectionDeps,
): LanguageSelectionViewModel => {
  const [state, setState] = useState<LanguageSelectionState>({
    status: Status.Idle,
    selectedLanguageCode: "en",
    options: LANGUAGE_OPTIONS,
    errorMessage: "",
  });

  const handleLoadSelectedLanguage = useCallback(async (): Promise<void> => {
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
  }, [loadSelectedLanguageUseCase]);

  const onLanguagePress = useCallback(
    (languageCode: LanguageCodeType): void => {
      changeLanguage(languageCode);

      setState((currentState) => ({
        ...currentState,
        selectedLanguageCode: languageCode,
        errorMessage: "",
      }));
    },
    [],
  );

  const onContinuePress = useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    const result = await persistSelectedLanguageUseCase.execute({
      languageCode: state.selectedLanguageCode,
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
  }, [deps, persistSelectedLanguageUseCase, state.selectedLanguageCode]);

  useEffect(() => {
    void handleLoadSelectedLanguage();
  }, [handleLoadSelectedLanguage]);

  return {
    state,
    handleLoadSelectedLanguage,
    onLanguagePress,
    onContinuePress,
  };
};
