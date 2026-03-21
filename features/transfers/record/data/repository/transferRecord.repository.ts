import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferRecordInput,
  TransferRecord,
  TransferRecordStatus,
} from "../../types/types";

export interface TransferRecordRepository {
  getByProfileAndType(
    profileId: string,
    recordType: "saved" | "scheduled" | "instant",
    limit: number,
  ): Promise<Result<TransferRecord[]>>;
  getDueScheduledRecords(
    profileId: string,
    scheduledUntil: number,
  ): Promise<Result<TransferRecord[]>>;
  createRecord(input: CreateTransferRecordInput): Promise<Result<TransferRecord>>;
  updateStatus(
    recordId: string,
    status: TransferRecordStatus,
  ): Promise<Result<TransferRecord>>;
}
