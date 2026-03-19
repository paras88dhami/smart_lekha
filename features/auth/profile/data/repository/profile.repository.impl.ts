import {
  AuthDatabaseError,
  ProfileNotFoundError,
} from "@/features/auth/shared/authError.types";
import type { ProfileModel } from "../dataSource/profile.model";
import type { ProfileDataSource } from "../dataSource/profile.datasource";
import type { ProfileRepository } from "./profile.repository";
import { CreateProfileRepositoryInput } from "../../types/types";

export const createProfileRepository = (
  localDataSource: ProfileDataSource,
): ProfileRepository => ({
  async getProfilesByAccountId(accountId: string) {
    const result = await localDataSource.getProfilesByAccountId(accountId.trim());

    if (!result.success) {
      return { success: false, error: AuthDatabaseError };
    }

    return {
      success: true,
      value: result.value,
    };
  },

  async getProfileById(profileId: string) {
    const result = await localDataSource.getProfileById(profileId.trim());

    if (!result.success) {
      return { success: false, error: AuthDatabaseError };
    }

    if (!result.value) {
      return { success: false, error: ProfileNotFoundError };
    }

    return {
      success: true,
      value: result.value,
    };
  },

  async createProfile(input: CreateProfileRepositoryInput) {
    const mappedPayload: ProfileModel = {
      accountId: input.accountId.trim(),
      profileType: input.profileType,
      profileName: input.profileName.trim(),
      displayName: input.displayName?.trim() ?? null,
      roleName: input.roleName?.trim() ?? null,
      businessCategoryId: input.businessCategoryId?.trim() ?? null,
      businessCategoryName: input.businessCategoryName?.trim() ?? null,
      isActive: input.isActive,
    } as ProfileModel;

    const result = await localDataSource.createProfile(mappedPayload);

    if (!result.success) {
      return { success: false, error: AuthDatabaseError };
    }

    return {
      success: true,
      value: result.value,
    };
  },

  async setActiveProfile(profileId: string) {
    const result = await localDataSource.setActiveProfile(profileId.trim());

    if (!result.success) {
      return { success: false, error: AuthDatabaseError };
    }

    return {
      success: true,
      value: undefined,
    };
  },
});