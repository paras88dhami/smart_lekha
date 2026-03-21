import type { Result } from "@/shared/types/result.types";
import type {
  CreateFinanceTransactionInput,
  FinanceSummary,
  FinanceTransaction,
  UpdateFinanceTransactionInput,
} from "../../types/types";

export interface FinanceTransactionRepository {
  getRecentByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>>;
  getByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>>;
  getByAccountId(accountId: string, limit: number): Promise<Result<FinanceTransaction[]>>;
  getById(transactionId: string): Promise<Result<FinanceTransaction>>;
  createTransaction(
    input: CreateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>>;
  updateTransaction(
    input: UpdateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>>;
  deleteTransaction(transactionId: string): Promise<Result<void>>;
  getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>>;
}
