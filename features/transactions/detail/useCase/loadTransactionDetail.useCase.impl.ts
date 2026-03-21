import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "@/features/transactions/overview/useCase/transactionsError";
import { isManualFinanceTransactionEditable } from "@/features/transactions/shared/transactionEntryRule";
import type { TransactionDetailData } from "../types/types";
import type { LoadTransactionDetailUseCase } from "./loadTransactionDetail.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceTransactionByIdUseCase: GetFinanceTransactionByIdUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
};

export const createLoadTransactionDetailUseCase = (
  dependencies: Dependencies,
): LoadTransactionDetailUseCase => ({
  async execute(transactionId: string): Promise<TransactionsResult<TransactionDetailData>> {
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

    let accountName: string | null = null;

    if (transactionResult.value.accountId) {
      const accountResult = await dependencies.getFinanceAccountByIdUseCase.execute(
        transactionResult.value.accountId,
      );
      if (accountResult.success) {
        accountName = accountResult.value.accountName;
      }
    }

    return {
      success: true,
      value: {
        transactionId: transactionResult.value.id,
        accountName,
        amount: transactionResult.value.amount,
        occurredAt: transactionResult.value.occurredAt,
        entryType: transactionResult.value.entryType,
        categoryName: transactionResult.value.categoryName,
        counterpartyName: transactionResult.value.counterpartyName,
        note: transactionResult.value.note,
        canEdit: isManualFinanceTransactionEditable(transactionResult.value),
      },
    };
  },
});
