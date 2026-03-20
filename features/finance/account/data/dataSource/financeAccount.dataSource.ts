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

export interface FinanceAccountDataSource {
  getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccountModel[]>>;
  getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccountModel | null>>;
  createAccount(payload: CreateFinanceAccountRecord): Promise<Result<FinanceAccountModel>>;
  adjustBalance(accountId: string, deltaAmount: number): Promise<Result<void>>;
  setPrimaryAccount(accountId: string): Promise<Result<void>>;
}
