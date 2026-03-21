import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { DeleteFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/deleteFinanceTransaction.useCase";
import type { GetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase";
import type { UpdateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/updateFinanceTransaction.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "@/features/transactions/overview/useCase/transactionsError";
import {
  getFinanceTransactionBalanceDelta,
  isManualFinanceTransactionEditable,
} from "@/features/transactions/shared/transactionEntryRule";
import type {
  SubmitTransactionFormCommand,
  SubmitTransactionFormUseCase,
} from "./submitTransactionForm.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getFinanceTransactionByIdUseCase: GetFinanceTransactionByIdUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  updateFinanceTransactionUseCase: UpdateFinanceTransactionUseCase;
  deleteFinanceTransactionUseCase: DeleteFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
};

const parseAmount = (amountInput: string): number => {
  return Number(amountInput);
};

const parseOccurredAt = (occurredOnInput: string): number | null => {
  const parsedDate = new Date(`${occurredOnInput}T12:00:00`).getTime();
  return Number.isFinite(parsedDate) ? parsedDate : null;
};

const revertUpdatedTransaction = async (
  dependencies: Dependencies,
  transactionId: string,
  accountId: string | null,
  entryType: SubmitTransactionFormCommand["selectedEntryType"],
  categoryName: string | null,
  counterpartyName: string | null,
  note: string | null,
  status: "success" | "pending" | "failed",
  amount: number,
  occurredAt: number,
  referenceId: string | null,
): Promise<void> => {
  await dependencies.updateFinanceTransactionUseCase.execute({
    transactionId,
    accountId,
    entryType,
    categoryName,
    counterpartyName,
    note,
    status,
    amount,
    occurredAt,
    referenceId,
  });
};

export const createSubmitTransactionFormUseCase = (
  dependencies: Dependencies,
): SubmitTransactionFormUseCase => ({
  async execute(command: SubmitTransactionFormCommand): Promise<TransactionsResult<void>> {
    const amount = parseAmount(command.amountInput);
    const occurredAt = parseOccurredAt(command.occurredOnInput);

    if (!command.selectedAccountId.trim()) {
      return createTransactionsFailure("noAccountSelected");
    }

    if (!Number.isFinite(amount) || amount <= 0 || !occurredAt) {
      return createTransactionsFailure("invalidAmount");
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createTransactionsFailure("noActiveProfile");
    }

    const accountsResult = await dependencies.getFinanceAccountsByProfileUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!accountsResult.success) {
      return createTransactionsFailure("loadFailed", accountsResult.error);
    }

    const selectedAccount = accountsResult.value.find(
      (account) => account.id === command.selectedAccountId,
    );

    if (!selectedAccount) {
      return createTransactionsFailure("noAccountSelected");
    }

    const categoryName = command.categoryInput.trim() || null;
    const counterpartyName = command.counterpartyInput.trim() || null;
    const note = command.noteInput.trim() || null;
    const balanceDelta = getFinanceTransactionBalanceDelta(command.selectedEntryType, amount);

    if (!command.transactionId) {
      const createTransactionResult = await dependencies.createFinanceTransactionUseCase.execute({
        profileId: activeProfileResult.value.profileId,
        accountId: selectedAccount.id,
        entryType: command.selectedEntryType,
        categoryName,
        counterpartyName,
        note,
        status: "success",
        amount,
        occurredAt,
        referenceId: null,
      });

      if (!createTransactionResult.success) {
        return createTransactionsFailure("saveFailed", createTransactionResult.error);
      }

      const adjustBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
        accountId: selectedAccount.id,
        deltaAmount: balanceDelta,
      });

      if (!adjustBalanceResult.success) {
        await dependencies.deleteFinanceTransactionUseCase.execute(createTransactionResult.value.id);
        return createTransactionsFailure("saveFailed", adjustBalanceResult.error);
      }

      return { success: true, value: undefined };
    }

    const originalTransactionResult = await dependencies.getFinanceTransactionByIdUseCase.execute(
      command.transactionId,
    );

    if (
      !originalTransactionResult.success ||
      originalTransactionResult.value.profileId !== activeProfileResult.value.profileId
    ) {
      return createTransactionsFailure("transactionNotFound");
    }

    if (!isManualFinanceTransactionEditable(originalTransactionResult.value)) {
      return createTransactionsFailure("editLocked");
    }

    const originalTransaction = originalTransactionResult.value;
    const originalBalanceDelta = getFinanceTransactionBalanceDelta(
      originalTransaction.entryType,
      originalTransaction.amount,
    );

    const updateTransactionResult = await dependencies.updateFinanceTransactionUseCase.execute({
      transactionId: originalTransaction.id,
      accountId: selectedAccount.id,
      entryType: command.selectedEntryType,
      categoryName,
      counterpartyName,
      note,
      status: "success",
      amount,
      occurredAt,
      referenceId: originalTransaction.referenceId,
    });

    if (!updateTransactionResult.success) {
      return createTransactionsFailure("updateFailed", updateTransactionResult.error);
    }

    if (originalTransaction.accountId === selectedAccount.id) {
      const netDelta = balanceDelta - originalBalanceDelta;

      if (netDelta === 0) {
        return { success: true, value: undefined };
      }

      const adjustBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
        accountId: selectedAccount.id,
        deltaAmount: netDelta,
      });

      if (!adjustBalanceResult.success) {
        await revertUpdatedTransaction(
          dependencies,
          originalTransaction.id,
          originalTransaction.accountId,
          originalTransaction.entryType,
          originalTransaction.categoryName,
          originalTransaction.counterpartyName,
          originalTransaction.note,
          originalTransaction.status,
          originalTransaction.amount,
          originalTransaction.occurredAt,
          originalTransaction.referenceId,
        );
        return createTransactionsFailure("updateFailed", adjustBalanceResult.error);
      }

      return { success: true, value: undefined };
    }

    if (originalTransaction.accountId) {
      const reverseOldBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
        accountId: originalTransaction.accountId,
        deltaAmount: originalBalanceDelta * -1,
      });

      if (!reverseOldBalanceResult.success) {
        await revertUpdatedTransaction(
          dependencies,
          originalTransaction.id,
          originalTransaction.accountId,
          originalTransaction.entryType,
          originalTransaction.categoryName,
          originalTransaction.counterpartyName,
          originalTransaction.note,
          originalTransaction.status,
          originalTransaction.amount,
          originalTransaction.occurredAt,
          originalTransaction.referenceId,
        );
        return createTransactionsFailure("updateFailed", reverseOldBalanceResult.error);
      }
    }

    const applyNewBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
      accountId: selectedAccount.id,
      deltaAmount: balanceDelta,
    });

    if (!applyNewBalanceResult.success) {
      if (originalTransaction.accountId) {
        await dependencies.adjustFinanceAccountBalanceUseCase.execute({
          accountId: originalTransaction.accountId,
          deltaAmount: originalBalanceDelta,
        });
      }

      await revertUpdatedTransaction(
        dependencies,
        originalTransaction.id,
        originalTransaction.accountId,
        originalTransaction.entryType,
        originalTransaction.categoryName,
        originalTransaction.counterpartyName,
        originalTransaction.note,
        originalTransaction.status,
        originalTransaction.amount,
        originalTransaction.occurredAt,
        originalTransaction.referenceId,
      );
      return createTransactionsFailure("updateFailed", applyNewBalanceResult.error);
    }

    return { success: true, value: undefined };
  },
});
