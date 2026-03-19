import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionRepository } from "../data/repository/authSession.repository";
import type { ClearAuthSessionUseCase } from "./clearAuthSession.useCase";

export const createClearAuthSessionUseCase = (
  repository: AuthSessionRepository,
): ClearAuthSessionUseCase => ({
  async execute(): Promise<AuthResult<void>> {
    return repository.clearSession();
  },
});
