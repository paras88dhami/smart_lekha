import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";

export interface GetSavedTransfersUseCase {
  execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>>;
}
