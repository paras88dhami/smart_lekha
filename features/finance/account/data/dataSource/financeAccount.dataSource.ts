import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountModel, FinanceAccountType } from "./financeAccount.model";

export type CreateFinanceAccountRecord = {
  profileId: string;
  accountName: string;
  accountNumber: string | null;
  accountType: FinanceAccountType;
  isPrimary: boolean;
  currencyCode: string;
  currentBalance: number;
};

export type UpdateFinanceAccountRecord = {
  accountId: string;
  accountName: string;
  accountNumber: string | null;
  accountType: FinanceAccountType;
};

export interface FinanceAccountDataSource {
  getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccountModel[]>>;
  getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccountModel | null>>;
  getAccountById(accountId: string): Promise<Result<FinanceAccountModel>>;
  createAccount(payload: CreateFinanceAccountRecord): Promise<Result<FinanceAccountModel>>;
  updateAccount(payload: UpdateFinanceAccountRecord): Promise<Result<FinanceAccountModel>>;
  archiveAccount(accountId: string): Promise<Result<void>>;
  adjustBalance(accountId: string, deltaAmount: number): Promise<Result<void>>;
  setPrimaryAccount(accountId: string): Promise<Result<void>>;
}
