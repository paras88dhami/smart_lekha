import type { Result } from "@/shared/types/result.types";
import type { ReportTransferSummary } from "../../types/types";

export interface LoadReportsTransferSummaryUseCase {
  execute(profileId: string): Promise<Result<ReportTransferSummary>>;
}
