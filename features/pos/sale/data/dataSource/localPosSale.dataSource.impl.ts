import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { PosSaleDataSource } from "./posSale.dataSource";
import type { PosSaleModel } from "./posSale.model";

const getCollection = (database: Database) => {
  return database.get<PosSaleModel>("pos_sales");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error("Failed to process POS sales.");
};

export const createLocalPosSaleDataSource = (
  database: Database,
): PosSaleDataSource => ({
  async getRecentByProfileId(profileId: string, limit: number): Promise<Result<PosSaleModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.sortBy("created_at", Q.desc),
          Q.take(limit),
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

  async createSale(payload: PosSaleModel): Promise<Result<PosSaleModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: PosSaleModel) => {
          currentRecord.profileId = payload.profileId?.trim() ?? "";
          currentRecord.accountId = payload.accountId?.trim() ?? null;
          currentRecord.saleNumber = payload.saleNumber?.trim() ?? "";
          currentRecord.lineItemsJson = payload.lineItemsJson ?? "[]";
          currentRecord.totalAmount = Math.max(0, payload.totalAmount ?? 0);
          currentRecord.paymentMode = payload.paymentMode;
          currentRecord.status = payload.status;
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
});
