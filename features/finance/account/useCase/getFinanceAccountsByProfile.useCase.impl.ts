import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount } from "../types/types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { GetFinanceAccountsByProfileUseCase } from "./getFinanceAccountsByProfile.useCase";

export const createGetFinanceAccountsByProfileUseCase = (
  repository: FinanceAccountRepository,
): GetFinanceAccountsByProfileUseCase => ({
  async execute(profileId: string): Promise<Result<FinanceAccount[]>> {
    return repository.getAccountsByProfileId(profileId);
  },
});
