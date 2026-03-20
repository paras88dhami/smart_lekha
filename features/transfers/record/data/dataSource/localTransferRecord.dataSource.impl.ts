import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type {
  CreateTransferRecordPayload,
  TransferRecordDataSource,
} from "./transferRecord.dataSource";
import type {
  TransferRecordModel,
  TransferRecordType,
} from "./transferRecord.model";

const getCollection = (database: Database) => {
  return database.get<TransferRecordModel>("transfer_records");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error("Failed to process transfer records.");
};

export const createLocalTransferRecordDataSource = (
  database: Database,
): TransferRecordDataSource => ({
  async getByProfileAndType(
    profileId: string,
    recordType: TransferRecordType,
    limit: number,
  ): Promise<Result<TransferRecordModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("record_type", recordType),
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

  async createRecord(
    payload: CreateTransferRecordPayload,
  ): Promise<Result<TransferRecordModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: TransferRecordModel) => {
          currentRecord.profileId = payload.profileId;
          currentRecord.beneficiaryId = payload.beneficiaryId;
          currentRecord.fromAccountId = payload.fromAccountId;
          currentRecord.amount = payload.amount;
          currentRecord.note = payload.note;
          currentRecord.recordType = payload.recordType;
          currentRecord.scheduledFor = payload.scheduledFor;
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
