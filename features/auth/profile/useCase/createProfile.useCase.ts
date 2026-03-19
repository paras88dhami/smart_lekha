import type { AuthResult } from "../../shared/authError.types";
import type { ProfileModel } from "../data/dataSource/profile.model";
import type { CreateProfileRepositoryInput } from "../types/types";

export interface CreateProfileUseCase {
  execute(input: CreateProfileRepositoryInput): Promise<AuthResult<ProfileModel>>;
}
