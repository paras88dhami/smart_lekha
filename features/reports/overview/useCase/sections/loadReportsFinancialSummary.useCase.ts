import type { Result } from "@/shared/types/result.types";
import type { ReportFinancialSummary } from "../../types/types";

export interface LoadReportsFinancialSummaryUseCase {
  execute(profileId: string): Promise<Result<ReportFinancialSummary>>;
}
