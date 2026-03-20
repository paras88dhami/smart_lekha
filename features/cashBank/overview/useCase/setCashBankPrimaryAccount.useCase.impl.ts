import type { Result } from "@/shared/types/result.types";
import type { SetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/setPrimaryFinanceAccount.useCase";
import { createCashBankError } from "./cashBankError";
import type { SetCashBankPrimaryAccountUseCase } from "./setCashBankPrimaryAccount.useCase";

type Dependencies = {
  setPrimaryFinanceAccountUseCase: SetPrimaryFinanceAccountUseCase;
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createSetCashBankPrimaryAccountUseCase = (
  dependencies: Dependencies,
): SetCashBankPrimaryAccountUseCase => ({
  async execute(accountId: string): Promise<Result<void>> {
    const result = await dependencies.setPrimaryFinanceAccountUseCase.execute(accountId);
    if (!result.success) {
      return createFailure(createCashBankError("set_primary_failed"));
    }

    return { success: true, value: undefined };
  },
});
