import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { PosItemDataSource } from "./posItem.dataSource";
import type { PosItemModel } from "./posItem.model";

const getCollection = (database: Database) => {
  return database.get<PosItemModel>("pos_items");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error("Failed to process POS items.");
};

export const createLocalPosItemDataSource = (
  database: Database,
): PosItemDataSource => ({
  async getActiveItemsByProfileId(profileId: string): Promise<Result<PosItemModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("is_active", true),
          Q.sortBy("item_name", Q.asc),
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

  async createItem(payload: PosItemModel): Promise<Result<PosItemModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: PosItemModel) => {
          currentRecord.profileId = payload.profileId?.trim() ?? "";
          currentRecord.itemName = payload.itemName?.trim() ?? "";
          currentRecord.sku = payload.sku?.trim() ?? null;
          currentRecord.unitPrice = Math.max(0, payload.unitPrice ?? 0);
          currentRecord.availableStock = Math.max(0, payload.availableStock ?? 0);
          currentRecord.isActive = Boolean(payload.isActive);
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
        error: mapUnknownError(error),
      };
    }
  },

  async updateStock(itemId: string, deltaQuantity: number): Promise<Result<void>> {
    try {
      const record = await getCollection(database).find(itemId);

      await database.write(async () => {
        await record.update((currentRecord: PosItemModel) => {
          currentRecord.availableStock = Math.max(
            0,
            (currentRecord.availableStock ?? 0) + deltaQuantity,
          );
          currentRecord.updatedAt = Date.now();
        });
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
