import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferRecordInput,
  TransferRecord,
} from "../../types/types";
import type {
  TransferRecordModel,
  TransferRecordType,
} from "../dataSource/transferRecord.model";
import type { TransferRecordDataSource } from "../dataSource/transferRecord.dataSource";
import type { TransferRecordRepository } from "./transferRecord.repository";

const mapRecord = (record: TransferRecordModel): TransferRecord => ({
  id: record.id,
  profileId: record.profileId?.trim() ?? "",
  beneficiaryId: record.beneficiaryId?.trim() ?? "",
  fromAccountId: record.fromAccountId?.trim() ?? null,
  amount: Math.max(0, record.amount ?? 0),
  note: record.note?.trim() ?? null,
  recordType: record.recordType ?? "saved",
  scheduledFor: record.scheduledFor ?? null,
  status: record.status ?? "pending",
  createdAt: record.createdAt ?? Date.now(),
});

const toPayload = (input: CreateTransferRecordInput): TransferRecordModel => {
  return {
    profileId: input.profileId.trim(),
    beneficiaryId: input.beneficiaryId.trim(),
    fromAccountId: input.fromAccountId?.trim() ?? null,
    amount: Math.max(0, input.amount),
    note: input.note?.trim() ?? null,
    recordType: input.recordType,
    scheduledFor: input.scheduledFor ?? null,
    status: input.status,
  } as TransferRecordModel;
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
});
