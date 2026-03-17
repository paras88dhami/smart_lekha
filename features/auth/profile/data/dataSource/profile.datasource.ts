import { Result } from "@/shared/types/result.types";
import type { ProfileModel, ProfileType } from "./profile.model";

export type CreateProfileDataSourceInput = {
  accountId: string;
  profileType: ProfileType;
  profileName: string;
  displayName: string | null;
  roleName: string | null;
  isActive: boolean;
};

export interface ProfileDataSource {
  getProfilesByAccountId(accountId: string): Promise<Result<ProfileModel[]>>;

  getProfileById(profileId: string): Promise<Result<ProfileModel | null>>;

  createProfile(
    input: CreateProfileDataSourceInput,
  ): Promise<Result<ProfileModel>>;

  setActiveProfile(profileId: string): Promise<Result<void>>;
}
