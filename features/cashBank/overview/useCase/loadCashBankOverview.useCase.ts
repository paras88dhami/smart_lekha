import type { Result } from "@/shared/types/result.types";
import type { CashBankOverviewData } from "../types/types";

export interface LoadCashBankOverviewUseCase {
  execute(): Promise<Result<CashBankOverviewData>>;
}
