import { Result } from "@/shared/types/result.types";
import type { ProfileModel } from "./profile.model";

export interface ProfileDataSource {
  getProfilesByAccountId(accountId: string): Promise<Result<ProfileModel[]>>;

  getProfileById(profileId: string): Promise<Result<ProfileModel | null>>;

  createProfile(payload: ProfileModel): Promise<Result<ProfileModel>>;

  setActiveProfile(profileId: string): Promise<Result<void>>;
}