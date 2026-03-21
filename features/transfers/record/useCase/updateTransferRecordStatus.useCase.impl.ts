import type { Result } from "@/shared/types/result.types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type { TransferRecord } from "../types/types";
import type {
  UpdateTransferRecordStatusInput,
  UpdateTransferRecordStatusUseCase,
} from "./updateTransferRecordStatus.useCase";

export const createUpdateTransferRecordStatusUseCase = (
  repository: TransferRecordRepository,
): UpdateTransferRecordStatusUseCase => ({
  async execute(
    input: UpdateTransferRecordStatusInput,
  ): Promise<Result<TransferRecord>> {
    return repository.updateStatus(input.recordId, input.status);
  },
});
