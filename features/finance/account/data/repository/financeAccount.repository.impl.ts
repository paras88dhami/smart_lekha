import type {
  AdjustFinanceAccountBalanceInput,
  CreateFinanceAccountInput,
  FinanceAccount,
} from "../../types/types";
import type { FinanceAccountModel } from "../dataSource/financeAccount.model";
import type {
  CreateFinanceAccountRecord,
  FinanceAccountDataSource,
} from "../dataSource/financeAccount.dataSource";
import type { FinanceAccountRepository } from "./financeAccount.repository";
import type { Result } from "@/shared/types/result.types";

const mapFinanceAccount = (record: FinanceAccountModel): FinanceAccount => {
  return {
    id: record.id,
    profileId: record.profileId.trim(),
    accountName: record.accountName.trim(),
    accountNumber: record.accountNumber?.trim() ?? null,
    accountType: record.accountType,
    isPrimary: record.isPrimary,
    currencyCode: record.currencyCode.trim(),
    currentBalance: record.currentBalance,
  };
};

const toDataSourcePayload = (
  input: CreateFinanceAccountInput,
): CreateFinanceAccountRecord => {
  return {
    profileId: input.profileId.trim(),
    accountName: input.accountName.trim(),
    accountNumber: input.accountNumber?.trim() ?? null,
    accountType: input.accountType,
    isPrimary: input.isPrimary,
    currencyCode: input.currencyCode.trim() || "NPR",
    currentBalance: input.currentBalance,
  };
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createFinanceAccountRepository = (
  localDataSource: FinanceAccountDataSource,
): FinanceAccountRepository => ({
  async getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccount[]>> {
    const result = await localDataSource.getAccountsByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<FinanceAccount[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapFinanceAccount),
    };
  },

  async getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccount | null>> {
    const result = await localDataSource.getPrimaryAccountByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<FinanceAccount | null>(result.error);
    }

    return {
      success: true,
      value: result.value ? mapFinanceAccount(result.value) : null,
    };
  },

  async createAccount(input: CreateFinanceAccountInput): Promise<Result<FinanceAccount>> {
    const result = await localDataSource.createAccount(toDataSourcePayload(input));

    if (!result.success) {
      return createFailure<FinanceAccount>(result.error);
    }

    return {
      success: true,
      value: mapFinanceAccount(result.value),
    };
  },

  async adjustBalance(
    input: AdjustFinanceAccountBalanceInput,
  ): Promise<Result<void>> {
    return localDataSource.adjustBalance(input.accountId.trim(), input.deltaAmount);
  },

  async setPrimaryAccount(accountId: string): Promise<Result<void>> {
    return localDataSource.setPrimaryAccount(accountId.trim());
  },
});
