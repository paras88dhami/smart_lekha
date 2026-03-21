import type { Result } from "@/shared/types/result.types";
import type { TransferRecord, TransferRecordStatus } from "../types/types";

export type UpdateTransferRecordStatusInput = {
  recordId: string;
  status: TransferRecordStatus;
};

export interface UpdateTransferRecordStatusUseCase {
  execute(input: UpdateTransferRecordStatusInput): Promise<Result<TransferRecord>>;
}
