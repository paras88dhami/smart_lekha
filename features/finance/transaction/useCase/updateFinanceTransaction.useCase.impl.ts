import type { Result } from "@/shared/types/result.types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { FinanceTransaction, UpdateFinanceTransactionInput } from "../types/types";
import type { UpdateFinanceTransactionUseCase } from "./updateFinanceTransaction.useCase";

export const createUpdateFinanceTransactionUseCase = (
  repository: FinanceTransactionRepository,
): UpdateFinanceTransactionUseCase => ({
  async execute(
    input: UpdateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>> {
    return repository.updateTransaction(input);
  },
});
