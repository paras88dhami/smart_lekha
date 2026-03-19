import type { Result } from "@/shared/types/result.types";
import type { FinanceSummary } from "../types/types";

export interface GetFinanceSummaryUseCase {
  execute(profileId: string): Promise<Result<FinanceSummary>>;
}
