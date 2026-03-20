import type { Collection, Database, Query } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { CreateFinanceAccountRecord } from "../financeAccount.dataSource";
import type { FinanceAccountModel } from "../financeAccount.model";

export const getFinanceAccountCollection = (
  database: Database,
): Collection<FinanceAccountModel> => {
  return database.get<FinanceAccountModel>("finance_accounts");
};

export const mapFinanceAccountDataSourceError = (
  error: unknown,
  fallbackMessage: string,
): Error => {
  return error instanceof Error ? error : new Error(fallbackMessage);
};

export const getFinanceAccountsByProfileQuery = (
  database: Database,
  profileId: string,
): Query<FinanceAccountModel> => {
  return getFinanceAccountCollection(database).query(
    Q.where("profile_id", profileId),
    Q.sortBy("created_at", Q.asc),
  );
};

export const createFinanceAccountRecord = async (
  database: Database,
  payload: CreateFinanceAccountRecord,
): Promise<FinanceAccountModel> => {
  const timestamp = Date.now();
  const collection = getFinanceAccountCollection(database);

  return database.write(async (): Promise<FinanceAccountModel> => {
    return collection.create((currentRecord: FinanceAccountModel): void => {
      currentRecord.profileId = payload.profileId;
      currentRecord.accountName = payload.accountName;
      currentRecord.accountNumber = payload.accountNumber;
      currentRecord.accountType = payload.accountType;
      currentRecord.isPrimary = payload.isPrimary;
      currentRecord.currencyCode = payload.currencyCode;
      currentRecord.currentBalance = payload.currentBalance;
      currentRecord.createdAt = timestamp;
      currentRecord.updatedAt = timestamp;
    });
  });
};

export const updateFinanceAccountBalance = async (
  database: Database,
  record: FinanceAccountModel,
  deltaAmount: number,
): Promise<void> => {
  await database.write(async (): Promise<void> => {
    await record.update((currentRecord: FinanceAccountModel): void => {
      currentRecord.currentBalance = currentRecord.currentBalance + deltaAmount;
      currentRecord.updatedAt = Date.now();
    });
  });
};

export const setPrimaryFinanceAccountRecord = async (
  database: Database,
  accountId: string,
  profileAccounts: FinanceAccountModel[],
): Promise<void> => {
  const timestamp = Date.now();

  await database.write(async (): Promise<void> => {
    for (const accountRecord of profileAccounts) {
      await accountRecord.update((currentRecord: FinanceAccountModel): void => {
        currentRecord.isPrimary = currentRecord.id === accountId;
        currentRecord.updatedAt = timestamp;
      });
    }
  });
};
