import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type { GetScheduledTransfersUseCase } from "./getScheduledTransfers.useCase";

export const createGetScheduledTransfersUseCase = (
  repository: TransferRecordRepository,
): GetScheduledTransfersUseCase => ({
  async execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>> {
    return repository.getByProfileAndType(profileId, "scheduled", limit);
  },
});
