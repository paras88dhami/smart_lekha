import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { Result } from "@/shared/types/result.types";
import {
  executeBeneficiaryTransferRecord,
  executeOwnAccountTransferRecord,
  loadTransferAccount,
} from "./executeTransferRecord.helpers";
import type {
  ExecuteTransferRecordInput,
  ExecuteTransferRecordUseCase,
} from "./executeTransferRecord.useCase";

type Dependencies = {
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
};

export const createExecuteTransferRecordUseCase = (
  dependencies: Dependencies,
): ExecuteTransferRecordUseCase => ({
  async execute(input: ExecuteTransferRecordInput): Promise<Result<void>> {
    const sourceAccountResult = await loadTransferAccount(
      input.transferRecord.fromAccountId,
      input.transferRecord.profileId,
      dependencies.getFinanceAccountByIdUseCase,
    );

    if (!sourceAccountResult.success) {
      return sourceAccountResult;
    }

    if (input.transferRecord.targetType === "own_account") {
      return executeOwnAccountTransferRecord(
        input.transferRecord,
        sourceAccountResult.value,
        dependencies.getFinanceAccountByIdUseCase,
        dependencies.createFinanceTransactionUseCase,
        dependencies.adjustFinanceAccountBalanceUseCase,
      );
    }

    return executeBeneficiaryTransferRecord(
      input.transferRecord,
      sourceAccountResult.value,
      dependencies.createFinanceTransactionUseCase,
      dependencies.adjustFinanceAccountBalanceUseCase,
    );
  },
});
