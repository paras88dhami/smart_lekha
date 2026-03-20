import type { Result } from "@/shared/types/result.types";
import type { ReportsOverviewData } from "../types/types";

export interface LoadReportsOverviewUseCase {
  execute(): Promise<Result<ReportsOverviewData>>;
}
