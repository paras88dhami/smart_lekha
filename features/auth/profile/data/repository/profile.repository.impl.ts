import {
  AuthDatabaseError,
  ProfileNotFoundError,
} from "@/features/auth/shared/authError.types";
import type { ProfileDataSource } from "../dataSource/profile.datasource";
import type { ProfileRepository } from "./profile.repository";
import { CreateProfileRepositoryInput } from "../../types/types";

export const createProfileRepository = (
  local: ProfileDataSource,
): ProfileRepository => ({
  async getProfilesByAccountId(accountId: string) {
    const result = await local.getProfilesByAccountId(accountId.trim());

    return result.success
      ? { success: true, value: result.value }
      : { success: false, error: AuthDatabaseError };
  },

  async getProfileById(profileId: string) {
    const result = await local.getProfileById(profileId.trim());

    if (!result.success) {
      return { success: false, error: AuthDatabaseError };
    }

    if (!result.value) {
      return { success: false, error: ProfileNotFoundError };
    }

    return { success: true, value: result.value };
  },

  async createProfile(input: CreateProfileRepositoryInput) {
    const result = await local.createProfile({
      accountId: input.accountId.trim(),
      profileType: input.profileType,
      profileName: input.profileName.trim(),
      displayName: input.displayName?.trim() ?? null,
      roleName: input.roleName?.trim() ?? null,
      isActive: input.isActive,
    });

    return result.success
      ? { success: true, value: result.value }
      : { success: false, error: AuthDatabaseError };
  },

  async setActiveProfile(profileId: string) {
    const result = await local.setActiveProfile(profileId.trim());

    return result.success
      ? { success: true, value: undefined }
      : { success: false, error: AuthDatabaseError };
  },
});
