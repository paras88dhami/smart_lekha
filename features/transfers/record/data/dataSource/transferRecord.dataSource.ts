import type { Result } from "@/shared/types/result.types";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type {
  TransferRecordModel,
  TransferRecordStatus,
  TransferRecordTargetType,
  TransferRecordType,
} from "./transferRecord.model";

export type CreateTransferRecordPayload = {
  profileId: string;
  beneficiaryId: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  targetName: string;
  targetType: TransferRecordTargetType;
  transferMethod: TransferMethod;
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
  getDueScheduledRecords(
    profileId: string,
    scheduledUntil: number,
  ): Promise<Result<TransferRecordModel[]>>;
  createRecord(payload: CreateTransferRecordPayload): Promise<Result<TransferRecordModel>>;
  updateStatus(
    recordId: string,
    status: TransferRecordStatus,
  ): Promise<Result<TransferRecordModel>>;
}
