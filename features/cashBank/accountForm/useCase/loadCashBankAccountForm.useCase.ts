import type { Result } from "@/shared/types/result.types";
import type { CashBankAccountFormData } from "../types/types";

export interface LoadCashBankAccountFormUseCase {
  execute(accountId: string | null): Promise<Result<CashBankAccountFormData>>;
}
