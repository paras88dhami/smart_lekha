import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountRepository } from "../data/repository/financeAccount.repository";
import type { EnsureDefaultFinanceAccountsUseCase } from "./ensureDefaultFinanceAccounts.useCase";

export const createEnsureDefaultFinanceAccountsUseCase = (
  repository: FinanceAccountRepository,
): EnsureDefaultFinanceAccountsUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const accountsResult = await repository.getAccountsByProfileId(profileId);

    if (!accountsResult.success) {
      return accountsResult;
    }

    if (accountsResult.value.length > 0) {
      return {
        success: true,
        value: undefined,
      };
    }

    const cashAccountResult = await repository.createAccount({
      profileId,
      accountName: "Cash Wallet",
      accountNumber: null,
      accountType: "cash",
      isPrimary: true,
      currencyCode: "NPR",
      currentBalance: 0,
    });

    if (!cashAccountResult.success) {
      return {
        success: false,
        error: cashAccountResult.error,
      };
    }

    const bankAccountResult = await repository.createAccount({
      profileId,
      accountName: "General Savings",
      accountNumber: null,
      accountType: "bank",
      isPrimary: false,
      currencyCode: "NPR",
      currentBalance: 0,
    });

    if (!bankAccountResult.success) {
      return {
        success: false,
        error: bankAccountResult.error,
      };
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
