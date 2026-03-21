import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount } from "../types/types";

export interface GetFinanceAccountByIdUseCase {
  execute(accountId: string): Promise<Result<FinanceAccount>>;
}
