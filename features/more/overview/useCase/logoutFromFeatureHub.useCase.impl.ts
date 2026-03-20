import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ClearActiveAccountIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveAccountId.useCase";
import type { ClearActiveProfileIdUseCase } from "@/features/auth/appSettings/useCase/clearActiveProfileId.useCase";
import type { ClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase";
import type { LogoutFromFeatureHubUseCase } from "./logoutFromFeatureHub.useCase";

type Dependencies = {
  clearAuthSessionUseCase: ClearAuthSessionUseCase;
  clearActiveProfileIdUseCase: ClearActiveProfileIdUseCase;
  clearActiveAccountIdUseCase: ClearActiveAccountIdUseCase;
};

const executeLogout = async (dependencies: Dependencies): Promise<AuthResult<void>> => {
  const clearSessionResult = await dependencies.clearAuthSessionUseCase.execute();

  if (!clearSessionResult.success) {
    return clearSessionResult;
  }

  const [clearProfileResult, clearAccountResult] = await Promise.all([
    dependencies.clearActiveProfileIdUseCase.execute(),
    dependencies.clearActiveAccountIdUseCase.execute(),
  ]);

  if (!clearProfileResult.success) {
    return clearProfileResult;
  }

  if (!clearAccountResult.success) {
    return clearAccountResult;
  }

  return { success: true, value: undefined };
};

export const createLogoutFromFeatureHubUseCase = (
  dependencies: Dependencies,
): LogoutFromFeatureHubUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return executeLogout(dependencies);
  },
});
