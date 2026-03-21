import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { DeleteFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/deleteFinanceTransaction.useCase";
import type { GetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "@/features/transactions/overview/useCase/transactionsError";
import {
  getFinanceTransactionBalanceDelta,
  isManualFinanceTransactionEditable,
} from "@/features/transactions/shared/transactionEntryRule";
import type { DeleteTransactionDetailUseCase } from "./deleteTransactionDetail.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceTransactionByIdUseCase: GetFinanceTransactionByIdUseCase;
  deleteFinanceTransactionUseCase: DeleteFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
};

export const createDeleteTransactionDetailUseCase = (
  dependencies: Dependencies,
): DeleteTransactionDetailUseCase => ({
  async execute(transactionId: string): Promise<TransactionsResult<void>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createTransactionsFailure("noActiveProfile");
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

    const balanceDelta = getFinanceTransactionBalanceDelta(
      transactionResult.value.entryType,
      transactionResult.value.amount,
    );

    if (transactionResult.value.accountId) {
      const adjustBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
        accountId: transactionResult.value.accountId,
        deltaAmount: balanceDelta * -1,
      });

      if (!adjustBalanceResult.success) {
        return createTransactionsFailure("deleteFailed", adjustBalanceResult.error);
      }
    }

    const deleteTransactionResult = await dependencies.deleteFinanceTransactionUseCase.execute(
      transactionId,
    );

    if (!deleteTransactionResult.success) {
      if (transactionResult.value.accountId) {
        await dependencies.adjustFinanceAccountBalanceUseCase.execute({
          accountId: transactionResult.value.accountId,
          deltaAmount: balanceDelta,
        });
      }

      return createTransactionsFailure("deleteFailed", deleteTransactionResult.error);
    }

    return { success: true, value: undefined };
  },
});
