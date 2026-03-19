import type { Result } from "@/shared/types/result.types";
import type { CreateFinanceAccountInput, FinanceAccount } from "../types/types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { CreateFinanceAccountUseCase } from "./createFinanceAccount.useCase";

export const createCreateFinanceAccountUseCase = (
  repository: FinanceAccountRepository,
): CreateFinanceAccountUseCase => ({
  async execute(
    input: CreateFinanceAccountInput,
  ): Promise<Result<FinanceAccount>> {
    return repository.createAccount(input);
  },
});
