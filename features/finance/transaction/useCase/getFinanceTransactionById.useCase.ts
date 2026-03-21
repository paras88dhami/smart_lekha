import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction } from "../types/types";

export interface GetFinanceTransactionByIdUseCase {
  execute(transactionId: string): Promise<Result<FinanceTransaction>>;
}
