import type { Result } from "@/shared/types/result.types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type { TransferRecord } from "../types/types";
import type { GetDueScheduledTransfersUseCase } from "./getDueScheduledTransfers.useCase";

export const createGetDueScheduledTransfersUseCase = (
  repository: TransferRecordRepository,
): GetDueScheduledTransfersUseCase => ({
  async execute(
    profileId: string,
    scheduledUntil: number,
  ): Promise<Result<TransferRecord[]>> {
    return repository.getDueScheduledRecords(profileId, scheduledUntil);
  },
});
