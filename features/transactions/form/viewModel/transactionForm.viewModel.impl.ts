import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import { getTransactionsErrorMessage } from "@/features/transactions/overview/viewModel/transactionsErrorMessage";
import { Status } from "@/shared/types/status.types";
import type { LoadTransactionFormUseCase } from "../useCase/loadTransactionForm.useCase";
import type { SubmitTransactionFormUseCase } from "../useCase/submitTransactionForm.useCase";
import type { TransactionFormViewModel } from "./transactionForm.viewModel";
import {
  createInitialTransactionFormState,
  createLoadingTransactionFormState,
  createSuccessTransactionFormState,
} from "./transactionFormState";

type Dependencies = {
  transactionId: string | null;
  loadTransactionFormUseCase: LoadTransactionFormUseCase;
  submitTransactionFormUseCase: SubmitTransactionFormUseCase;
  onCompleted: () => void;
};

export const useTransactionFormViewModel = (
  dependencies: Dependencies,
): TransactionFormViewModel => {
  const [state, setState] = useState(createInitialTransactionFormState);
  const isLoadingReference = useRef<boolean>(false);

  const loadForm = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState((currentState) => createLoadingTransactionFormState(currentState));

    try {
      const result = await dependencies.loadTransactionFormUseCase.execute(
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

      setState(createSuccessTransactionFormState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadTransactionFormUseCase, dependencies.transactionId]);

  const onAccountPress = useCallback((accountId: string): void => {
    setState((currentState) => ({ ...currentState, selectedAccountId: accountId, errorMessage: "" }));
  }, []);

  const onEntryTypePress = useCallback((entryType: FinanceEntryType): void => {
    setState((currentState) => ({ ...currentState, selectedEntryType: entryType, errorMessage: "" }));
  }, []);

  const onAmountChange = useCallback((value: string): void => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    setState((currentState) => ({ ...currentState, amountInput: sanitizedValue, errorMessage: "" }));
  }, []);

  const onCategoryChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, categoryInput: value, errorMessage: "" }));
  }, []);

  const onCounterpartyChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, counterpartyInput: value, errorMessage: "" }));
  }, []);

  const onNoteChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, noteInput: value, errorMessage: "" }));
  }, []);

  const onOccurredOnChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, occurredOnInput: value, errorMessage: "" }));
  }, []);

  const onSavePress = useCallback(async (): Promise<void> => {
    if (state.isSubmitting) {
      return;
    }

    setState((currentState) => ({ ...currentState, isSubmitting: true, errorMessage: "" }));

    const result = await dependencies.submitTransactionFormUseCase.execute({
      transactionId: state.transactionId,
      selectedAccountId: state.selectedAccountId,
      selectedEntryType: state.selectedEntryType,
      amountInput: state.amountInput,
      categoryInput: state.categoryInput,
      counterpartyInput: state.counterpartyInput,
      noteInput: state.noteInput,
      occurredOnInput: state.occurredOnInput,
    });

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        isSubmitting: false,
        errorMessage: getTransactionsErrorMessage(result.error),
      }));
      return;
    }

    dependencies.onCompleted();
  }, [dependencies, state]);

  useEffect((): void => {
    void loadForm();
  }, [loadForm]);

  return useMemo<TransactionFormViewModel>(() => {
    return {
      state,
      onRefreshPress: loadForm,
      onAccountPress,
      onEntryTypePress,
      onAmountChange,
      onCategoryChange,
      onCounterpartyChange,
      onNoteChange,
      onOccurredOnChange,
      onSavePress,
    };
  }, [
    loadForm,
    onAccountPress,
    onEntryTypePress,
    onAmountChange,
    onCategoryChange,
    onCounterpartyChange,
    onNoteChange,
    onOccurredOnChange,
    onSavePress,
    state,
  ]);
};
