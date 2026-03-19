import type { Result } from "@/shared/types/result.types";
import type { CreateFinanceAccountInput, FinanceAccount } from "../types/types";

export interface CreateFinanceAccountUseCase {
  execute(input: CreateFinanceAccountInput): Promise<Result<FinanceAccount>>;
}
