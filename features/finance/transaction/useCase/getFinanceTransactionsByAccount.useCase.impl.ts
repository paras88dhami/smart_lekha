import type { Result } from "@/shared/types/result.types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { FinanceTransaction } from "../types/types";
import type { GetFinanceTransactionsByAccountUseCase } from "./getFinanceTransactionsByAccount.useCase";

export const createGetFinanceTransactionsByAccountUseCase = (
  repository: FinanceTransactionRepository,
): GetFinanceTransactionsByAccountUseCase => ({
  async execute(
    accountId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>> {
    return repository.getByAccountId(accountId, limit);
  },
});
