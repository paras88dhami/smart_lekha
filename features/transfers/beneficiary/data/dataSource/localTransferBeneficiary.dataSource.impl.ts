import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type {
  CreateTransferBeneficiaryRecord,
  TransferBeneficiaryDataSource,
} from "./transferBeneficiary.dataSource";
import type { TransferBeneficiaryModel } from "./transferBeneficiary.model";

const getCollection = (database: Database) => {
  return database.get<TransferBeneficiaryModel>("transfer_beneficiaries");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to process transfer beneficiaries.");
};

export const createLocalTransferBeneficiaryDataSource = (
  database: Database,
): TransferBeneficiaryDataSource => ({
  async getByProfileId(profileId: string): Promise<Result<TransferBeneficiaryModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.sortBy("updated_at", Q.desc),
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

  async getFavoritesByProfileId(
    profileId: string,
  ): Promise<Result<TransferBeneficiaryModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("is_favorite", true),
          Q.sortBy("updated_at", Q.desc),
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

  async createBeneficiary(
    payload: CreateTransferBeneficiaryRecord,
  ): Promise<Result<TransferBeneficiaryModel>> {
    try {
      const timestamp = Date.now();
      const collection = getCollection(database);

      const record = await database.write(async () => {
        return collection.create((currentRecord: TransferBeneficiaryModel) => {
          currentRecord.profileId = payload.profileId;
          currentRecord.beneficiaryName = payload.beneficiaryName;
          currentRecord.bankName = payload.bankName;
          currentRecord.accountNumber = payload.accountNumber;
          currentRecord.mobileNumber = payload.mobileNumber;
          currentRecord.transferMethod = payload.transferMethod;
          currentRecord.isFavorite = payload.isFavorite;
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
