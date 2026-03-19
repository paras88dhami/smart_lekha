import type { Result } from "@/shared/types/result.types";
import type { CreateFinanceTransactionInput, FinanceTransaction } from "../types/types";

export interface CreateFinanceTransactionUseCase {
  execute(input: CreateFinanceTransactionInput): Promise<Result<FinanceTransaction>>;
}
