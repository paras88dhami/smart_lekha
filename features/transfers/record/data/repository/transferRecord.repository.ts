import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferRecordInput,
  TransferRecord,
} from "../../types/types";

export interface TransferRecordRepository {
  getByProfileAndType(
    profileId: string,
    recordType: "saved" | "scheduled" | "instant",
    limit: number,
  ): Promise<Result<TransferRecord[]>>;
  createRecord(input: CreateTransferRecordInput): Promise<Result<TransferRecord>>;
}
