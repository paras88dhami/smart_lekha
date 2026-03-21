import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import type {
  CreateFinanceAccountRecord,
  FinanceAccountDataSource,
  UpdateFinanceAccountRecord,
} from "./financeAccount.dataSource";
import type { FinanceAccountModel } from "./financeAccount.model";
import {
  archiveFinanceAccountRecord,
  createFinanceAccountRecord,
  getFinanceAccountCollection,
  getFinanceAccountsByProfileQuery,
  mapFinanceAccountDataSourceError,
  setPrimaryFinanceAccountRecord,
  updateFinanceAccountRecord,
  updateFinanceAccountBalance,
} from "./helpers/localFinanceAccount.dataSource.helpers";

const createFailure = <T>(error: unknown, message: string): Result<T> => {
  return {
    success: false,
    error: mapFinanceAccountDataSourceError(error, message),
  };
};

export const createLocalFinanceAccountDataSource = (
  database: Database,
): FinanceAccountDataSource => ({
  async getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccountModel[]>> {
    try {
      const accounts = await getFinanceAccountsByProfileQuery(database, profileId).fetch();
      return { success: true, value: accounts };
    } catch (error) {
      return createFailure(error, "Failed to load finance accounts.");
    }
  },

  async getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccountModel | null>> {
    try {
      const accounts = await getFinanceAccountsByProfileQuery(database, profileId).fetch();
      const primaryAccount = accounts.find((account) => account.isPrimary) ?? null;
      return { success: true, value: primaryAccount };
    } catch (error) {
      return createFailure(error, "Failed to load the primary finance account.");
    }
  },

  async createAccount(
    payload: CreateFinanceAccountRecord,
  ): Promise<Result<FinanceAccountModel>> {
    try {
      const account = await createFinanceAccountRecord(database, payload);
      return { success: true, value: account };
    } catch (error) {
      return createFailure(error, "Failed to create the finance account.");
    }
  },

  async getAccountById(accountId: string): Promise<Result<FinanceAccountModel>> {
    try {
      const account = await getFinanceAccountCollection(database).find(accountId);
      return { success: true, value: account };
    } catch (error) {
      return createFailure(error, "Failed to load the finance account.");
    }
  },

  async updateAccount(
    payload: UpdateFinanceAccountRecord,
  ): Promise<Result<FinanceAccountModel>> {
    try {
      const account = await getFinanceAccountCollection(database).find(payload.accountId);
      const updatedAccount = await updateFinanceAccountRecord(database, account, payload);
      return { success: true, value: updatedAccount };
    } catch (error) {
      return createFailure(error, "Failed to update the finance account.");
    }
  },

  async archiveAccount(accountId: string): Promise<Result<void>> {
    try {
      const account = await getFinanceAccountCollection(database).find(accountId);
      await archiveFinanceAccountRecord(database, account);
      return { success: true, value: undefined };
    } catch (error) {
      return createFailure(error, "Failed to archive the finance account.");
    }
  },

  async adjustBalance(accountId: string, deltaAmount: number): Promise<Result<void>> {
    try {
      const account = await getFinanceAccountCollection(database).find(accountId);
      await updateFinanceAccountBalance(database, account, deltaAmount);
      return { success: true, value: undefined };
    } catch (error) {
      return createFailure(error, "Failed to update the finance account balance.");
    }
  },

  async setPrimaryAccount(accountId: string): Promise<Result<void>> {
    try {
      const selectedAccount = await getFinanceAccountCollection(database).find(accountId);
      const profileAccounts = await getFinanceAccountsByProfileQuery(
        database,
        selectedAccount.profileId,
      ).fetch();
      await setPrimaryFinanceAccountRecord(database, accountId, profileAccounts);
      return { success: true, value: undefined };
    } catch (error) {
      return createFailure(error, "Failed to update the primary finance account.");
    }
  },
});
