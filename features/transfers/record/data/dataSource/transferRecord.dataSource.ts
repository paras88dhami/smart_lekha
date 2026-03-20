import type { Result } from "@/shared/types/result.types";
import type {
  TransferRecordModel,
  TransferRecordStatus,
  TransferRecordType,
} from "./transferRecord.model";

export type CreateTransferRecordPayload = {
  profileId: string;
  beneficiaryId: string;
  fromAccountId: string | null;
  amount: number;
  note: string | null;
  recordType: TransferRecordType;
  scheduledFor: number | null;
  status: TransferRecordStatus;
};

export interface TransferRecordDataSource {
  getByProfileAndType(
    profileId: string,
    recordType: TransferRecordType,
    limit: number,
  ): Promise<Result<TransferRecordModel[]>>;
  createRecord(payload: CreateTransferRecordPayload): Promise<Result<TransferRecordModel>>;
}
