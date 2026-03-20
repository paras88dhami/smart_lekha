import type { Result } from "@/shared/types/result.types";
import type { CreateTransferRecordInput, TransferRecord } from "../types/types";

export interface CreateTransferRecordUseCase {
  execute(input: CreateTransferRecordInput): Promise<Result<TransferRecord>>;
}
