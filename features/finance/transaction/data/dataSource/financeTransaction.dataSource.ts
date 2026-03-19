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
  createTransaction(
    payload: FinanceTransactionModel,
  ): Promise<Result<FinanceTransactionModel>>;
  getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>>;
}
