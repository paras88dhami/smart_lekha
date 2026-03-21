import type {
  TransferRecordStatus,
  TransferRecordTargetType,
  TransferRecordType,
} from "../data/dataSource/transferRecord.model";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";

export type {
  TransferRecordStatus,
  TransferRecordTargetType,
  TransferRecordType,
};

export type TransferRecord = {
  id: string;
  profileId: string;
  beneficiaryId: string | null;
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
  createdAt: number;
};

export type CreateTransferRecordInput = {
  profileId: string;
  beneficiaryId: string | null;
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
