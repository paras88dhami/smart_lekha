import type { Result } from "@/shared/types/result.types";
import type { ProfileModel } from "../dataSource/profile.model";
import { AuthError } from "@/features/auth/shared/authError.types";
import { CreateProfileRepositoryInput } from "../../types/types";

export interface ProfileRepository {
  getProfilesByAccountId(
    accountId: string,
  ): Promise<Result<ProfileModel[], AuthError>>;

  getProfileById(profileId: string): Promise<Result<ProfileModel, AuthError>>;

  createProfile(
    input: CreateProfileRepositoryInput,
  ): Promise<Result<ProfileModel, AuthError>>;

  setActiveProfile(profileId: string): Promise<Result<void, AuthError>>;
}
