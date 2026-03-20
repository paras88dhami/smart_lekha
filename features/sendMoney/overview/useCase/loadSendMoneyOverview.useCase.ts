import type { Result } from "@/shared/types/result.types";
import type { SendMoneyOverviewData } from "../types/types";

export interface LoadSendMoneyOverviewUseCase {
  execute(): Promise<Result<SendMoneyOverviewData>>;
}
