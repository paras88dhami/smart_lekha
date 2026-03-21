import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTransactionsErrorMessage } from "@/features/transactions/overview/viewModel/transactionsErrorMessage";
import { Status } from "@/shared/types/status.types";
import type { DeleteTransactionDetailUseCase } from "../useCase/deleteTransactionDetail.useCase";
import type { LoadTransactionDetailUseCase } from "../useCase/loadTransactionDetail.useCase";
import type { TransactionDetailViewModel } from "./transactionDetail.viewModel";
import {
  createInitialTransactionDetailState,
  createLoadingTransactionDetailState,
  createSuccessTransactionDetailState,
} from "./transactionDetailState";

type Dependencies = {
  transactionId: string;
  loadTransactionDetailUseCase: LoadTransactionDetailUseCase;
  deleteTransactionDetailUseCase: DeleteTransactionDetailUseCase;
  onEditPress: (transactionId: string) => void;
  onDeleted: () => void;
};

export const useTransactionDetailViewModel = (
  dependencies: Dependencies,
): TransactionDetailViewModel => {
  const [state, setState] = useState(createInitialTransactionDetailState);
  const isLoadingReference = useRef<boolean>(false);

  const loadDetail = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState((currentState) => createLoadingTransactionDetailState(currentState));

    try {
      const result = await dependencies.loadTransactionDetailUseCase.execute(
        dependencies.transactionId,
      );

      if (!result.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getTransactionsErrorMessage(result.error),
        }));
        return;
      }

      setState(createSuccessTransactionDetailState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadTransactionDetailUseCase, dependencies.transactionId]);

  const onEditPress = useCallback((): void => {
    dependencies.onEditPress(state.transactionId);
  }, [dependencies, state.transactionId]);

  const onDeletePress = useCallback(async (): Promise<void> => {
    if (state.isDeleting) {
      return;
    }

    setState((currentState) => ({ ...currentState, isDeleting: true, errorMessage: "" }));

    const result = await dependencies.deleteTransactionDetailUseCase.execute(
      state.transactionId,
    );

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        isDeleting: false,
        errorMessage: getTransactionsErrorMessage(result.error),
      }));
      return;
    }

    dependencies.onDeleted();
  }, [dependencies, state.isDeleting, state.transactionId]);

  useEffect((): void => {
    void loadDetail();
  }, [loadDetail]);

  return useMemo<TransactionDetailViewModel>(() => {
    return {
      state,
      onRefreshPress: loadDetail,
      onEditPress,
      onDeletePress,
    };
  }, [loadDetail, onDeletePress, onEditPress, state]);
};
