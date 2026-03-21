import type { Result } from "@/shared/types/result.types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { DeleteFinanceTransactionUseCase } from "./deleteFinanceTransaction.useCase";

export const createDeleteFinanceTransactionUseCase = (
  repository: FinanceTransactionRepository,
): DeleteFinanceTransactionUseCase => ({
  async execute(transactionId: string): Promise<Result<void>> {
    return repository.deleteTransaction(transactionId);
  },
});
