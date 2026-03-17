import { Status } from "@/shared/types/status.types";
import React from "react";
import type {
  LanguageCodeType,
  LanguageSelectionState,
} from "../types/types";
import { LANGUAGE_OPTIONS } from "../types/types";
import type { GetSelectedLanguageUseCase } from "../useCase/getSelectedLanguage.useCase";
import type { UpdateSelectedLanguageUseCase } from "../useCase/updateSelectedLanguage.useCase";
import type { LanguageSelectionViewModel } from "./languageSelection.viewModel";

type UseLanguageSelectionViewModelParams = {
  getSelectedLanguageUseCase: GetSelectedLanguageUseCase;
  updateSelectedLanguageUseCase: UpdateSelectedLanguageUseCase;
  onContinue: () => void;
};

const getInitialState = (): LanguageSelectionState => ({
  status: Status.Idle,
  selectedLanguageCode: "en",
  options: LANGUAGE_OPTIONS,
});

export const useLanguageSelectionViewModel = (
  params: UseLanguageSelectionViewModelParams,
): LanguageSelectionViewModel => {
  const [state, setState] = React.useState<LanguageSelectionState>(
    getInitialState(),
  );

  const loadSelectedLanguage = React.useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
    }));

    const result = await params.getSelectedLanguageUseCase.execute();

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        error: result.error.message,
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Success,
      selectedLanguageCode: (result.value ?? "en") as LanguageCodeType,
    }));
  }, [params]);

  const selectLanguage = React.useCallback(
    (languageCode: LanguageCodeType): void => {
      setState((currentState) => ({
        ...currentState,
        selectedLanguageCode: languageCode,
      }));
    },
    [],
  );

  const continueToNextStep = React.useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
    }));

    const result = await params.updateSelectedLanguageUseCase.execute({
      languageCode: state.selectedLanguageCode,
    });

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        error: result.error.message,
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Success,
    }));
    params.onContinue();
  }, [params, state.selectedLanguageCode]);

  React.useEffect(() => {
    void loadSelectedLanguage();
  }, [loadSelectedLanguage]);

  return {
    state,
    loadSelectedLanguage,
    selectLanguage,
    continueToNextStep,
  };
};
