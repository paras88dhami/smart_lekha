import type { Result } from "@/shared/types/result.types";
import type { FinanceSummary } from "../../types/types";
import type { FinanceTransactionModel } from "./financeTransaction.model";

export interface FinanceTransactionDataSource {
  getRecentByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransactionModel[]>>;
  getByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransactionModel[]>>;
  getByAccountId(
    accountId: string,
    limit: number,
  ): Promise<Result<FinanceTransactionModel[]>>;
  getById(transactionId: string): Promise<Result<FinanceTransactionModel>>;
  createTransaction(
    payload: FinanceTransactionModel,
  ): Promise<Result<FinanceTransactionModel>>;
  updateTransaction(
    transactionId: string,
    payload: FinanceTransactionModel,
  ): Promise<Result<FinanceTransactionModel>>;
  deleteTransaction(transactionId: string): Promise<Result<void>>;
  getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>>;
}
