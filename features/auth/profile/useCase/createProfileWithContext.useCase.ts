import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { ProfileModel } from "../data/dataSource/profile.model";
import type { CreateProfileRepositoryInput } from "../types/types";

export interface CreateProfileWithContextUseCase {
  execute(
    input: CreateProfileRepositoryInput,
  ): Promise<AuthResult<ProfileModel>>;
}
