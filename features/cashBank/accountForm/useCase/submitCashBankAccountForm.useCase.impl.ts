import type { Result } from "@/shared/types/result.types";
import type { CreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { UpdateFinanceAccountUseCase } from "@/features/finance/account/useCase/updateFinanceAccount.useCase";
import type { SetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/setActiveAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "@/features/cashBank/overview/useCase/cashBankError";
import type {
  SubmitCashBankAccountFormCommand,
  SubmitCashBankAccountFormUseCase,
} from "./submitCashBankAccountForm.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
  createFinanceAccountUseCase: CreateFinanceAccountUseCase;
  updateFinanceAccountUseCase: UpdateFinanceAccountUseCase;
  setActiveAccountUseCase: SetActiveAccountUseCase;
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

const parseOpeningBalance = (openingBalanceInput: string): number => {
  return Number(openingBalanceInput || "0");
};

export const createSubmitCashBankAccountFormUseCase = (
  dependencies: Dependencies,
): SubmitCashBankAccountFormUseCase => ({
  async execute(command: SubmitCashBankAccountFormCommand): Promise<Result<void>> {
    const accountName = command.accountNameInput.trim();
    const accountNumber = command.accountNumberInput.trim();
    const openingBalance = parseOpeningBalance(command.openingBalanceInput);

    if (accountName.length < 2) {
      return createFailure(createCashBankError("invalid_name"));
    }

    if (!command.accountId && (!Number.isFinite(openingBalance) || openingBalance < 0)) {
      return createFailure(createCashBankError("invalid_opening_balance"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    if (!command.accountId) {
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
        accountType: command.selectedAccountType,
        isPrimary: !accountsResult.value.some((account) => account.isPrimary),
        currencyCode: "NPR",
        currentBalance: openingBalance,
      });

      if (!createAccountResult.success) {
        return createFailure(createCashBankError("create_failed"));
      }

      if (createAccountResult.value.isPrimary) {
        const setActiveAccountResult = await dependencies.setActiveAccountUseCase.execute(
          createAccountResult.value.id,
        );

        if (!setActiveAccountResult.success) {
          return createFailure(createCashBankError("create_failed"));
        }
      }

      return { success: true, value: undefined };
    }

    const accountResult = await dependencies.getFinanceAccountByIdUseCase.execute(command.accountId);

    if (
      !accountResult.success ||
      accountResult.value.profileId !== activeProfileResult.value.profileId ||
      accountResult.value.isArchived
    ) {
      return createFailure(createCashBankError("account_not_found"));
    }

    const updateAccountResult = await dependencies.updateFinanceAccountUseCase.execute({
      accountId: accountResult.value.id,
      accountName,
      accountNumber: accountNumber || null,
      accountType: command.selectedAccountType,
    });

    if (!updateAccountResult.success) {
      return createFailure(createCashBankError("update_failed"));
    }

    return { success: true, value: undefined };
  },
});
