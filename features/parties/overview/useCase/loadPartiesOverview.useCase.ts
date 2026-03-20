import type { Result } from "@/shared/types/result.types";
import type { PartiesOverviewData } from "../types/types";

export interface LoadPartiesOverviewUseCase {
  execute(): Promise<Result<PartiesOverviewData>>;
}
