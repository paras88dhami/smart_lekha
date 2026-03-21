import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import { getCashBankErrorMessage } from "@/features/cashBank/overview/viewModel/cashBankErrorMessage";
import { Status } from "@/shared/types/status.types";
import type { ArchiveCashBankAccountFormUseCase } from "../useCase/archiveCashBankAccountForm.useCase";
import type { LoadCashBankAccountFormUseCase } from "../useCase/loadCashBankAccountForm.useCase";
import type { SubmitCashBankAccountFormUseCase } from "../useCase/submitCashBankAccountForm.useCase";
import type { CashBankAccountFormViewModel } from "./cashBankAccountForm.viewModel";
import {
  createInitialCashBankAccountFormState,
  createLoadingCashBankAccountFormState,
  createSuccessCashBankAccountFormState,
} from "./cashBankAccountFormState";

type Dependencies = {
  accountId: string | null;
  loadCashBankAccountFormUseCase: LoadCashBankAccountFormUseCase;
  submitCashBankAccountFormUseCase: SubmitCashBankAccountFormUseCase;
  archiveCashBankAccountFormUseCase: ArchiveCashBankAccountFormUseCase;
  onCompleted: () => void;
};

export const useCashBankAccountFormViewModel = (
  dependencies: Dependencies,
): CashBankAccountFormViewModel => {
  const [state, setState] = useState(createInitialCashBankAccountFormState);
  const isLoadingReference = useRef<boolean>(false);

  const loadForm = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState((currentState) => createLoadingCashBankAccountFormState(currentState));

    try {
      const result = await dependencies.loadCashBankAccountFormUseCase.execute(
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

      setState(createSuccessCashBankAccountFormState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.accountId, dependencies.loadCashBankAccountFormUseCase]);

  const onAccountNameChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, accountNameInput: value, errorMessage: "" }));
  }, []);

  const onAccountNumberChange = useCallback((value: string): void => {
    setState((currentState) => ({ ...currentState, accountNumberInput: value, errorMessage: "" }));
  }, []);

  const onOpeningBalanceChange = useCallback((value: string): void => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    setState((currentState) => ({ ...currentState, openingBalanceInput: sanitizedValue, errorMessage: "" }));
  }, []);

  const onAccountTypePress = useCallback((accountType: FinanceAccountType): void => {
    setState((currentState) => ({ ...currentState, selectedAccountType: accountType, errorMessage: "" }));
  }, []);

  const onSavePress = useCallback(async (): Promise<void> => {
    if (state.isSubmitting || state.isArchiving) {
      return;
    }

    setState((currentState) => ({ ...currentState, isSubmitting: true, errorMessage: "" }));

    const result = await dependencies.submitCashBankAccountFormUseCase.execute({
      accountId: state.accountId,
      accountNameInput: state.accountNameInput,
      accountNumberInput: state.accountNumberInput,
      openingBalanceInput: state.openingBalanceInput,
      selectedAccountType: state.selectedAccountType,
    });

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        isSubmitting: false,
        errorMessage: getCashBankErrorMessage(result.error),
      }));
      return;
    }

    dependencies.onCompleted();
  }, [dependencies, state]);

  const onArchivePress = useCallback(async (): Promise<void> => {
    if (state.mode !== "edit" || state.isSubmitting || state.isArchiving) {
      return;
    }

    setState((currentState) => ({ ...currentState, isArchiving: true, errorMessage: "" }));

    const result = await dependencies.archiveCashBankAccountFormUseCase.execute(state.accountId);

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        isArchiving: false,
        errorMessage: getCashBankErrorMessage(result.error),
      }));
      return;
    }

    dependencies.onCompleted();
  }, [dependencies, state.accountId, state.isArchiving, state.isSubmitting, state.mode]);

  useEffect((): void => {
    void loadForm();
  }, [loadForm]);

  return useMemo<CashBankAccountFormViewModel>(() => {
    return {
      state,
      onRefreshPress: loadForm,
      onAccountNameChange,
      onAccountNumberChange,
      onOpeningBalanceChange,
      onAccountTypePress,
      onSavePress,
      onArchivePress,
    };
  }, [
    loadForm,
    onAccountNameChange,
    onAccountNumberChange,
    onOpeningBalanceChange,
    onAccountTypePress,
    onSavePress,
    onArchivePress,
    state,
  ]);
};
