import { changeLanguage } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAuthErrorMessage } from "../../shared/authErrorMessage";
import type { LanguageCodeType, LanguageSelectionState } from "../types/types";
import { LoadSelectedLanguageUseCase } from "../useCase/loadSelectedLanguage.useCase";
import { PersistSelectedLanguageUseCase } from "../useCase/persistSelectedLanguage.useCase";
import { LANGUAGE_OPTIONS } from "./languageOptions";
import type { LanguageSelectionViewModel } from "./languageSelection.viewModel";

type LanguageSelectionDeps = {
  onContinue?: () => void;
};

export const useLanguageSelectionViewModel = (
  loadSelectedLanguageUseCase: LoadSelectedLanguageUseCase,
  persistSelectedLanguageUseCase: PersistSelectedLanguageUseCase,
  deps?: LanguageSelectionDeps,
): LanguageSelectionViewModel => {
  const hasUserSelectionRef = useRef(false);
  const isPersistingSelectionRef = useRef(false);

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
      if (!hasUserSelectionRef.current) {
        changeLanguage(result.value);
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        selectedLanguageCode: hasUserSelectionRef.current
          ? currentState.selectedLanguageCode
          : result.value,
        errorMessage: "",
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Failure,
      errorMessage: getAuthErrorMessage(result.error),
    }));
  }, [loadSelectedLanguageUseCase]);

  const onLanguagePress = useCallback(
    (languageCode: LanguageCodeType): void => {
      hasUserSelectionRef.current = true;
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
    if (isPersistingSelectionRef.current) {
      return;
    }

    isPersistingSelectionRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
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
        errorMessage: getAuthErrorMessage(result.error),
      }));
    } finally {
      isPersistingSelectionRef.current = false;
    }
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
