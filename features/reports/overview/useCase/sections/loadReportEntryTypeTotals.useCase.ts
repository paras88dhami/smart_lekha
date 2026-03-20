import type { Result } from "@/shared/types/result.types";
import type { ReportEntryTypeTotalItem } from "../../types/types";

export interface LoadReportEntryTypeTotalsUseCase {
  execute(profileId: string): Promise<Result<ReportEntryTypeTotalItem[]>>;
}
