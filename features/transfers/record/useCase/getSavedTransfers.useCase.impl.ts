import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type { GetSavedTransfersUseCase } from "./getSavedTransfers.useCase";

export const createGetSavedTransfersUseCase = (
  repository: TransferRecordRepository,
): GetSavedTransfersUseCase => ({
  async execute(profileId: string, limit: number): Promise<Result<TransferRecord[]>> {
    return repository.getByProfileAndType(profileId, "saved", limit);
  },
});
