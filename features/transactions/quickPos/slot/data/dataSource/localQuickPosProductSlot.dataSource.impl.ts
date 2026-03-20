import type { Result } from "@/shared/types/result.types";
import type { Collection, Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type {
  CreateQuickPosProductSlotInput,
  UpdateQuickPosProductSlotItemInput,
} from "../../types/types";
import type { QuickPosProductSlotDataSource } from "./quickPosProductSlot.dataSource";
import type { QuickPosProductSlotModel } from "./quickPosProductSlot.model";

const getCollection = (
  database: Database,
): Collection<QuickPosProductSlotModel> => {
  return database.get<QuickPosProductSlotModel>("quick_pos_product_slots");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to process quick POS product slots.");
};

export const createLocalQuickPosProductSlotDataSource = (
  database: Database,
): QuickPosProductSlotDataSource => ({
  async getSlotsByProfileId(profileId: string): Promise<Result<QuickPosProductSlotModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.sortBy("category_name", Q.asc),
          Q.sortBy("slot_order", Q.asc),
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

  async createSlot(
    input: CreateQuickPosProductSlotInput,
  ): Promise<Result<QuickPosProductSlotModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: QuickPosProductSlotModel) => {
          currentRecord.profileId = input.profileId.trim();
          currentRecord.categoryName = input.categoryName.trim();
          currentRecord.slotOrder = input.slotOrder;
          currentRecord.itemId = input.itemId?.trim() ?? null;
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

  async updateSlotItem(input: UpdateQuickPosProductSlotItemInput): Promise<Result<void>> {
    try {
      const record = await getCollection(database).find(input.slotId);

      await database.write(async () => {
        await record.update((currentRecord: QuickPosProductSlotModel) => {
          currentRecord.itemId = input.itemId?.trim() ?? null;
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
