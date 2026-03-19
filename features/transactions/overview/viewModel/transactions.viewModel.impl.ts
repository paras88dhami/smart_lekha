import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type {
  TransactionsListItem,
  TransactionsState,
  TransactionsViewModel,
} from "./transactions.viewModel";

const mapTransaction = (transaction: {
  id: string;
  categoryName: string | null;
  counterpartyName: string | null;
  note: string | null;
  occurredAt: number;
  amount: number;
  entryType:
    | "income"
    | "expense"
    | "payment_in"
    | "payment_out"
    | "transfer_out"
    | "transfer_in"
    | "pos_sale";
  status: "success" | "pending" | "failed";
}): TransactionsListItem => {
  const title =
    transaction.counterpartyName ||
    transaction.categoryName ||
    transaction.note ||
    translate("transactions.defaultTitle");

  return {
    id: transaction.id,
    title,
    subtitle: new Date(transaction.occurredAt).toLocaleString(),
    occurredAt: transaction.occurredAt,
    amount: transaction.amount,
    entryType: transaction.entryType,
    statusLabel: transaction.status.toUpperCase(),
  };
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  onQuickPosPress: () => void;
};

export const useTransactionsViewModel = (
  params: Params,
): TransactionsViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getPrimaryFinanceAccountUseCase,
    getFinanceTransactionsUseCase,
    createFinanceTransactionUseCase,
    adjustFinanceAccountBalanceUseCase,
    onQuickPosPress,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<TransactionsState>({
    status: Status.Idle,
    transactions: [],
    selectedEntryType: "payment_in",
    amountInput: "",
    noteInput: "",
    errorMessage: "",
  });

  const loadTransactions = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("transactions.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;

      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("transactions.errors.loadFailed"),
        }));
        return;
      }

      const transactionsResult = await getFinanceTransactionsUseCase.execute(
        profileId,
        50,
      );

      if (!transactionsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("transactions.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        transactions: transactionsResult.value.map((transaction) =>
          mapTransaction(transaction),
        ),
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

  const onEntryTypePress = useCallback((entryType: "payment_in" | "payment_out"): void => {
    setState((currentState) => ({
      ...currentState,
      selectedEntryType: entryType,
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

  const onAddEntryPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const parsedAmount = Number(state.amountInput);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("transactions.errors.invalidAmount"),
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
          errorMessage: translate("transactions.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;
      const accountResult = await getPrimaryFinanceAccountUseCase.execute(profileId);

      if (!accountResult.success || !accountResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("transactions.errors.noPrimaryAccount"),
        }));
        return;
      }

      const createResult = await createFinanceTransactionUseCase.execute({
        profileId,
        accountId: accountResult.value.id,
        entryType: state.selectedEntryType,
        categoryName: "Payment",
        counterpartyName: null,
        note: state.noteInput.trim() || null,
        status: "success",
        amount: parsedAmount,
        occurredAt: Date.now(),
        referenceId: null,
      });

      if (!createResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("transactions.errors.saveFailed"),
        }));
        return;
      }

      const balanceDelta =
        state.selectedEntryType === "payment_in" ? parsedAmount : -parsedAmount;

      const balanceUpdateResult = await adjustFinanceAccountBalanceUseCase.execute({
        accountId: accountResult.value.id,
        deltaAmount: balanceDelta,
      });

      if (!balanceUpdateResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("transactions.errors.saveFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        amountInput: "",
        noteInput: "",
      }));

      await loadTransactions();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    getActiveProfileUseCase,
    getPrimaryFinanceAccountUseCase,
    loadTransactions,
    state.amountInput,
    state.noteInput,
    state.selectedEntryType,
  ]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  return {
    state,
    onRefreshPress: loadTransactions,
    onEntryTypePress,
    onAmountChange,
    onNoteChange,
    onAddEntryPress,
    onQuickPosPress,
  };
};
