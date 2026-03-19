import type { Result } from "@/shared/types/result.types";
import type { FinanceTransaction } from "../types/types";

export interface GetFinanceTransactionsUseCase {
  execute(profileId: string, limit: number): Promise<Result<FinanceTransaction[]>>;
}
