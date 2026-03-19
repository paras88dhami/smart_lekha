import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ProfileModel } from "../data/dataSource/profile.model";
import type { ProfileRepository } from "../data/repository/profile.repository";
import type { CreateProfileRepositoryInput } from "../types/types";
import type { CreateProfileUseCase } from "./createProfile.useCase";

export const createCreateProfileUseCase = (
  repository: ProfileRepository,
): CreateProfileUseCase => ({
  async execute(
    input: CreateProfileRepositoryInput,
  ): Promise<AuthResult<ProfileModel>> {
    const createResult = await repository.createProfile(input);

    if (!createResult.success) {
      return createResult;
    }

    const profileId = createResult.value.id;
    const setActiveResult = await repository.setActiveProfile(profileId);

    if (!setActiveResult.success) {
      return setActiveResult;
    }

    return createResult;
  },
});
