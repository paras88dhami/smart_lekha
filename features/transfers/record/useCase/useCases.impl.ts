import type { Result } from "@/shared/types/result.types";
import type { CreateTransferRecordInput, TransferRecord } from "../types/types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type {
  CreateTransferRecordUseCase,
  GetSavedTransfersUseCase,
  GetScheduledTransfersUseCase,
} from "./types";

export const createGetSavedTransfersUseCase = (
  repository: TransferRecordRepository,
): GetSavedTransfersUseCase => ({
  async execute(
    profileId: string,
    limit: number,
  ): Promise<Result<TransferRecord[]>> {
    return repository.getByProfileAndType(profileId, "saved", limit);
  },
});

export const createGetScheduledTransfersUseCase = (
  repository: TransferRecordRepository,
): GetScheduledTransfersUseCase => ({
  async execute(
    profileId: string,
    limit: number,
  ): Promise<Result<TransferRecord[]>> {
    return repository.getByProfileAndType(profileId, "scheduled", limit);
  },
});

export const createCreateTransferRecordUseCase = (
  repository: TransferRecordRepository,
): CreateTransferRecordUseCase => ({
  async execute(
    input: CreateTransferRecordInput,
  ): Promise<Result<TransferRecord>> {
    return repository.createRecord(input);
  },
});
