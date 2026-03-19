import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ProfileRepository } from "../data/repository/profile.repository";
import type { SetActiveProfileUseCase } from "./setActiveProfile.useCase";

export const createSetActiveProfileUseCase = (
  repository: ProfileRepository,
): SetActiveProfileUseCase => ({
  async execute(profileId: string): Promise<AuthResult<void>> {
    return repository.setActiveProfile(profileId);
  },
});
