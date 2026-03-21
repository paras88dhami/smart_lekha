import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "@/features/transactions/overview/useCase/transactionsError";
import { isManualFinanceTransactionEditable } from "@/features/transactions/shared/transactionEntryRule";
import type { TransactionFormAccountOption, TransactionFormData } from "../types/types";
import type { LoadTransactionFormUseCase } from "./loadTransactionForm.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
  getFinanceTransactionByIdUseCase: GetFinanceTransactionByIdUseCase;
};

const formatOccurredOnInput = (occurredAt: number): string => {
  return new Date(occurredAt).toISOString().slice(0, 10);
};

const mapAccountOption = (
  id: string,
  accountName: string,
): TransactionFormAccountOption => {
  return { id, accountName };
};

export const createLoadTransactionFormUseCase = (
  dependencies: Dependencies,
): LoadTransactionFormUseCase => ({
  async execute(transactionId: string | null): Promise<TransactionsResult<TransactionFormData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createTransactionsFailure("noActiveProfile");
    }

    const ensureAccountsResult = await dependencies.ensureDefaultFinanceAccountsUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!ensureAccountsResult.success) {
      return createTransactionsFailure("loadFailed", ensureAccountsResult.error);
    }

    const accountsResult = await dependencies.getFinanceAccountsByProfileUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!accountsResult.success || accountsResult.value.length === 0) {
      return createTransactionsFailure(
        "loadFailed",
        accountsResult.success ? null : accountsResult.error,
      );
    }

    const accountOptions = accountsResult.value.map((account) =>
      mapAccountOption(account.id, account.accountName),
    );

    if (!transactionId) {
      const activeAccountResult = await dependencies.getActiveAccountUseCase.execute();
      const defaultAccountId =
        activeAccountResult.success && activeAccountResult.value
          ? activeAccountResult.value.id
          : accountOptions[0].id;

      return {
        success: true,
        value: {
          transactionId: null,
          profileName: activeProfileResult.value.profileName,
          selectedAccountId: defaultAccountId,
          selectedEntryType: "expense",
          amountInput: "",
          categoryInput: "",
          counterpartyInput: "",
          noteInput: "",
          occurredOnInput: formatOccurredOnInput(Date.now()),
          accountOptions,
        },
      };
    }

    const transactionResult = await dependencies.getFinanceTransactionByIdUseCase.execute(
      transactionId,
    );

    if (
      !transactionResult.success ||
      transactionResult.value.profileId !== activeProfileResult.value.profileId
    ) {
      return createTransactionsFailure("transactionNotFound");
    }

    if (!isManualFinanceTransactionEditable(transactionResult.value)) {
      return createTransactionsFailure("editLocked");
    }

    return {
      success: true,
      value: {
        transactionId: transactionResult.value.id,
        profileName: activeProfileResult.value.profileName,
        selectedAccountId: transactionResult.value.accountId ?? accountOptions[0].id,
        selectedEntryType: transactionResult.value.entryType,
        amountInput: String(transactionResult.value.amount),
        categoryInput: transactionResult.value.categoryName ?? "",
        counterpartyInput: transactionResult.value.counterpartyName ?? "",
        noteInput: transactionResult.value.note ?? "",
        occurredOnInput: formatOccurredOnInput(transactionResult.value.occurredAt),
        accountOptions,
      },
    };
  },
});
