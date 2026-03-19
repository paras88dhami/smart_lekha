import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { ProfileDataSource } from "./profile.datasource";
import type { ProfileModel } from "./profile.model";

const getCollection = (database: Database) => {
  return database.get<ProfileModel>("profiles");
};

const mapUnknownError = (error: unknown, message: string): Error => {
  return error instanceof Error ? error : new Error(message);
};

export const createLocalProfileDataSource = (
  database: Database,
): ProfileDataSource => ({
  async getProfilesByAccountId(
    accountId: string,
  ): Promise<Result<ProfileModel[]>> {
    try {
      const records = await getCollection(database)
        .query(Q.where("account_id", accountId), Q.sortBy("created_at", Q.asc))
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load profiles by account id."),
      };
    }
  },

  async getProfileById(
    profileId: string,
  ): Promise<Result<ProfileModel | null>> {
    try {
      const record = await getCollection(database).find(profileId);

      return {
        success: true,
        value: record ?? null,
      };
    } catch {
      return {
        success: true,
        value: null,
      };
    }
  },

  async createProfile(payload: ProfileModel): Promise<Result<ProfileModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: ProfileModel) => {
          currentRecord.accountId = payload.accountId ?? "";
          currentRecord.profileType = payload.profileType;
          currentRecord.profileName = payload.profileName ?? "";
          currentRecord.displayName = payload.displayName ?? null;
          currentRecord.roleName = payload.roleName ?? null;
          currentRecord.businessCategoryId = payload.businessCategoryId ?? null;
          currentRecord.businessCategoryName = payload.businessCategoryName ?? null;
          currentRecord.isActive = payload.isActive ?? false;
          currentRecord.createdAt = timestamp;
          currentRecord.updatedAt = timestamp;
        });
      });

      return {
        success: true,
        value: record,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to create profile."),
      };
    }
  },

  async setActiveProfile(profileId: string): Promise<Result<void>> {
    try {
      const collection = getCollection(database);
      const records = await collection.query().fetch();
      const timestamp = Date.now();

      await database.write(async () => {
        for (const record of records) {
          await record.update((currentRecord: ProfileModel) => {
            currentRecord.isActive = currentRecord.id === profileId;
            currentRecord.updatedAt = timestamp;
          });
        }
      });

      return {
        success: true,
        value: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to set active profile."),
      };
    }
  },
});