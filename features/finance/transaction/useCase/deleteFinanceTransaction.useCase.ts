import type { Result } from "@/shared/types/result.types";

export interface DeleteFinanceTransactionUseCase {
  execute(transactionId: string): Promise<Result<void>>;
}
