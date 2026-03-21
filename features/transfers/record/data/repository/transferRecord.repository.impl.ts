import type { Result } from "@/shared/types/result.types";
import {
  normalizeTransferMethod,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import { DEFAULT_TRANSFER_METHOD } from "@/features/transfers/shared/types/transferMethod.types";
import type {
  CreateTransferRecordInput,
  TransferRecord,
  TransferRecordStatus,
} from "../../types/types";
import type {
  CreateTransferRecordPayload,
  TransferRecordDataSource,
} from "../dataSource/transferRecord.dataSource";
import type {
  TransferRecordModel,
  TransferRecordTargetType,
  TransferRecordType,
} from "../dataSource/transferRecord.model";
import type { TransferRecordRepository } from "./transferRecord.repository";

const normalizeTransferTargetType = (
  value: string | null,
): TransferRecordTargetType => {
  return value === "own_account" ? "own_account" : "beneficiary";
};

const mapRecord = (record: TransferRecordModel): TransferRecord => ({
  id: record.id,
  profileId: record.profileId.trim(),
  beneficiaryId: record.beneficiaryId.trim() || null,
  fromAccountId: record.fromAccountId?.trim() ?? null,
  toAccountId: record.toAccountId?.trim() ?? null,
  targetName: record.targetName?.trim() ?? "",
  targetType: normalizeTransferTargetType(record.targetType ?? null),
  transferMethod: normalizeTransferMethod(record.transferMethod ?? DEFAULT_TRANSFER_METHOD),
  amount: Math.max(0, record.amount),
  note: record.note?.trim() ?? null,
  recordType: record.recordType,
  scheduledFor: record.scheduledFor,
  status: record.status,
  createdAt: record.createdAt,
});

const toPayload = (
  input: CreateTransferRecordInput,
): CreateTransferRecordPayload => {
  return {
    profileId: input.profileId.trim(),
    beneficiaryId: input.beneficiaryId?.trim() ?? "",
    fromAccountId: input.fromAccountId?.trim() ?? null,
    toAccountId: input.toAccountId?.trim() ?? null,
    targetName: input.targetName.trim(),
    targetType: input.targetType,
    transferMethod: input.transferMethod,
    amount: Math.max(0, input.amount),
    note: input.note?.trim() ?? null,
    recordType: input.recordType,
    scheduledFor: input.scheduledFor ?? null,
    status: input.status,
  };
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createTransferRecordRepository = (
  localDataSource: TransferRecordDataSource,
): TransferRecordRepository => ({
  async getByProfileAndType(
    profileId: string,
    recordType: TransferRecordType,
    limit: number,
  ): Promise<Result<TransferRecord[]>> {
    const result = await localDataSource.getByProfileAndType(
      profileId.trim(),
      recordType,
      limit,
    );

    if (!result.success) {
      return createFailure<TransferRecord[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapRecord),
    };
  },

  async getDueScheduledRecords(
    profileId: string,
    scheduledUntil: number,
  ): Promise<Result<TransferRecord[]>> {
    const result = await localDataSource.getDueScheduledRecords(
      profileId.trim(),
      scheduledUntil,
    );

    if (!result.success) {
      return createFailure<TransferRecord[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapRecord),
    };
  },

  async createRecord(input: CreateTransferRecordInput): Promise<Result<TransferRecord>> {
    const result = await localDataSource.createRecord(toPayload(input));

    if (!result.success) {
      return createFailure<TransferRecord>(result.error);
    }

    return {
      success: true,
      value: mapRecord(result.value),
    };
  },

  async updateStatus(
    recordId: string,
    status: TransferRecordStatus,
  ): Promise<Result<TransferRecord>> {
    const result = await localDataSource.updateStatus(recordId.trim(), status);

    if (!result.success) {
      return createFailure<TransferRecord>(result.error);
    }

    return {
      success: true,
      value: mapRecord(result.value),
    };
  },
});
