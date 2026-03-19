import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../data/dataSource/authSession.model";
import type { AuthSessionRepository } from "../data/repository/authSession.repository";
import type { GetCurrentAuthSessionUseCase } from "./getCurrentAuthSession.useCase";

export const createGetCurrentAuthSessionUseCase = (
  repository: AuthSessionRepository,
): GetCurrentAuthSessionUseCase => ({
  async execute(): Promise<AuthResult<AuthSessionModel | null>> {
    return repository.getCurrentSession();
  },
});
