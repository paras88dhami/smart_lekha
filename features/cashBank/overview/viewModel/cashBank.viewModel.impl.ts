import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CashBankViewModel } from "./cashBank.viewModel";
import type { LoadCashBankOverviewUseCase } from "../useCase/loadCashBankOverview.useCase";
import type { SetCashBankPrimaryAccountUseCase } from "../useCase/setCashBankPrimaryAccount.useCase";
import { getCashBankErrorMessage } from "./cashBankErrorMessage";
import {
  createFailureCashBankState,
  createInitialCashBankState,
  createLoadingCashBankState,
  createSuccessCashBankState,
} from "./cashBankState";

type Dependencies = {
  loadCashBankOverviewUseCase: LoadCashBankOverviewUseCase;
  setCashBankPrimaryAccountUseCase: SetCashBankPrimaryAccountUseCase;
  onAddAccountPress: () => void;
  onEditAccountPress: (accountId: string) => void;
  onViewStatementPress: (accountId: string) => void;
};

export const useCashBankViewModel = (dependencies: Dependencies): CashBankViewModel => {
  const [state, setState] = useState(createInitialCashBankState);
  const isLoadingReference = useRef<boolean>(false);

  const loadOverview = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingCashBankState);

    try {
      const result = await dependencies.loadCashBankOverviewUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureCashBankState(currentState, getCashBankErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => createSuccessCashBankState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadCashBankOverviewUseCase]);

  const onSetPrimaryPress = useCallback(
    async (accountId: string): Promise<void> => {
      if (isLoadingReference.current) {
        return;
      }

      isLoadingReference.current = true;
      setState(createLoadingCashBankState);

      try {
        const result = await dependencies.setCashBankPrimaryAccountUseCase.execute(accountId);
        if (!result.success) {
          setState((currentState) =>
            createFailureCashBankState(currentState, getCashBankErrorMessage(result.error)),
          );
          return;
        }

        await loadOverview();
      } finally {
        isLoadingReference.current = false;
      }
    },
    [dependencies.setCashBankPrimaryAccountUseCase, loadOverview],
  );

  useEffect((): void => {
    void loadOverview();
  }, [loadOverview]);

  return useMemo<CashBankViewModel>(() => {
    return {
      state,
      onRefreshPress: loadOverview,
      onAddAccountPress: dependencies.onAddAccountPress,
      onEditAccountPress: dependencies.onEditAccountPress,
      onViewStatementPress: dependencies.onViewStatementPress,
      onSetPrimaryPress,
    };
  }, [
    dependencies.onAddAccountPress,
    dependencies.onEditAccountPress,
    dependencies.onViewStatementPress,
    loadOverview,
    onSetPrimaryPress,
    state,
  ]);
};
