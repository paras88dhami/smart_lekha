import type { Result } from "@/shared/types/result.types";
import type { CreateTransferRecordInput, TransferRecord } from "../types/types";

export interface GetSavedTransfersUseCase {
  execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>>;
}

export interface GetScheduledTransfersUseCase {
  execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>>;
}

export interface CreateTransferRecordUseCase {
  execute(input: CreateTransferRecordInput): Promise<Result<TransferRecord>>;
}
