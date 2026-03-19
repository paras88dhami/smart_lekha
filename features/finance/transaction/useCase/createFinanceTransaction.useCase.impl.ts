import type { Result } from "@/shared/types/result.types";
import type {
  CreateFinanceTransactionInput,
  FinanceTransaction,
} from "../types/types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { CreateFinanceTransactionUseCase } from "./createFinanceTransaction.useCase";

export const createCreateFinanceTransactionUseCase = (
  repository: FinanceTransactionRepository,
): CreateFinanceTransactionUseCase => ({
  async execute(
    input: CreateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>> {
    return repository.createTransaction(input);
  },
});
