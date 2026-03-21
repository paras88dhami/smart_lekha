import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { ArchiveFinanceAccountUseCase } from "./archiveFinanceAccount.useCase";

export const createArchiveFinanceAccountUseCase = (
  repository: FinanceAccountRepository,
): ArchiveFinanceAccountUseCase => ({
  async execute(accountId: string): Promise<Result<void>> {
    return repository.archiveAccount(accountId);
  },
});
