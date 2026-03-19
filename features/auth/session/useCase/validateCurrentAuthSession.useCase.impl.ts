import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../data/dataSource/authSession.model";
import type { AuthSessionRepository } from "../data/repository/authSession.repository";
import type { ValidateCurrentAuthSessionUseCase } from "./validateCurrentAuthSession.useCase";

export const createValidateCurrentAuthSessionUseCase = (
  repository: AuthSessionRepository,
): ValidateCurrentAuthSessionUseCase => ({
  async execute(): Promise<AuthResult<AuthSessionModel | null>> {
    return repository.validateCurrentSession();
  },
});
