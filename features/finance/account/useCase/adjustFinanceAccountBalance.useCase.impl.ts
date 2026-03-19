import type { Result } from "@/shared/types/result.types";
import type { AdjustFinanceAccountBalanceInput } from "../types/types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { AdjustFinanceAccountBalanceUseCase } from "./adjustFinanceAccountBalance.useCase";

export const createAdjustFinanceAccountBalanceUseCase = (
  repository: FinanceAccountRepository,
): AdjustFinanceAccountBalanceUseCase => ({
  async execute(input: AdjustFinanceAccountBalanceInput): Promise<Result<void>> {
    return repository.adjustBalance(input);
  },
});
