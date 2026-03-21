import type { Result } from "@/shared/types/result.types";
import type {
  AdjustFinanceAccountBalanceInput,
  CreateFinanceAccountInput,
  FinanceAccount,
  UpdateFinanceAccountInput,
} from "../../types/types";

export interface FinanceAccountRepository {
  getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccount[]>>;
  getPrimaryAccountByProfileId(profileId: string): Promise<Result<FinanceAccount | null>>;
  getAccountById(accountId: string): Promise<Result<FinanceAccount>>;
  createAccount(input: CreateFinanceAccountInput): Promise<Result<FinanceAccount>>;
  updateAccount(input: UpdateFinanceAccountInput): Promise<Result<FinanceAccount>>;
  archiveAccount(accountId: string): Promise<Result<void>>;
  adjustBalance(input: AdjustFinanceAccountBalanceInput): Promise<Result<void>>;
  setPrimaryAccount(accountId: string): Promise<Result<void>>;
}
