import type { Collection, Database, Query } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { HomeShortcutSeed } from "../../types/types";
import type { SaveHomeShortcutRecord } from "./homeShortcut.dataSource";
import type { HomeShortcutModel } from "./homeShortcut.model";

export const getHomeShortcutCollection = (
  database: Database,
): Collection<HomeShortcutModel> => {
  return database.get<HomeShortcutModel>("home_shortcuts");
};

export const mapHomeShortcutDataSourceError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to process home shortcuts.");
};

export const getHomeShortcutsByProfileQuery = (
  database: Database,
  profileId: string,
): Query<HomeShortcutModel> => {
  return getHomeShortcutCollection(database).query(
    Q.where("profile_id", profileId),
    Q.sortBy("sort_order", Q.asc),
  );
};

export const buildHomeShortcutRecordMap = (
  records: HomeShortcutModel[],
): Map<string, HomeShortcutModel> => {
  const recordMap = new Map<string, HomeShortcutModel>();

  for (const record of records) {
    recordMap.set(record.id, record);
  }

  return recordMap;
};

export const createDefaultHomeShortcutRecords = async (
  database: Database,
  profileId: string,
  defaults: HomeShortcutSeed[],
): Promise<void> => {
  const collection = getHomeShortcutCollection(database);
  const timestamp = Date.now();

  await database.write(async (): Promise<void> => {
    for (const shortcutSeed of defaults) {
      await collection.create((record: HomeShortcutModel): void => {
        record.profileId = profileId;
        record.shortcutKey = shortcutSeed.shortcutKey;
        record.sortOrder = shortcutSeed.sortOrder;
        record.isEnabled = true;
        record.createdAt = timestamp;
        record.updatedAt = timestamp;
      });
    }
  });
};

export const updateHomeShortcutRecords = async (
  database: Database,
  existingRecords: Map<string, HomeShortcutModel>,
  shortcuts: SaveHomeShortcutRecord[],
): Promise<void> => {
  const timestamp = Date.now();

  await database.write(async (): Promise<void> => {
    for (const shortcut of shortcuts) {
      const existingRecord = existingRecords.get(shortcut.id);

      if (!existingRecord) {
        continue;
      }

      await existingRecord.update((record: HomeShortcutModel): void => {
        record.sortOrder = shortcut.sortOrder;
        record.isEnabled = shortcut.isEnabled;
        record.updatedAt = timestamp;
      });
    }
  });
};
