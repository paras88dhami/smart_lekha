import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../data/dataSource/authSession.model";
import type { AuthSessionRepository } from "../data/repository/authSession.repository";
import type { UpsertAuthSessionUseCase } from "./upsertAuthSession.useCase";

export const createUpsertAuthSessionUseCase = (
  repository: AuthSessionRepository,
): UpsertAuthSessionUseCase => ({
  async execute(input): Promise<AuthResult<AuthSessionModel>> {
    return repository.upsertSession(input);
  },
});
