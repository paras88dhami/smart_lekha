import type { Result } from "@/shared/types/result.types";
import type { SetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/setPrimaryFinanceAccount.useCase";
import type { SetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/setActiveAccount.useCase";
import { createCashBankError } from "./cashBankError";
import type { SetCashBankPrimaryAccountUseCase } from "./setCashBankPrimaryAccount.useCase";

type Dependencies = {
  setPrimaryFinanceAccountUseCase: SetPrimaryFinanceAccountUseCase;
  setActiveAccountUseCase: SetActiveAccountUseCase;
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

    const setActiveAccountResult = await dependencies.setActiveAccountUseCase.execute(
      accountId,
    );

    if (!setActiveAccountResult.success) {
      return createFailure(createCashBankError("set_primary_failed"));
    }

    return { success: true, value: undefined };
  },
});
