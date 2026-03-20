import type { Result } from "@/shared/types/result.types";
import type {
  CreatePaymentRecordInput,
  PaymentRecord,
  SettlePaymentRecordInput,
} from "../../types/types";
import type {
  CreatePaymentRecordPayload,
  PaymentRecordDataSource,
  SettlePaymentRecordPayload,
} from "../dataSource/paymentRecord.dataSource";
import type { PaymentRecordModel } from "../dataSource/paymentRecord.model";
import type { PaymentRecordRepository } from "./paymentRecord.repository";

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

const toOutstandingAmount = (record: PaymentRecordModel): number => {
  return Math.max(0, record.totalAmount - record.settledAmount);
};

const mapRecord = (record: PaymentRecordModel): PaymentRecord => ({
  id: record.id,
  profileId: record.profileId.trim(),
  direction: record.direction,
  partyName: record.partyName.trim(),
  note: record.note?.trim() ?? null,
  totalAmount: Math.max(0, record.totalAmount),
  settledAmount: Math.max(0, record.settledAmount),
  outstandingAmount: toOutstandingAmount(record),
  status: record.status,
  settledAt: record.settledAt,
  createdAt: record.createdAt,
});

const toCreatePayload = (
  input: CreatePaymentRecordInput,
): CreatePaymentRecordPayload => {
  return {
    profileId: input.profileId.trim(),
    direction: input.direction,
    partyName: input.partyName.trim(),
    note: input.note?.trim() ?? null,
    totalAmount: Math.max(0, input.totalAmount),
    settledAmount: Math.max(0, input.settledAmount),
    status: input.status,
    settledAt: input.settledAt,
  };
};

const toSettlePayload = (
  input: SettlePaymentRecordInput,
): SettlePaymentRecordPayload => {
  return {
    recordId: input.recordId.trim(),
    settledAmount: Math.max(0, input.settledAmount),
    status: input.status,
    settledAt: input.settledAt,
  };
};

export const createPaymentRecordRepository = (
  localDataSource: PaymentRecordDataSource,
): PaymentRecordRepository => ({
  async getOpenByProfileId(profileId: string): Promise<Result<PaymentRecord[]>> {
    const result = await localDataSource.getOpenByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<PaymentRecord[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapRecord),
    };
  },

  async getById(recordId: string): Promise<Result<PaymentRecord>> {
    const result = await localDataSource.getById(recordId.trim());

    if (!result.success) {
      return createFailure<PaymentRecord>(result.error);
    }

    return {
      success: true,
      value: mapRecord(result.value),
    };
  },

  async createRecord(input: CreatePaymentRecordInput): Promise<Result<PaymentRecord>> {
    const result = await localDataSource.createRecord(toCreatePayload(input));

    if (!result.success) {
      return createFailure<PaymentRecord>(result.error);
    }

    return {
      success: true,
      value: mapRecord(result.value),
    };
  },

  async settleRecord(input: SettlePaymentRecordInput): Promise<Result<PaymentRecord>> {
    const result = await localDataSource.settleRecord(toSettlePayload(input));

    if (!result.success) {
      return createFailure<PaymentRecord>(result.error);
    }

    return {
      success: true,
      value: mapRecord(result.value),
    };
  },
});
