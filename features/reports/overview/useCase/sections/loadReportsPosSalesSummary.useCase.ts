import type { Result } from "@/shared/types/result.types";
import type { ReportPosSalesSummary } from "../../types/types";

export interface LoadReportsPosSalesSummaryUseCase {
  execute(profileId: string): Promise<Result<ReportPosSalesSummary>>;
}
