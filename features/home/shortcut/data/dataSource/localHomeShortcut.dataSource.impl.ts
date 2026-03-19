import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { HomeShortcutSeed } from "../../types/types";
import type { HomeShortcutDataSource } from "./homeShortcut.dataSource";
import type { HomeShortcutModel } from "./homeShortcut.model";

const getCollection = (database: Database) => {
  return database.get<HomeShortcutModel>("home_shortcuts");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to process home shortcuts.");
};

export const createLocalHomeShortcutDataSource = (
  database: Database,
): HomeShortcutDataSource => ({
  async getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcutModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("is_enabled", true),
          Q.sortBy("sort_order", Q.asc),
        )
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },

  async createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>> {
    try {
      const collection = getCollection(database);
      const existingRecords = await collection
        .query(Q.where("profile_id", profileId))
        .fetch();

      if (existingRecords.length > 0) {
        return {
          success: true,
          value: undefined,
        };
      }

      const timestamp = Date.now();

      await database.write(async () => {
        for (const item of defaults) {
          await collection.create((record: HomeShortcutModel) => {
            record.profileId = profileId;
            record.shortcutKey = item.shortcutKey;
            record.sortOrder = item.sortOrder;
            record.isEnabled = true;
            record.createdAt = timestamp;
            record.updatedAt = timestamp;
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
        error: mapUnknownError(error),
      };
    }
  },
});
