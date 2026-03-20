import type { GetAppSettingUseCase } from "@/features/auth/appSettings/useCase/getAppSetting.useCase";
import type { SetActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/setActiveAccountId.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { Result } from "@/shared/types/result.types";
import type { GetActiveAccountUseCase } from "./getActiveAccount.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getAppSettingUseCase: GetAppSettingUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  setActiveAccountIdUseCase: SetActiveAccountIdUseCase;
};

const createFailure = (message: string): Result<FinanceAccount | null> => {
  return { success: false, error: new Error(message) };
};

const findStoredActiveAccount = (
  accounts: FinanceAccount[],
  storedActiveAccountId: string,
): FinanceAccount | null => {
  return accounts.find((account) => account.id === storedActiveAccountId) ?? null;
};

const persistResolvedAccountId = async (
  accountId: string,
  setActiveAccountIdUseCase: SetActiveAccountIdUseCase,
): Promise<Result<void>> => {
  const result = await setActiveAccountIdUseCase.execute(accountId);

  if (!result.success) {
    return { success: false, error: new Error(result.error.message) };
  }

  return { success: true, value: undefined };
};

export const createGetActiveAccountUseCase = (
  dependencies: Dependencies,
): GetActiveAccountUseCase => ({
  async execute(): Promise<Result<FinanceAccount | null>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return { success: true, value: null };
    }

    const [appSettingResult, accountsResult] = await Promise.all([
      dependencies.getAppSettingUseCase.execute(),
      dependencies.getFinanceAccountsByProfileUseCase.execute(
        activeProfileResult.value.profileId,
      ),
    ]);

    if (!appSettingResult.success) {
      return createFailure(appSettingResult.error.message);
    }

    if (!accountsResult.success) {
      return createFailure(accountsResult.error.message);
    }

    if (accountsResult.value.length <= 0) {
      return { success: true, value: null };
    }

    const storedActiveAccountId = appSettingResult.value?.activeAccountId?.trim() ?? "";
    const storedActiveAccount = findStoredActiveAccount(
      accountsResult.value,
      storedActiveAccountId,
    );

    if (storedActiveAccount) {
      return { success: true, value: storedActiveAccount };
    }

    const primaryAccountResult = await dependencies.getPrimaryFinanceAccountUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!primaryAccountResult.success) {
      return createFailure(primaryAccountResult.error.message);
    }

    const resolvedAccount =
      primaryAccountResult.value ?? accountsResult.value[0] ?? null;

    if (!resolvedAccount) {
      return { success: true, value: null };
    }

    const persistResult = await persistResolvedAccountId(
      resolvedAccount.id,
      dependencies.setActiveAccountIdUseCase,
    );

    if (!persistResult.success) {
      return createFailure(persistResult.error.message);
    }

    return { success: true, value: resolvedAccount };
  },
});
