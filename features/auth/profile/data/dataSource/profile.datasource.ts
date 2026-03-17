import { ProfileModel, ProfileType } from "./profile.model";

export interface ProfileDataSource {
  getProfilesByAccountId(accountId: string): Promise<ProfileModel[]>;
  createProfile(input: {
    accountId: string;
    profileType: ProfileType;
    profileName: string;
    displayName?: string | null;
    roleName?: string | null;
    isActive: boolean;
  }): Promise<ProfileModel>;
  setActiveProfile(profileId: string): Promise<void>;
}
