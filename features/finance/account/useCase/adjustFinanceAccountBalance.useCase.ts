import type { Result } from "@/shared/types/result.types";
import type { AdjustFinanceAccountBalanceInput } from "../types/types";

export interface AdjustFinanceAccountBalanceUseCase {
  execute(input: AdjustFinanceAccountBalanceInput): Promise<Result<void>>;
}
