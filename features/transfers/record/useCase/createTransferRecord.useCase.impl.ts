import type { Result } from "@/shared/types/result.types";
import type { CreateTransferRecordInput, TransferRecord } from "../types/types";
import type { TransferRecordRepository } from "../data/repository/transferRecord.repository";
import type { CreateTransferRecordUseCase } from "./createTransferRecord.useCase";

export const createCreateTransferRecordUseCase = (
  repository: TransferRecordRepository,
): CreateTransferRecordUseCase => ({
  async execute(input: CreateTransferRecordInput): Promise<Result<TransferRecord>> {
    return repository.createRecord(input);
  },
});
