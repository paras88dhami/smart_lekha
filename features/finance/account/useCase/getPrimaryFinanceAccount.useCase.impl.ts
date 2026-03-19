import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount } from "../types/types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { GetPrimaryFinanceAccountUseCase } from "./getPrimaryFinanceAccount.useCase";

export const createGetPrimaryFinanceAccountUseCase = (
  repository: FinanceAccountRepository,
): GetPrimaryFinanceAccountUseCase => ({
  async execute(profileId: string): Promise<Result<FinanceAccount | null>> {
    return repository.getPrimaryAccountByProfileId(profileId);
  },
});
