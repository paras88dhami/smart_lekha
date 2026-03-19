import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AuthSessionModel } from "../data/dataSource/authSession.model";
import type { UpsertAuthSessionRepositoryInput } from "../data/repository/authSession.repository";

export interface UpsertAuthSessionUseCase {
  execute(
    input: UpsertAuthSessionRepositoryInput,
  ): Promise<AuthResult<AuthSessionModel>>;
}
