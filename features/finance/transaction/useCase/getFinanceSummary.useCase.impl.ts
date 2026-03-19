import type { Result } from "@/shared/types/result.types";
import type { FinanceSummary } from "../types/types";
import type { FinanceTransactionRepository } from "../data/repository/financeTransaction.repository";
import type { GetFinanceSummaryUseCase } from "./getFinanceSummary.useCase";

export const createGetFinanceSummaryUseCase = (
  repository: FinanceTransactionRepository,
): GetFinanceSummaryUseCase => ({
  async execute(profileId: string): Promise<Result<FinanceSummary>> {
    return repository.getSummaryByProfileId(profileId);
  },
});
