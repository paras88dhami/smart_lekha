import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCashBankErrorMessage } from "@/features/cashBank/overview/viewModel/cashBankErrorMessage";
import { Status } from "@/shared/types/status.types";
import type { LoadCashBankAccountStatementUseCase } from "../useCase/loadCashBankAccountStatement.useCase";
import type { CashBankAccountStatementViewModel } from "./cashBankAccountStatement.viewModel";
import {
  createInitialCashBankAccountStatementState,
  createLoadingCashBankAccountStatementState,
  createSuccessCashBankAccountStatementState,
} from "./cashBankAccountStatementState";

type Dependencies = {
  accountId: string;
  loadCashBankAccountStatementUseCase: LoadCashBankAccountStatementUseCase;
  onTransactionPress: (transactionId: string) => void;
};

export const useCashBankAccountStatementViewModel = (
  dependencies: Dependencies,
): CashBankAccountStatementViewModel => {
  const [state, setState] = useState(createInitialCashBankAccountStatementState);
  const isLoadingReference = useRef<boolean>(false);

  const loadStatement = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState((currentState) => createLoadingCashBankAccountStatementState(currentState));

    try {
      const result = await dependencies.loadCashBankAccountStatementUseCase.execute(
        dependencies.accountId,
      );

      if (!result.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getCashBankErrorMessage(result.error),
        }));
        return;
      }

      setState(createSuccessCashBankAccountStatementState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.accountId, dependencies.loadCashBankAccountStatementUseCase]);

  useEffect((): void => {
    void loadStatement();
  }, [loadStatement]);

  return useMemo<CashBankAccountStatementViewModel>(() => {
    return {
      state,
      onRefreshPress: loadStatement,
      onTransactionPress: dependencies.onTransactionPress,
    };
  }, [dependencies.onTransactionPress, loadStatement, state]);
};
