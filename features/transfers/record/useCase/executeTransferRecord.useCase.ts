import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";

export type ExecuteTransferRecordInput = {
  transferRecord: TransferRecord;
};

export interface ExecuteTransferRecordUseCase {
  execute(input: ExecuteTransferRecordInput): Promise<Result<void>>;
}
