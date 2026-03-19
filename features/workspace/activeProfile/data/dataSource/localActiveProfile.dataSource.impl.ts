import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { AppSettingModel } from "@/features/auth/appSettings/data/dataSource/appSetting.model";
import type { ProfileModel } from "@/features/auth/profile/data/dataSource/profile.model";
import type { ActiveProfileDataSource } from "./activeProfile.dataSource";
import type { ActiveProfile } from "../../types/types";

const readActiveProfile = (profile: ProfileModel): ActiveProfile | null => {
  const profileId = profile.id;
  const accountId = profile.accountId?.trim() ?? "";
  const profileName = profile.profileName?.trim() ?? "";
  const profileType = profile.profileType;

  if (!profileId || !accountId || !profileName) {
    return null;
  }

  if (profileType !== "business" && profileType !== "personal") {
    return null;
  }

  return {
    profileId,
    accountId,
    profileName,
    profileType,
  };
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to resolve active profile.");
};

export const createLocalActiveProfileDataSource = (
  database: Database,
): ActiveProfileDataSource => ({
  async getActiveProfile(): Promise<Result<ActiveProfile | null>> {
    try {
      const appSettingsCollection = database.get<AppSettingModel>("app_settings");
      const profilesCollection = database.get<ProfileModel>("profiles");

      const appSettings = await appSettingsCollection.query().fetch();
      const explicitActiveProfileId = appSettings[0]?.activeProfileId?.trim() ?? "";

      if (explicitActiveProfileId) {
        try {
          const explicitProfile = await profilesCollection.find(explicitActiveProfileId);
          const parsedProfile = readActiveProfile(explicitProfile);

          if (parsedProfile) {
            return {
              success: true,
              value: parsedProfile,
            };
          }
        } catch {
          // fallback below
        }
      }

      const activeProfiles = await profilesCollection
        .query(Q.where("is_active", true), Q.sortBy("updated_at", Q.desc))
        .fetch();

      const activeProfile = activeProfiles[0] ?? null;

      if (activeProfile) {
        const parsedProfile = readActiveProfile(activeProfile);

        return {
          success: true,
          value: parsedProfile,
        };
      }

      return {
        success: true,
        value: null,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },
});
