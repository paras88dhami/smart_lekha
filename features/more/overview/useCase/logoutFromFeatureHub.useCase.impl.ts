import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase";
import type { LogoutFromFeatureHubUseCase } from "./logoutFromFeatureHub.useCase";

type Dependencies = {
  clearAuthSessionUseCase: ClearAuthSessionUseCase;
};

const executeLogout = async (
  clearAuthSessionUseCase: ClearAuthSessionUseCase,
): Promise<AuthResult<void>> => {
  return clearAuthSessionUseCase.execute();
};

export const createLogoutFromFeatureHubUseCase = (
  dependencies: Dependencies,
): LogoutFromFeatureHubUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return executeLogout(dependencies.clearAuthSessionUseCase);
  },
});
