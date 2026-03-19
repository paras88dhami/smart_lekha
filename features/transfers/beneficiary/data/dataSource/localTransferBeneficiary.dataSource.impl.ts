import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { TransferBeneficiaryDataSource } from "./transferBeneficiary.dataSource";
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
    payload: TransferBeneficiaryModel,
  ): Promise<Result<TransferBeneficiaryModel>> {
    try {
      const timestamp = Date.now();
      const collection = getCollection(database);

      const record = await database.write(async () => {
        return collection.create((currentRecord: TransferBeneficiaryModel) => {
          currentRecord.profileId = payload.profileId?.trim() ?? "";
          currentRecord.beneficiaryName = payload.beneficiaryName?.trim() ?? "";
          currentRecord.bankName = payload.bankName?.trim() ?? null;
          currentRecord.accountNumber = payload.accountNumber?.trim() ?? null;
          currentRecord.mobileNumber = payload.mobileNumber?.trim() ?? null;
          currentRecord.transferMethod = payload.transferMethod;
          currentRecord.isFavorite = Boolean(payload.isFavorite);
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
