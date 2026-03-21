import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PaymentRecordDirection } from "@/features/transactions/paymentRecord/data/dataSource/paymentRecord.model";
import type { TransactionsEntryFilter } from "../config/transactionHistoryFilterCatalog";
import type { TransactionsViewModel } from "../types/types";
import type { CreateTransactionsPaymentRecordUseCase } from "../useCase/createTransactionsPaymentRecord.useCase";
import type { LoadTransactionsOverviewUseCase } from "../useCase/loadTransactionsOverview.useCase";
import type { SettleTransactionsPaymentRecordUseCase } from "../useCase/settleTransactionsPaymentRecord.useCase";
import { getTransactionsErrorMessage } from "./transactionsErrorMessage";
import {
  createFailureTransactionsState,
  createInitialTransactionsState,
  createLoadingTransactionsState,
  createSuccessTransactionsState,
  createTransactionsFormState,
} from "./transactionsState";
import { filterTransactionsHistoryItems } from "./transactionsHistoryFilter";

type Dependencies = {
  loadTransactionsOverviewUseCase: LoadTransactionsOverviewUseCase;
  createTransactionsPaymentRecordUseCase: CreateTransactionsPaymentRecordUseCase;
  settleTransactionsPaymentRecordUseCase: SettleTransactionsPaymentRecordUseCase;
  onAddTransactionPress: () => void;
  onQuickPosPress: () => void;
  onTransactionPress: (transactionId: string) => void;
};

export const useTransactionsViewModel = (
  dependencies: Dependencies,
): TransactionsViewModel => {
  const [state, setState] = useState(createInitialTransactionsState);
  const isLoadingReference = useRef<boolean>(false);
  const isSubmittingReference = useRef<boolean>(false);
  const isSettlingReference = useRef<boolean>(false);

  const loadOverview = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingTransactionsState);

    try {
      const result = await dependencies.loadTransactionsOverviewUseCase.execute();

      if (!result.success) {
        setState((currentState) =>
          createFailureTransactionsState(
            currentState,
            getTransactionsErrorMessage(result.error),
          ),
        );
        return;
      }

      setState((currentState) => createSuccessTransactionsState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadTransactionsOverviewUseCase]);

  const onDirectionPress = useCallback((direction: PaymentRecordDirection): void => {
    setState((currentState) => ({
      ...currentState,
      selectedDirection: direction,
      errorMessage: "",
    }));
  }, []);

  const onAccountFilterPress = useCallback((accountId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedAccountFilterId: accountId,
      historyItems: filterTransactionsHistoryItems(
        currentState.allHistoryItems,
        accountId,
        currentState.selectedEntryFilter,
      ),
    }));
  }, []);

  const onEntryFilterPress = useCallback((entryFilter: TransactionsEntryFilter): void => {
    setState((currentState) => ({
      ...currentState,
      selectedEntryFilter: entryFilter,
      historyItems: filterTransactionsHistoryItems(
        currentState.allHistoryItems,
        currentState.selectedAccountFilterId,
        entryFilter,
      ),
    }));
  }, []);

  const onPartyNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      form: { ...currentState.form, partyNameInput: value },
      errorMessage: "",
    }));
  }, []);

  const onAmountChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      form: {
        ...currentState.form,
        amountInput: value.replace(/[^0-9.]/g, ""),
      },
      errorMessage: "",
    }));
  }, []);

  const onNoteChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      form: { ...currentState.form, noteInput: value },
      errorMessage: "",
    }));
  }, []);

  const onCreatePaymentPress = useCallback(async (): Promise<void> => {
    if (isSubmittingReference.current) {
      return;
    }

    isSubmittingReference.current = true;
    setState((currentState) => ({
      ...currentState,
      isSubmitting: true,
      errorMessage: "",
    }));

    try {
      const result =
        await dependencies.createTransactionsPaymentRecordUseCase.execute({
          direction: state.selectedDirection,
          partyNameInput: state.form.partyNameInput,
          amountInput: state.form.amountInput,
          noteInput: state.form.noteInput,
        });

      if (!result.success) {
        setState((currentState) =>
          createFailureTransactionsState(
            currentState,
            getTransactionsErrorMessage(result.error),
          ),
        );
        return;
      }

      setState((currentState) => ({
        ...currentState,
        isSubmitting: false,
        form: createTransactionsFormState(),
      }));
      await loadOverview();
    } finally {
      isSubmittingReference.current = false;
    }
  }, [
    dependencies.createTransactionsPaymentRecordUseCase,
    loadOverview,
    state.form.amountInput,
    state.form.noteInput,
    state.form.partyNameInput,
    state.selectedDirection,
  ]);

  const onSettlePaymentPress = useCallback(
    async (recordId: string): Promise<void> => {
      if (isSettlingReference.current) {
        return;
      }

      isSettlingReference.current = true;
      setState((currentState) => ({
        ...currentState,
        settlingRecordId: recordId,
        errorMessage: "",
      }));

      try {
        const result =
          await dependencies.settleTransactionsPaymentRecordUseCase.execute({
            recordId,
          });

        if (!result.success) {
          setState((currentState) =>
            createFailureTransactionsState(
              currentState,
              getTransactionsErrorMessage(result.error),
            ),
          );
          return;
        }

        await loadOverview();
      } finally {
        isSettlingReference.current = false;
      }
    },
    [dependencies.settleTransactionsPaymentRecordUseCase, loadOverview],
  );

  useFocusEffect(
    useCallback(() => {
      void loadOverview();
    }, [loadOverview]),
  );

  return useMemo<TransactionsViewModel>(
    () => ({
      state,
      onAddTransactionPress: dependencies.onAddTransactionPress,
      onRefreshPress: loadOverview,
      onDirectionPress,
      onAccountFilterPress,
      onEntryFilterPress,
      onPartyNameChange,
      onAmountChange,
      onNoteChange,
      onCreatePaymentPress,
      onSettlePaymentPress,
      onQuickPosPress: dependencies.onQuickPosPress,
      onTransactionPress: dependencies.onTransactionPress,
    }),
    [
      dependencies.onAddTransactionPress,
      dependencies.onQuickPosPress,
      dependencies.onTransactionPress,
      loadOverview,
      onAccountFilterPress,
      onAmountChange,
      onCreatePaymentPress,
      onDirectionPress,
      onEntryFilterPress,
      onNoteChange,
      onPartyNameChange,
      onSettlePaymentPress,
      state,
    ],
  );
};
