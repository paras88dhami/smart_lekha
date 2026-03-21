import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";

export interface GetDueScheduledTransfersUseCase {
  execute(profileId: string, scheduledUntil: number): Promise<Result<TransferRecord[]>>;
}
