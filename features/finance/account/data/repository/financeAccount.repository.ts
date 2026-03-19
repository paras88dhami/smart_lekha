import type { Result } from "@/shared/types/result.types";
import type {
  AdjustFinanceAccountBalanceInput,
  CreateFinanceAccountInput,
  FinanceAccount,
} from "../../types/types";

export interface FinanceAccountRepository {
  getAccountsByProfileId(profileId: string): Promise<Result<FinanceAccount[]>>;
  getPrimaryAccountByProfileId(profileId: string): Promise<Result<FinanceAccount | null>>;
  createAccount(input: CreateFinanceAccountInput): Promise<Result<FinanceAccount>>;
  adjustBalance(input: AdjustFinanceAccountBalanceInput): Promise<Result<void>>;
  setPrimaryAccount(accountId: string): Promise<Result<void>>;
}
