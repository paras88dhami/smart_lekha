import type {
  TransferRecordStatus,
  TransferRecordType,
} from "../data/dataSource/transferRecord.model";

export type TransferRecord = {
  id: string;
  profileId: string;
  beneficiaryId: string;
  fromAccountId: string | null;
  amount: number;
  note: string | null;
  recordType: TransferRecordType;
  scheduledFor: number | null;
  status: TransferRecordStatus;
  createdAt: number;
};

export type CreateTransferRecordInput = {
  profileId: string;
  beneficiaryId: string;
  fromAccountId: string | null;
  amount: number;
  note: string | null;
  recordType: TransferRecordType;
  scheduledFor: number | null;
  status: TransferRecordStatus;
};
