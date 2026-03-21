import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { FinanceAccount } from "../types/types";
import type { GetFinanceAccountByIdUseCase } from "./getFinanceAccountById.useCase";

export const createGetFinanceAccountByIdUseCase = (
  repository: FinanceAccountRepository,
): GetFinanceAccountByIdUseCase => ({
  async execute(accountId: string): Promise<Result<FinanceAccount>> {
    return repository.getAccountById(accountId);
  },
});
