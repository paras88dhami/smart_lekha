import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction } from "../types/types";

export interface GetFinanceTransactionsByAccountUseCase {
  execute(accountId: string, limit: number): Promise<Result<FinanceTransaction[]>>;
}
