import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type {
  CreatePaymentRecordPayload,
  PaymentRecordDataSource,
  SettlePaymentRecordPayload,
} from "./paymentRecord.dataSource";
import type { PaymentRecordModel } from "./paymentRecord.model";

const getCollection = (database: Database) => {
  return database.get<PaymentRecordModel>("payment_records");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error("Failed to process payment records.");
};

export const createLocalPaymentRecordDataSource = (
  database: Database,
): PaymentRecordDataSource => ({
  async getOpenByProfileId(profileId: string): Promise<Result<PaymentRecordModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("status", "open"),
          Q.sortBy("created_at", Q.desc),
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

  async getById(recordId: string): Promise<Result<PaymentRecordModel>> {
    try {
      const record = await getCollection(database).find(recordId);

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

  async createRecord(
    payload: CreatePaymentRecordPayload,
  ): Promise<Result<PaymentRecordModel>> {
    try {
      const timestamp = Date.now();
      const collection = getCollection(database);

      const record = await database.write(async () => {
        return collection.create((currentRecord: PaymentRecordModel) => {
          currentRecord.profileId = payload.profileId;
          currentRecord.direction = payload.direction;
          currentRecord.partyName = payload.partyName;
          currentRecord.note = payload.note;
          currentRecord.totalAmount = payload.totalAmount;
          currentRecord.settledAmount = payload.settledAmount;
          currentRecord.status = payload.status;
          currentRecord.settledAt = payload.settledAt;
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

  async settleRecord(
    payload: SettlePaymentRecordPayload,
  ): Promise<Result<PaymentRecordModel>> {
    try {
      const record = await getCollection(database).find(payload.recordId);
      const updatedAt = Date.now();

      await database.write(async () => {
        await record.update((currentRecord: PaymentRecordModel) => {
          currentRecord.settledAmount = payload.settledAmount;
          currentRecord.status = payload.status;
          currentRecord.settledAt = payload.settledAt;
          currentRecord.updatedAt = updatedAt;
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
