import type { Result } from "@/shared/types/result.types";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "./cashBankError";
import { mapCashBankAccountItem } from "./cashBankData.mapper";
import type { LoadCashBankOverviewUseCase } from "./loadCashBankOverview.useCase";
import type { CashBankOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
};

const createFailure = (error: Error): Result<CashBankOverviewData> => {
  return { success: false, error };
};

export const createLoadCashBankOverviewUseCase = (
  dependencies: Dependencies,
): LoadCashBankOverviewUseCase => ({
  async execute(): Promise<Result<CashBankOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    const profileId = activeProfileResult.value.profileId;
    const ensureAccountsResult = await dependencies.ensureDefaultFinanceAccountsUseCase.execute(
      profileId,
    );
    if (!ensureAccountsResult.success) {
      return createFailure(createCashBankError("load_failed"));
    }

    const accountsResult = await dependencies.getFinanceAccountsByProfileUseCase.execute(profileId);
    if (!accountsResult.success) {
      return createFailure(createCashBankError("load_failed"));
    }

    return {
      success: true,
      value: {
        profileName: activeProfileResult.value.profileName,
        accounts: accountsResult.value.map(mapCashBankAccountItem),
      },
    };
  },
});
