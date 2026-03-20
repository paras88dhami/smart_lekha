import type { SetActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/setActiveAccountId.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { Result } from "@/shared/types/result.types";
import type { SetActiveAccountUseCase } from "./setActiveAccount.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  setActiveAccountIdUseCase: SetActiveAccountIdUseCase;
};

const createFailure = (message: string): Result<void> => {
  return { success: false, error: new Error(message) };
};

const accountBelongsToProfile = (
  accountId: string,
  profileAccountIds: string[],
): boolean => {
  return profileAccountIds.includes(accountId);
};

export const createSetActiveAccountUseCase = (
  dependencies: Dependencies,
): SetActiveAccountUseCase => ({
  async execute(accountId: string): Promise<Result<void>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return {
        success: false,
        error: new Error("No active profile is available for account selection."),
      };
    }

    const accountsResult = await dependencies.getFinanceAccountsByProfileUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!accountsResult.success) {
      return createFailure(accountsResult.error.message);
    }

    const profileAccountIds = accountsResult.value.map((account) => account.id);

    if (!accountBelongsToProfile(accountId, profileAccountIds)) {
      return {
        success: false,
        error: new Error("Selected account does not belong to the active profile."),
      };
    }

    const result = await dependencies.setActiveAccountIdUseCase.execute(accountId);

    if (!result.success) {
      return createFailure(result.error.message);
    }

    return { success: true, value: undefined };
  },
});
