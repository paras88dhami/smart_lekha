import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction } from "../types/types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { GetFinanceTransactionsUseCase } from "./getFinanceTransactions.useCase";

export const createGetFinanceTransactionsUseCase = (
  repository: FinanceTransactionRepository,
): GetFinanceTransactionsUseCase => ({
  async execute(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>> {
    return repository.getByProfileId(profileId, limit);
  },
});
