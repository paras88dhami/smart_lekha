import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { PartiesViewModel } from "./parties.viewModel";
import type { CreatePartyRecordUseCase } from "../useCase/createPartyRecord.useCase";
import type { LoadPartiesOverviewUseCase } from "../useCase/loadPartiesOverview.useCase";
import { getPartiesErrorMessage } from "./partiesErrorMessage";
import {
  changePartyAccountNumber,
  changePartyBankName,
  changePartyMobileNumber,
  changePartyName,
  changePartyTransferMethod,
  togglePartyFavorite,
  togglePartyForm,
} from "./partiesFormActions";
import {
  createFailurePartiesState,
  createInitialPartiesState,
  createLoadingPartiesState,
  createPartyFormState,
  createSuccessPartiesState,
} from "./partiesState";

type Dependencies = {
  loadPartiesOverviewUseCase: LoadPartiesOverviewUseCase;
  createPartyRecordUseCase: CreatePartyRecordUseCase;
};

export const usePartiesViewModel = (dependencies: Dependencies): PartiesViewModel => {
  const [state, setState] = useState(createInitialPartiesState);
  const isLoadingReference = useRef<boolean>(false);
  const isSubmittingReference = useRef<boolean>(false);

  const loadOverview = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingPartiesState);

    try {
      const result = await dependencies.loadPartiesOverviewUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailurePartiesState(currentState, getPartiesErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => createSuccessPartiesState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadPartiesOverviewUseCase]);

  const onSavePartyPress = useCallback(async (): Promise<void> => {
    if (isSubmittingReference.current) {
      return;
    }

    isSubmittingReference.current = true;
    setState(createLoadingPartiesState);

    try {
      const result = await dependencies.createPartyRecordUseCase.execute(state.form);
      if (!result.success) {
        setState((currentState) =>
          createFailurePartiesState(currentState, getPartiesErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => ({
        ...currentState,
        showAddPartyForm: false,
        form: createPartyFormState(),
      }));
      await loadOverview();
    } finally {
      isSubmittingReference.current = false;
    }
  }, [dependencies.createPartyRecordUseCase, loadOverview, state.form]);

  useEffect((): void => {
    void loadOverview();
  }, [loadOverview]);

  return useMemo<PartiesViewModel>(() => {
    return {
      state,
      onRefreshPress: loadOverview,
      onToggleAddPartyPress: (): void => setState(togglePartyForm),
      onPartyNameChange: (value: string): void => setState((currentState) => changePartyName(currentState, value)),
      onBankNameChange: (value: string): void => setState((currentState) => changePartyBankName(currentState, value)),
      onAccountNumberChange: (value: string): void => setState((currentState) => changePartyAccountNumber(currentState, value)),
      onMobileNumberChange: (value: string): void => setState((currentState) => changePartyMobileNumber(currentState, value)),
      onTransferMethodPress: (method: TransferMethod): void => setState((currentState) => changePartyTransferMethod(currentState, method)),
      onFavoriteTogglePress: (): void => setState(togglePartyFavorite),
      onSavePartyPress,
    };
  }, [loadOverview, onSavePartyPress, state]);
};
