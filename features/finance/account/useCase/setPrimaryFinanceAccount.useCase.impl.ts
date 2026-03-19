import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { SetPrimaryFinanceAccountUseCase } from "./setPrimaryFinanceAccount.useCase";

export const createSetPrimaryFinanceAccountUseCase = (
  repository: FinanceAccountRepository,
): SetPrimaryFinanceAccountUseCase => ({
  async execute(accountId: string): Promise<Result<void>> {
    return repository.setPrimaryAccount(accountId);
  },
});
