import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountModel } from "./financeAccount.model";

export interface FinanceAccountDataSource {
  getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccountModel[]>>;
  getPrimaryAccountByProfileId(
    profileId: string,
  ): Promise<Result<FinanceAccountModel | null>>;
  createAccount(payload: FinanceAccountModel): Promise<Result<FinanceAccountModel>>;
  adjustBalance(accountId: string, deltaAmount: number): Promise<Result<void>>;
  setPrimaryAccount(accountId: string): Promise<Result<void>>;
}
