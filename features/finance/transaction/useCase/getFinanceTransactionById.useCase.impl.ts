import type { Result } from "@/shared/types/result.types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { FinanceTransaction } from "../types/types";
import type { GetFinanceTransactionByIdUseCase } from "./getFinanceTransactionById.useCase";

export const createGetFinanceTransactionByIdUseCase = (
  repository: FinanceTransactionRepository,
): GetFinanceTransactionByIdUseCase => ({
  async execute(transactionId: string): Promise<Result<FinanceTransaction>> {
    return repository.getById(transactionId);
  },
});
