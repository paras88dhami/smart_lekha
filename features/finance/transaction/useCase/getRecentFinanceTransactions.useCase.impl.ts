import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction } from "../types/types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { GetRecentFinanceTransactionsUseCase } from "./getRecentFinanceTransactions.useCase";

export const createGetRecentFinanceTransactionsUseCase = (
  repository: FinanceTransactionRepository,
): GetRecentFinanceTransactionsUseCase => ({
  async execute(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>> {
    return repository.getRecentByProfileId(profileId, limit);
  },
});
