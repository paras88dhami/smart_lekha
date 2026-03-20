import type { Result } from "@/shared/types/result.types";
import type { CreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "./cashBankError";
import type {
  CreateCashBankAccountCommand,
  CreateCashBankAccountUseCase,
} from "./createCashBankAccount.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  createFinanceAccountUseCase: CreateFinanceAccountUseCase;
};

const parseOpeningBalance = (openingBalanceInput: string): number => {
  return Number(openingBalanceInput || "0");
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createCreateCashBankAccountUseCase = (
  dependencies: Dependencies,
): CreateCashBankAccountUseCase => ({
  async execute(input: CreateCashBankAccountCommand): Promise<Result<void>> {
    const accountName = input.accountNameInput.trim();
    const accountNumber = input.accountNumberInput.trim();
    const openingBalance = parseOpeningBalance(input.openingBalanceInput);

    if (accountName.length < 2) {
      return createFailure(createCashBankError("invalid_name"));
    }

    if (!Number.isFinite(openingBalance) || openingBalance < 0) {
      return createFailure(createCashBankError("invalid_opening_balance"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    const accountsResult = await dependencies.getFinanceAccountsByProfileUseCase.execute(
      activeProfileResult.value.profileId,
    );
    if (!accountsResult.success) {
      return createFailure(createCashBankError("load_failed"));
    }

    const createAccountResult = await dependencies.createFinanceAccountUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      accountName,
      accountNumber: accountNumber || null,
      accountType: input.selectedAccountType,
      isPrimary: !accountsResult.value.some((account) => account.isPrimary),
      currencyCode: "NPR",
      currentBalance: openingBalance,
    });
    if (!createAccountResult.success) {
      return createFailure(createCashBankError("create_failed"));
    }

    return { success: true, value: undefined };
  },
});
