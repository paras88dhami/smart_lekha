import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount, UpdateFinanceAccountInput } from "../types/types";

export interface UpdateFinanceAccountUseCase {
  execute(input: UpdateFinanceAccountInput): Promise<Result<FinanceAccount>>;
}
