import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { SetActiveProfileIdUseCase } from "@/features/auth/appSettings/useCase/setActiveProfileId.useCase";
import type { ClearActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveAccountId.useCase";
import type { CreateProfileUseCase } from "@/features/auth/profile/useCase/createProfile.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type {
  CreateBusinessProfileBootstrapInput,
  CreateBusinessProfileBootstrapUseCase,
} from "./createBusinessProfileBootstrap.useCase";

type Dependencies = {
  createProfileUseCase: CreateProfileUseCase;
  setActiveProfileIdUseCase: SetActiveProfileIdUseCase;
  clearActiveAccountIdUseCase: ClearActiveAccountIdUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
};

const createFailure = (): AuthResult<void> => {
  return { success: false, error: AuthDatabaseError };
};

export const createCreateBusinessProfileBootstrapUseCase = (
  dependencies: Dependencies,
): CreateBusinessProfileBootstrapUseCase => ({
  async execute(
    input: CreateBusinessProfileBootstrapInput,
  ): Promise<AuthResult<void>> {
    const profileResult = await dependencies.createProfileUseCase.execute({
      accountId: input.accountId,
      profileType: "business",
      profileName: input.profileName,
      displayName: input.profileName,
      roleName: "Owner",
      businessCategoryId: input.businessCategoryId,
      businessCategoryName: input.businessCategoryName,
      isActive: true,
    });

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

    return { success: true, value: undefined };
  },
});
