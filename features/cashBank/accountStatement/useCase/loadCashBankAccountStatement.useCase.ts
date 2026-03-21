import type { Result } from "@/shared/types/result.types";
import type { CashBankAccountStatementData } from "../types/types";

export interface LoadCashBankAccountStatementUseCase {
  execute(accountId: string): Promise<Result<CashBankAccountStatementData>>;
}
