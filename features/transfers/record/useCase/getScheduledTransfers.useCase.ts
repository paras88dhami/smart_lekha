import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";

export interface GetScheduledTransfersUseCase {
  execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>>;
}
