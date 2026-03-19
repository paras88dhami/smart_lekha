import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ProfileModel } from "../data/dataSource/profile.model";
import type { ProfileRepository } from "../data/repository/profile.repository";
import type { GetProfilesByAccountIdUseCase } from "./getProfilesByAccountId.useCase";

export const createGetProfilesByAccountIdUseCase = (
  repository: ProfileRepository,
): GetProfilesByAccountIdUseCase => ({
  async execute(accountId: string): Promise<AuthResult<ProfileModel[]>> {
    return repository.getProfilesByAccountId(accountId);
  },
});
