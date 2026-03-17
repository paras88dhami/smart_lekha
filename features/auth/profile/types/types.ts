import { ProfileType } from "../data/dataSource/profile.model";

export type CreateProfileRepositoryInput = {
  accountId: string;
  profileType: ProfileType;
  profileName: string;
  displayName: string | null;
  roleName: string | null;
  isActive: boolean;
};