import type { ClearActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveAccountId.useCase";
import type { ClearActiveProfileIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveProfileId.useCase";
import type { CreateDefaultAppSettingUseCase } from "@/features/auth/appSettings/useCase/createDefaultAppSetting.useCase";
import type { GetAppSettingUseCase } from "@/features/auth/appSettings/useCase/getAppSetting.useCase";
import type { GetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase";
import type { GetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase";
import type { ValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase";
import { resolveAccessibleAuthSession } from "@/features/auth/session/utils/localAccessSession";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { ResolveStartupDestinationUseCase } from "./resolveStartupDestination.useCase";
import type { StartupDestination } from "../types/types";

type Dependencies = {
  createDefaultAppSettingUseCase: CreateDefaultAppSettingUseCase;
  getAppSettingUseCase: GetAppSettingUseCase;
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  validateCurrentAuthSessionUseCase: ValidateCurrentAuthSessionUseCase;
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getProfilesByAccountIdUseCase: GetProfilesByAccountIdUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
  clearActiveProfileIdUseCase: ClearActiveProfileIdUseCase;
  clearActiveAccountIdUseCase: ClearActiveAccountIdUseCase;
};

const clearStoredAppContext = async (
  dependencies: Dependencies,
): Promise<void> => {
  await dependencies.clearActiveProfileIdUseCase.execute();
  await dependencies.clearActiveAccountIdUseCase.execute();
};

const resolveAuthenticatedDestination = async (
  accountId: string,
  dependencies: Dependencies,
): Promise<StartupDestination> => {
  const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

  if (
    activeProfileResult.success &&
    activeProfileResult.value &&
    activeProfileResult.value.accountId === accountId
  ) {
    await dependencies.ensureDefaultFinanceAccountsUseCase.execute(
      activeProfileResult.value.profileId,
    );
    await dependencies.ensureDefaultHomeShortcutsUseCase.execute(
      activeProfileResult.value.profileId,
    );
    await dependencies.getActiveAccountUseCase.execute();
    return "/(tabs)/home";
  }

  await clearStoredAppContext(dependencies);

  const profilesResult = await dependencies.getProfilesByAccountIdUseCase.execute(accountId);

  if (profilesResult.success && profilesResult.value.length > 0) {
    return "/profile-selection";
  }

  return "/create-business";
};

export const createResolveStartupDestinationUseCase = (
  dependencies: Dependencies,
): ResolveStartupDestinationUseCase => ({
  async execute(): Promise<StartupDestination> {
    await dependencies.createDefaultAppSettingUseCase.execute();

    const appSettingResult = await dependencies.getAppSettingUseCase.execute();

    if (!appSettingResult.success || !appSettingResult.value?.onboardingCompleted) {
      return "/(auth)/language";
    }

    const session = await resolveAccessibleAuthSession({
      getCurrentAuthSessionUseCase: dependencies.getCurrentAuthSessionUseCase,
      validateCurrentAuthSessionUseCase: dependencies.validateCurrentAuthSessionUseCase,
    });

    if (!session?.accountId) {
      await clearStoredAppContext(dependencies);
      return "/(auth)/phone-auth";
    }

    return resolveAuthenticatedDestination(session.accountId, dependencies);
  },
});
