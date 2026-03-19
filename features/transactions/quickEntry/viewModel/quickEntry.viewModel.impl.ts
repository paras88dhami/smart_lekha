import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { QuickEntryState, QuickEntryViewModel } from "./quickEntry.viewModel";

const ENTRY_TYPES: FinanceEntryType[] = ["income", "expense", "payment_in", "payment_out"];

const getDeltaAmount = (entryType: FinanceEntryType, amount: number): number => {
  switch (entryType) {
    case "income":
    case "payment_in":
    case "transfer_in":
    case "pos_sale":
      return amount;
    case "expense":
    case "payment_out":
    case "transfer_out":
      return -amount;
    default:
      return 0;
  }
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
};

export const useQuickEntryViewModel = (params: Params): QuickEntryViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getPrimaryFinanceAccountUseCase,
    createFinanceTransactionUseCase,
    adjustFinanceAccountBalanceUseCase,
    getFinanceTransactionsUseCase,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<QuickEntryState>({
    status: Status.Idle,
    profileName: "",
    selectedEntryType: "income",
    categoryInput: "",
    counterpartyInput: "",
    amountInput: "",
    noteInput: "",
    recentEntries: [],
    errorMessage: "",
  });

  const loadEntries = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;

      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        profile.profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.loadFailed"),
        }));
        return;
      }

      const transactionsResult = await getFinanceTransactionsUseCase.execute(
        profile.profileId,
        20,
      );

      if (!transactionsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        recentEntries: transactionsResult.value.map((entry) => ({
          id: entry.id,
          title:
            entry.counterpartyName ||
            entry.categoryName ||
            entry.note ||
            translate("quickEntry.defaultTitle"),
          occurredAt: entry.occurredAt,
          amount: entry.amount,
          entryType: entry.entryType,
        })),
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultFinanceAccountsUseCase,
    getActiveProfileUseCase,
    getFinanceTransactionsUseCase,
  ]);

  const onEntryTypePress = useCallback((entryType: FinanceEntryType): void => {
    if (!ENTRY_TYPES.includes(entryType)) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      selectedEntryType: entryType,
      errorMessage: "",
    }));
  }, []);

  const onCategoryChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      categoryInput: value,
      errorMessage: "",
    }));
  }, []);

  const onCounterpartyChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      counterpartyInput: value,
      errorMessage: "",
    }));
  }, []);

  const onAmountChange = useCallback((value: string): void => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    setState((currentState) => ({
      ...currentState,
      amountInput: sanitizedValue,
      errorMessage: "",
    }));
  }, []);

  const onNoteChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      noteInput: value,
      errorMessage: "",
    }));
  }, []);

  const onSavePress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const amount = Number(state.amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("quickEntry.errors.invalidAmount"),
      }));
      return;
    }

    isSubmittingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;

      const accountResult = await getPrimaryFinanceAccountUseCase.execute(profileId);

      if (!accountResult.success || !accountResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.noPrimaryAccount"),
        }));
        return;
      }

      const createResult = await createFinanceTransactionUseCase.execute({
        profileId,
        accountId: accountResult.value.id,
        entryType: state.selectedEntryType,
        categoryName: state.categoryInput.trim() || null,
        counterpartyName: state.counterpartyInput.trim() || null,
        note: state.noteInput.trim() || null,
        status: "success",
        amount,
        occurredAt: Date.now(),
        referenceId: null,
      });

      if (!createResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.saveFailed"),
        }));
        return;
      }

      const deltaAmount = getDeltaAmount(state.selectedEntryType, amount);

      const adjustBalanceResult = await adjustFinanceAccountBalanceUseCase.execute({
        accountId: accountResult.value.id,
        deltaAmount,
      });

      if (!adjustBalanceResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickEntry.errors.saveFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        amountInput: "",
        categoryInput: "",
        counterpartyInput: "",
        noteInput: "",
      }));

      await loadEntries();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    getActiveProfileUseCase,
    getPrimaryFinanceAccountUseCase,
    loadEntries,
    state.amountInput,
    state.categoryInput,
    state.counterpartyInput,
    state.noteInput,
    state.selectedEntryType,
  ]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  return {
    state,
    onRefreshPress: loadEntries,
    onEntryTypePress,
    onCategoryChange,
    onCounterpartyChange,
    onAmountChange,
    onNoteChange,
    onSavePress,
  };
};
