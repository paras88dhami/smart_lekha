import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction, UpdateFinanceTransactionInput } from "../types/types";

export interface UpdateFinanceTransactionUseCase {
  execute(input: UpdateFinanceTransactionInput): Promise<Result<FinanceTransaction>>;
}
