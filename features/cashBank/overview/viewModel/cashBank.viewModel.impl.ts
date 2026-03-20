import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { CashBankViewModel } from "./cashBank.viewModel";
import type { CreateCashBankAccountUseCase } from "../useCase/createCashBankAccount.useCase";
import type { LoadCashBankOverviewUseCase } from "../useCase/loadCashBankOverview.useCase";
import type { SetCashBankPrimaryAccountUseCase } from "../useCase/setCashBankPrimaryAccount.useCase";
import { getCashBankErrorMessage } from "./cashBankErrorMessage";
import {
  createCashBankFormState,
  createFailureCashBankState,
  createInitialCashBankState,
  createLoadingCashBankState,
  createSuccessCashBankState,
} from "./cashBankState";
import {
  changeCashBankAccountName,
  changeCashBankAccountNumber,
  changeCashBankAccountType,
  changeCashBankOpeningBalance,
  toggleCashBankAddAccountForm,
} from "./cashBankFormActions";

type Dependencies = {
  loadCashBankOverviewUseCase: LoadCashBankOverviewUseCase;
  createCashBankAccountUseCase: CreateCashBankAccountUseCase;
  setCashBankPrimaryAccountUseCase: SetCashBankPrimaryAccountUseCase;
};

export const useCashBankViewModel = (dependencies: Dependencies): CashBankViewModel => {
  const [state, setState] = useState(createInitialCashBankState);
  const isLoadingReference = useRef<boolean>(false);
  const isSubmittingReference = useRef<boolean>(false);

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

  const onToggleAddAccountPress = useCallback((): void => {
    setState(toggleCashBankAddAccountForm);
  }, []);

  const onAccountNameChange = useCallback((value: string): void => {
    setState((currentState) => changeCashBankAccountName(currentState, value));
  }, []);

  const onAccountNumberChange = useCallback((value: string): void => {
    setState((currentState) => changeCashBankAccountNumber(currentState, value));
  }, []);

  const onOpeningBalanceChange = useCallback((value: string): void => {
    setState((currentState) => changeCashBankOpeningBalance(currentState, value));
  }, []);

  const onAccountTypePress = useCallback((accountType: FinanceAccountType): void => {
    setState((currentState) => changeCashBankAccountType(currentState, accountType));
  }, []);

  const onCreateAccountPress = useCallback(async (): Promise<void> => {
    if (isSubmittingReference.current) {
      return;
    }

    isSubmittingReference.current = true;
    setState(createLoadingCashBankState);

    try {
      const result = await dependencies.createCashBankAccountUseCase.execute(state.form);
      if (!result.success) {
        setState((currentState) =>
          createFailureCashBankState(currentState, getCashBankErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => ({
        ...currentState,
        showAddAccountForm: false,
        form: createCashBankFormState(),
      }));
      await loadOverview();
    } finally {
      isSubmittingReference.current = false;
    }
  }, [dependencies.createCashBankAccountUseCase, loadOverview, state.form]);

  const onSetPrimaryPress = useCallback(
    async (accountId: string): Promise<void> => {
      if (isSubmittingReference.current) {
        return;
      }

      isSubmittingReference.current = true;
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
        isSubmittingReference.current = false;
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
      onToggleAddAccountPress,
      onAccountNameChange,
      onAccountNumberChange,
      onOpeningBalanceChange,
      onAccountTypePress,
      onCreateAccountPress,
      onSetPrimaryPress,
    };
  }, [
    loadOverview,
    onAccountNameChange,
    onAccountNumberChange,
    onAccountTypePress,
    onCreateAccountPress,
    onOpeningBalanceChange,
    onSetPrimaryPress,
    onToggleAddAccountPress,
    state,
  ]);
};
