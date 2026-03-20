import type { ClearActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveAccountId.useCase";
import type { SetActiveProfileIdUseCase } from "@/features/auth/appSettings/useCase/setActiveProfileId.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { SetActiveProfileUseCase } from "@/features/auth/profile/useCase/setActiveProfile.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { Result } from "@/shared/types/result.types";
import type { ActivateProfileContextUseCase } from "./activateProfileContext.useCase";

type Dependencies = {
  setActiveProfileUseCase: SetActiveProfileUseCase;
  setActiveProfileIdUseCase: SetActiveProfileIdUseCase;
  clearActiveAccountIdUseCase: ClearActiveAccountIdUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
};

const createFailure = (message: string): Result<void> => {
  return { success: false, error: new Error(message) };
};

export const createActivateProfileContextUseCase = (
  dependencies: Dependencies,
): ActivateProfileContextUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const setProfileResult = await dependencies.setActiveProfileUseCase.execute(profileId);

    if (!setProfileResult.success) {
      return createFailure(setProfileResult.error.message);
    }

    const setProfileIdResult = await dependencies.setActiveProfileIdUseCase.execute(profileId);

    if (!setProfileIdResult.success) {
      return createFailure(setProfileIdResult.error.message);
    }

    const clearAccountResult = await dependencies.clearActiveAccountIdUseCase.execute();

    if (!clearAccountResult.success) {
      return createFailure(clearAccountResult.error.message);
    }

    const ensureAccountsResult =
      await dependencies.ensureDefaultFinanceAccountsUseCase.execute(profileId);

    if (!ensureAccountsResult.success) {
      return createFailure(ensureAccountsResult.error.message);
    }

    const ensureShortcutsResult =
      await dependencies.ensureDefaultHomeShortcutsUseCase.execute(profileId);

    if (!ensureShortcutsResult.success) {
      return createFailure(ensureShortcutsResult.error.message);
    }

    const activeAccountResult = await dependencies.getActiveAccountUseCase.execute();

    if (!activeAccountResult.success) {
      return createFailure(activeAccountResult.error.message);
    }

    return { success: true, value: undefined };
  },
});
