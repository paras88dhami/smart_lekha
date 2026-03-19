import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { FinanceAccountDataSource } from "./financeAccount.dataSource";
import type { FinanceAccountModel } from "./financeAccount.model";

const getCollection = (database: Database) => {
  return database.get<FinanceAccountModel>("finance_accounts");
};

const mapUnknownError = (error: unknown, fallbackMessage: string): Error => {
  return error instanceof Error ? error : new Error(fallbackMessage);
};

export const createLocalFinanceAccountDataSource = (
  database: Database,
): FinanceAccountDataSource => ({
  async getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccountModel[]>> {
    try {
      const records = await getCollection(database)
        .query(Q.where("profile_id", profileId), Q.sortBy("created_at", Q.asc))
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load finance accounts."),
      };
    }
  },

  async getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccountModel | null>> {
    try {
      const primaryRecord = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.where("is_primary", true),
          Q.sortBy("updated_at", Q.desc),
        )
        .fetch();

      if (primaryRecord.length > 0) {
        return {
          success: true,
          value: primaryRecord[0],
        };
      }

      const fallbackRecords = await getCollection(database)
        .query(Q.where("profile_id", profileId), Q.sortBy("created_at", Q.asc))
        .fetch();

      return {
        success: true,
        value: fallbackRecords[0] ?? null,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load primary finance account."),
      };
    }
  },

  async createAccount(payload: FinanceAccountModel): Promise<Result<FinanceAccountModel>> {
    try {
      const timestamp = Date.now();
      const collection = getCollection(database);

      const record = await database.write(async () => {
        return collection.create((currentRecord: FinanceAccountModel) => {
          currentRecord.profileId = payload.profileId?.trim() ?? "";
          currentRecord.accountName = payload.accountName?.trim() ?? "";
          currentRecord.accountNumber = payload.accountNumber?.trim() ?? null;
          currentRecord.accountType = payload.accountType;
          currentRecord.isPrimary = Boolean(payload.isPrimary);
          currentRecord.currencyCode = payload.currencyCode?.trim() ?? "NPR";
          currentRecord.currentBalance = payload.currentBalance ?? 0;
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
        error: mapUnknownError(error, "Failed to create finance account."),
      };
    }
  },

  async adjustBalance(accountId: string, deltaAmount: number): Promise<Result<void>> {
    try {
      const record = await getCollection(database).find(accountId);

      await database.write(async () => {
        await record.update((currentRecord: FinanceAccountModel) => {
          currentRecord.currentBalance =
            (currentRecord.currentBalance ?? 0) + deltaAmount;
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
        error: mapUnknownError(error, "Failed to update finance account balance."),
      };
    }
  },

  async setPrimaryAccount(accountId: string): Promise<Result<void>> {
    try {
      const collection = getCollection(database);
      const targetRecord = await collection.find(accountId);
      const profileId = targetRecord.profileId?.trim() ?? "";

      if (!profileId) {
        return {
          success: false,
          error: new Error("Invalid account profile for primary update."),
        };
      }

      const profileAccounts = await collection
        .query(Q.where("profile_id", profileId))
        .fetch();

      const timestamp = Date.now();

      await database.write(async () => {
        for (const accountRecord of profileAccounts) {
          await accountRecord.update((currentRecord: FinanceAccountModel) => {
            currentRecord.isPrimary = currentRecord.id === accountId;
            currentRecord.updatedAt = timestamp;
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
        error: mapUnknownError(error, "Failed to set primary finance account."),
      };
    }
  },
});
