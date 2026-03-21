import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { FinanceAccount, UpdateFinanceAccountInput } from "../types/types";
import type { UpdateFinanceAccountUseCase } from "./updateFinanceAccount.useCase";

export const createUpdateFinanceAccountUseCase = (
  repository: FinanceAccountRepository,
): UpdateFinanceAccountUseCase => ({
  async execute(
    input: UpdateFinanceAccountInput,
  ): Promise<Result<FinanceAccount>> {
    return repository.updateAccount(input);
  },
});
