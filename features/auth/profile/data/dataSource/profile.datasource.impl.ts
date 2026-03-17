import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type {
  CreateProfileDataSourceInput,
  ProfileDataSource,
} from "./profile.datasource";
import type { ProfileModel } from "./profile.model";

const getCollection = (database: Database) => {
  return database.get<ProfileModel>("profiles");
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
        error:
          error instanceof Error
            ? error
            : new Error("Failed to load profiles by account id"),
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

  async createProfile(
    input: CreateProfileDataSourceInput,
  ): Promise<Result<ProfileModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: ProfileModel) => {
          currentRecord.accountId = input.accountId;
          currentRecord.profileType = input.profileType;
          currentRecord.profileName = input.profileName;
          currentRecord.displayName = input.displayName;
          currentRecord.roleName = input.roleName;
          currentRecord.isActive = input.isActive;
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
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create profile"),
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
        error:
          error instanceof Error
            ? error
            : new Error("Failed to set active profile"),
      };
    }
  },
});
