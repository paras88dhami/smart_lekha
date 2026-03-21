import type { Result } from "@/shared/types/result.types";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "@/features/cashBank/overview/useCase/cashBankError";
import type { CashBankAccountFormData } from "../types/types";
import type { LoadCashBankAccountFormUseCase } from "./loadCashBankAccountForm.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
};

const createFailure = (error: Error): Result<CashBankAccountFormData> => {
  return { success: false, error };
};

export const createLoadCashBankAccountFormUseCase = (
  dependencies: Dependencies,
): LoadCashBankAccountFormUseCase => ({
  async execute(accountId: string | null): Promise<Result<CashBankAccountFormData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    if (!accountId) {
      return {
        success: true,
        value: {
          accountId: null,
          profileName: activeProfileResult.value.profileName,
          mode: "create",
          accountNameInput: "",
          accountNumberInput: "",
          openingBalanceInput: "",
          selectedAccountType: "cash",
          currentBalance: 0,
        },
      };
    }

    const accountResult = await dependencies.getFinanceAccountByIdUseCase.execute(accountId);

    if (
      !accountResult.success ||
      accountResult.value.profileId !== activeProfileResult.value.profileId ||
      accountResult.value.isArchived
    ) {
      return createFailure(createCashBankError("account_not_found"));
    }

    return {
      success: true,
      value: {
        accountId: accountResult.value.id,
        profileName: activeProfileResult.value.profileName,
        mode: "edit",
        accountNameInput: accountResult.value.accountName,
        accountNumberInput: accountResult.value.accountNumber ?? "",
        openingBalanceInput: "",
        selectedAccountType: accountResult.value.accountType,
        currentBalance: accountResult.value.currentBalance,
      },
    };
  },
});
