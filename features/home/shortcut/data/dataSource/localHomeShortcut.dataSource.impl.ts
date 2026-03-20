import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { HomeShortcutSeed } from "../../types/types";
import type {
  HomeShortcutDataSource,
  SaveHomeShortcutRecord,
} from "./homeShortcut.dataSource";
import type { HomeShortcutModel } from "./homeShortcut.model";
import {
  buildHomeShortcutRecordMap,
  createDefaultHomeShortcutRecords,
  getHomeShortcutCollection,
  getHomeShortcutsByProfileQuery,
  mapHomeShortcutDataSourceError,
  updateHomeShortcutRecords,
} from "./localHomeShortcut.dataSource.helpers";

const fetchEnabledHomeShortcutRecords = async (
  database: Database,
  profileId: string,
): Promise<HomeShortcutModel[]> => {
  return getHomeShortcutCollection(database)
    .query(
      Q.where("profile_id", profileId),
      Q.where("is_enabled", true),
      Q.sortBy("sort_order", Q.asc),
    )
    .fetch();
};

export const createLocalHomeShortcutDataSource = (
  database: Database,
): HomeShortcutDataSource => ({
  async getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcutModel[]>> {
    try {
      const records = await fetchEnabledHomeShortcutRecords(database, profileId);

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapHomeShortcutDataSourceError(error),
      };
    }
  },

  async getAllShortcutsByProfileId(
    profileId: string,
  ): Promise<Result<HomeShortcutModel[]>> {
    try {
      const records = await getHomeShortcutsByProfileQuery(database, profileId).fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapHomeShortcutDataSourceError(error),
      };
    }
  },

  async createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>> {
    try {
      const existingRecords = await getHomeShortcutsByProfileQuery(database, profileId).fetch();

      if (existingRecords.length > 0) {
        return {
          success: true,
          value: undefined,
        };
      }

      await createDefaultHomeShortcutRecords(database, profileId, defaults);

      return {
        success: true,
        value: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: mapHomeShortcutDataSourceError(error),
      };
    }
  },

  async saveShortcuts(
    profileId: string,
    shortcuts: SaveHomeShortcutRecord[],
  ): Promise<Result<void>> {
    try {
      const existingRecords = await getHomeShortcutsByProfileQuery(database, profileId).fetch();
      const existingRecordMap = buildHomeShortcutRecordMap(existingRecords);
      await updateHomeShortcutRecords(database, existingRecordMap, shortcuts);

      return {
        success: true,
        value: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: mapHomeShortcutDataSourceError(error),
      };
    }
  },
});
