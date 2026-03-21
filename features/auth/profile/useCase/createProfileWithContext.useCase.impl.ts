import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { SetActiveProfileIdUseCase } from "@/features/auth/appSettings/useCase/setActiveProfileId.useCase";
import type { ClearActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveAccountId.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { ProfileModel } from "../data/dataSource/profile.model";
import type { CreateProfileRepositoryInput } from "../types/types";
import type { CreateProfileUseCase } from "./createProfile.useCase";
import type { CreateProfileWithContextUseCase } from "./createProfileWithContext.useCase";

type Dependencies = {
  createProfileUseCase: CreateProfileUseCase;
  setActiveProfileIdUseCase: SetActiveProfileIdUseCase;
  clearActiveAccountIdUseCase: ClearActiveAccountIdUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
};

const createFailure = (): AuthResult<ProfileModel> => {
  return { success: false, error: AuthDatabaseError };
};

export const createCreateProfileWithContextUseCase = (
  dependencies: Dependencies,
): CreateProfileWithContextUseCase => ({
  async execute(
    input: CreateProfileRepositoryInput,
  ): Promise<AuthResult<ProfileModel>> {
    const profileResult = await dependencies.createProfileUseCase.execute(input);

    if (!profileResult.success) {
      return profileResult;
    }

    const profileId = profileResult.value.id;
    const setActiveProfileIdResult =
      await dependencies.setActiveProfileIdUseCase.execute(profileId);

    if (!setActiveProfileIdResult.success) {
      return createFailure();
    }

    const clearActiveAccountResult =
      await dependencies.clearActiveAccountIdUseCase.execute();

    if (!clearActiveAccountResult.success) {
      return createFailure();
    }

    const ensureAccountsResult =
      await dependencies.ensureDefaultFinanceAccountsUseCase.execute(profileId);

    if (!ensureAccountsResult.success) {
      return createFailure();
    }

    const ensureShortcutsResult =
      await dependencies.ensureDefaultHomeShortcutsUseCase.execute(profileId);

    if (!ensureShortcutsResult.success) {
      return createFailure();
    }

    const activeAccountResult = await dependencies.getActiveAccountUseCase.execute();

    if (!activeAccountResult.success) {
      return createFailure();
    }

    return profileResult;
  },
});
