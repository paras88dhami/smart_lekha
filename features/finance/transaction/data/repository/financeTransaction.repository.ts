import type { Result } from "@/shared/types/result.types";
import type {
  CreateFinanceTransactionInput,
  FinanceSummary,
  FinanceTransaction,
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
  createTransaction(
    input: CreateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>>;
  getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>>;
}
